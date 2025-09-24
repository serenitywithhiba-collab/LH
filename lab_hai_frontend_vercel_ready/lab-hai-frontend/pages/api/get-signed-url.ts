import type { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key, expires } = req.query
  if (!key) return res.status(400).json({ error: 'key required' })
  const s3 = new AWS.S3({ region: process.env.AWS_REGION })
  const url = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: String(key), Expires: Number(expires||3600) })
  res.status(200).json({ ok:true, url })
}
