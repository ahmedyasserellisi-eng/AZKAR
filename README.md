# أذكار 🌿

Mobile-first Arabic azkar web app built with Next.js, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload this project (all files except node_modules).
3. Import the repository into Vercel.
4. Framework preset: Next.js.
5. No environment variables are required for this MVP.

## Important content note
The starter dataset is intentionally small. Before public launch, verify every Arabic text, repetition count and source/takhrij against a trusted scholarly/reference source, then expand `lib/adhkar.ts`.

## Local data
Progress, favorites, theme and font size are stored in localStorage. No account or database is needed for V1.
