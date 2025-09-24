import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import nodemailer from 'nodemailer'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, hash } = req.body
  if (!email || !hash) return res.status(400).json({ error: 'email and hash required' })
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString()
  await prisma.oTP.upsert({ where: { hash }, update: { otp, email, createdAt: new Date() }, create: { hash, otp, email, createdAt: new Date() } })
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT||587), secure:false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  const info = await transporter.sendMail({ from: process.env.SIGNATURE_FROM || 'no-reply@labhibalogique.org', to: email, subject: `Your OTP to sign report ${hash}`, text: `Your OTP code is ${otp}. It expires in 10 minutes.` })
  return res.status(200).json({ ok:true, sent: info.messageId })
}
