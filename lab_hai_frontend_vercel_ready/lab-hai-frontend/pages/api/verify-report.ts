import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hash } = req.query
  if (!hash) return res.status(400).json({ ok:false, error: 'No hash provided' })
  const rec = await prisma.report.findUnique({ where: { hash: String(hash) }, include: { signatures: true } })
  if (!rec) return res.status(404).json({ ok:false, verified:false })
  // produce signed URL if pdf exists
  const AWS = require('aws-sdk')
  const s3 = new AWS.S3({ region: process.env.AWS_REGION })
  let signedUrl = null
  if (rec.pdfUrl) {
    signedUrl = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: rec.pdfUrl, Expires: 3600 })
  }
  return res.status(200).json({ ok:true, verified:true, meta: { ...rec, pdfUrl: signedUrl } })
}
