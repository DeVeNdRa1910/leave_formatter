# Thoughtwin Employee Leave & WFH Email Generator

A modern, AI-powered web application for Thoughtwin IT Solutions employees to generate professional leave and WFH request emails using Anthropic Claude via Azure AI Foundry.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Anthropic Claude via Azure AI Foundry
- **Deployment**: Vercel (Serverless Functions)

## Local Development

### 1. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_FOUNDRY_API_KEY=your_azure_api_key
ANTHROPIC_FOUNDRY_BASE_URL=https://your-resource.services.ai.azure.com/models
ANTHROPIC_MODEL=your-claude-deployment-name
```

> **Important**: Set `ANTHROPIC_MODEL` to the **exact deployment name** you created in Azure AI Foundry (e.g., `claude-3-5-sonnet`, not the model ID).

### 2. Install dependencies

```bash
npm install
```

### 3. Start both servers

**Terminal 1 — Vite frontend:**
```bash
npm run dev
```

**Terminal 2 — Local API server:**
```bash
npm run dev:api
```

Or run both together:
```bash
npm run dev:full
```

The app will be at **http://localhost:5173**

The Vite proxy forwards `/api/*` requests to the local Node API server on port 3001, keeping your credentials server-side.

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set these environment variables in Vercel dashboard:
   - `ANTHROPIC_FOUNDRY_API_KEY`
   - `ANTHROPIC_FOUNDRY_BASE_URL`
   - `ANTHROPIC_MODEL`
4. Deploy — Vercel auto-detects Vite and deploys `api/generate-email.ts` as a serverless function.

## Project Structure

```
frontend/
├── api/
│   └── generate-email.ts     # Vercel serverless function (secure AI integration)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LeaveTypeSelector.tsx
│   │   ├── LeaveForm.tsx
│   │   ├── WFHForm.tsx
│   │   ├── EmailPreview.tsx
│   │   ├── LoadingAnimation.tsx
│   │   ├── Toast.tsx
│   │   └── Footer.tsx
│   ├── services/
│   │   └── aiService.ts      # API client
│   ├── types/
│   │   └── leave.ts          # TypeScript types
│   ├── utils/
│   │   └── validation.ts     # Form validation
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.mjs                # Local dev API server
├── .env.example
├── vercel.json
└── vite.config.ts
```

## Security

- The Azure API key is **never exposed to the browser**.
- All LLM calls go through the serverless function (`/api/generate-email`).
- Never use `VITE_` prefix for secret keys.
