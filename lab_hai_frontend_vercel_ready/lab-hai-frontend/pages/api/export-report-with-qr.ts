import type { NextApiRequest, NextApiResponse } from 'next'
import PDFDocument from 'pdfkit'
import { createHash } from 'crypto'
import QRCode from 'qrcode'
import { Buffer } from 'buffer'
import AWS from 'aws-sdk'
import prisma from '../../lib/prisma'
export const config = { api: { bodyParser: { sizeLimit: '30mb' } } }
const s3 = new AWS.S3({ region: process.env.AWS_REGION })
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body
    // build PDF into buffer
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const buffers: Buffer[] = []
    doc.on('data', (chunk)=>buffers.push(Buffer.from(chunk)))
    doc.fontSize(26).fillColor('#000').text('Clinical Imaging Analysis Report', { align: 'center' })
    doc.moveDown(1)
    doc.fontSize(12).text(`Patient ID: ${data.patient?.id || 'N/A'}`)
    doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`)
    doc.moveDown(1)
    if (data.chartImage) {
      const base64 = data.chartImage.replace(/^data:image\/(png|jpeg);base64,/, '')
      const imgBuf = Buffer.from(base64, 'base64')
      try { doc.addPage(); doc.image(imgBuf, { fit: [450,300] }) } catch(e){ console.error(e) }
    }
    doc.end()
    await new Promise((resolve)=>doc.on('end', resolve))
    const pdfBuffer = Buffer.concat(buffers)
    const hash = createHash('sha256').update(pdfBuffer).digest('hex')
    // upload pdf to S3 private
    const bucket = process.env.S3_BUCKET
    if (!bucket) return res.status(500).json({ error: 'S3_BUCKET not configured' })
    const key = `reports/${hash}.pdf`
    await s3.putObject({ Bucket: bucket, Key: key, Body: pdfBuffer, ContentType: 'application/pdf', ACL: 'private' }).promise()
    // store metadata in Postgres via Prisma
    const report = await prisma.report.upsert({
      where: { hash },
      update: { pdfUrl: key, generatedAt: new Date(data.generatedAt), model: data.meta?.model || 'HAI-v1.2', filename: `LabHiba_Report_${data.patient?.id || 'unknown'}.pdf`, patientId: data.patient?.id || null },
      create: { hash, pdfUrl: key, generatedAt: new Date(data.generatedAt), model: data.meta?.model || 'HAI-v1.2', filename: `LabHiba_Report_${data.patient?.id || 'unknown'}.pdf`, patientId: data.patient?.id || null }
    })
    // generate signed GET URL (1 hour)
    const signedUrl = s3.getSignedUrl('getObject', { Bucket: bucket, Key: key, Expires: 3600 })
    const host = process.env.NEXT_PUBLIC_APP_URL || (`https://${req.headers.host}`)
    const verifyUrl = `${host}/api/verify-report?hash=${hash}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl)
    return res.status(200).json({ ok:true, hash, pdfUrl: signedUrl, verifyUrl, qrDataUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate report', details: String(err) })
  }
}
