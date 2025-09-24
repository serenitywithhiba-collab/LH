Lab Hibalogique — HAI Frontend (Vercel-ready, debugged)
-----------------------------------------------------

This Next.js app includes:
- PDF generation with QR verification uploaded to S3
- Postgres metadata store via Prisma
- OTP-based clinician signature which uploads signed PDF to S3
- Signed GET URLs for downloading images and reports
- Fully debugged for Vercel deployment

Required ENV variables (.env.example provided):
- DATABASE_URL (Postgres connection string)
- S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- NEXT_PUBLIC_APP_URL
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SIGNATURE_FROM

Debug Notes:
1. Run `npm install` before building.
2. Generate Prisma client: `npx prisma generate`
3. Apply migrations: `npx prisma migrate deploy` or `npx prisma db push` for dev
4. Start locally: `npm run dev`
5. Build for production: `npm run build`

On Vercel:
- Set all env vars exactly as listed in .env.example
- Ensure Postgres is reachable from Vercel
- Ensure S3 bucket policy allows putObject and getObject
- PDFs and images use signed GET URLs for direct desktop download
