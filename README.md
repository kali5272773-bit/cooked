# HOW COOKED AM I? 💀

A mobile-first chaotic meme diagnostic game built with React + Vite + Framer Motion + Three.js / React Three Fiber.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The production files are generated in `dist/`.

## Deploy directly with Cloudflare Pages

### Option A — Cloudflare Dashboard (recommended)

1. Push this project to GitHub.
2. Open Cloudflare Dashboard → **Workers & Pages**.
3. Create a new **Pages** project and connect your GitHub repository.
4. Set:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy.

Every new push to the selected branch can then trigger a new deployment.

### Option B — Wrangler CLI

Install Wrangler:

```bash
npm install
```

Authenticate:

```bash
npx wrangler login
```

Build:

```bash
npm run build
```

Deploy:

```bash
npx wrangler pages deploy dist --project-name how-cooked-am-i
```

If the Pages project does not exist yet, Wrangler will guide you through creating it.

## GitHub Actions

A workflow is included at:

`.github/workflows/deploy.yml`

It deploys the `dist` folder to Cloudflare Pages whenever you push to `main`.

For the workflow, add these GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token needs permission to deploy/manage Cloudflare Pages projects.

## Features

- Cyberpunk / arcade / meme UI
- Three.js / React Three Fiber 3D scanner
- Framer Motion transitions
- Mobile-first Android design
- Adaptive lightweight 3D
- 9-question diagnostic
- Random meme reactions
- Multiple roast levels
- 10 ridiculous statistics
- Secret ending
- Local Instagram-style 9:16 result image generation
- Web Share API
- Copy result
- Friend challenge
- Optional Web Audio sound
- No backend or database required
