import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ analysis: { wrinkles:0.4, redness:0.1, pores:0.3, pigmentation:0.2 } })
}
