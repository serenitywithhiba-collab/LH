Inference microservice (Flask) — Vercel/Docker-ready
----------------------------------------------------
Endpoints:
- POST /analyze { "imageUrl": "..."} => returns analysis JSON

Build & Run:
1. docker build -t lab-hai-inference .
2. docker run -p 5000:5000 lab-hai-inference

No environment variables required for basic service.
