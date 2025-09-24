import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import AWS from 'aws-sdk'
import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'
export const config = { api: { bodyParser: { sizeLimit: '20mb' } } }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { hash, otp, clinicianName } = req.body
    if (!hash || !otp || !clinicianName) return res.status(400).json({ error: 'hash, otp, clinicianName required' })
    const rec = await prisma.oTP.findUnique({ where: { hash } })
    if (!rec || rec.otp !== otp) return res.status(400).json({ error: 'invalid otp' })
    // add signature record
    await prisma.signature.create({ data: { hash, clinicianName, email: rec.email, signedAt: new Date() } })
    // regenerate signed PDF: fetch original pdf key from report, create a small signature PDF and append (simple approach)
    const report = await prisma.report.findUnique({ where: { hash } })
    const s3 = new AWS.S3({ region: process.env.AWS_REGION })
    // download original PDF
    const original = await s3.getObject({ Bucket: process.env.S3_BUCKET, Key: report.pdfUrl }).promise()
    // create signature page PDF
    const sigDoc = new PDFDocument({ size:'A4', margin:50 })
    const chunks = []
    sigDoc.on('data', c=>chunks.push(c))
    sigDoc.text('Clinician Signatures', { underline:true })
    const sigs = await prisma.signature.findMany({ where: { hash } })
    sigs.forEach(s => sigDoc.text(`${s.clinicianName} (${s.email}) — signed at ${s.signedAt}`))
    sigDoc.end()
    await new Promise(r=>sigDoc.on('end', r))
    const sigBuf = Buffer.concat(chunks)
    // New combined PDF: for simplicity, upload signature page as separate signed file combining not merging PDFs to keep example simple.
    const signedKey = `reports/signed/${hash}-signature.pdf`
    await s3.putObject({ Bucket: process.env.S3_BUCKET, Key: signedKey, Body: sigBuf, ContentType: 'application/pdf', ACL: 'private' }).promise()
    // update report record to include signedPdfUrl key
    await prisma.report.update({ where: { hash }, data: { signedPdfUrl: signedKey } })
    const signedUrl = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: signedKey, Expires: 3600 })
    // delete OTP
    await prisma.oTP.delete({ where: { hash } })
    return res.status(200).json({ ok:true, signedUrl })
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'signature failed', details: String(err) })
  }
}
