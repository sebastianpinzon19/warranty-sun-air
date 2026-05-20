Neon + Vercel deployment instructions

1) Create a Neon (Postgres) project
   - Go to https://neon.tech or the Neon dashboard in Vercel
   - Create a new database and copy the DATABASE_URL (connection string)

2) Add `DATABASE_URL` secret to Vercel
   - In your Vercel project settings (for the warranty-system deployment), add a new Environment Variable named `DATABASE_URL` with the Neon connection string.
   - For security, add it as a Production and Preview variable.

3) Link repo and set Root Directory
   - If you want two separate Vercel projects using the same repo, create one project pointing to the repository root (this app) and another project that sets the "Root Directory" to `warranty-system`.

4) Deploy
   - After the env var is set, push to the repository main branch or trigger a deployment in Vercel.

5) Optional: Provide Vercel Token for automated deployment
   - If you want me to perform the deployment for you, provide a Vercel Personal Token and confirm repository access. I will then:
     - Create two Vercel projects (root and `warranty-system` subdirectory)
     - Add the `DATABASE_URL` secret (you must also provide the Neon connection string or grant access to create it)

Notes
   - The backend now uses `process.env.DATABASE_URL` to connect to Neon/Postgres via the `pg` package.
   - Table `warranties` will be created automatically on first server start.
