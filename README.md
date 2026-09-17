# HEALTHBOT — Prescription & Symptom Safety Prototype

HEALTHBOT is an educational safety prototype web application designed to demonstrate browser-based OCR prescription scanning, medicine ingredient confirmation, duplicate ingredient detection, and evidence-backed drug-interaction review using official public government APIs (RxNorm, openFDA, DailyMed) and Gemini 3.6 Flash.

---

## What HEALTHBOT Does and Does Not Do

### What it DOES:
- **100% Browser-Only OCR Scanning:** Uses Tesseract.js directly inside your web browser to extract visible text lines from uploaded prescription images without uploading files anywhere.
- **Medicine Confirmation & Ingredient Normalization:** Allows you to review, edit, and confirm generic active ingredients, strengths, forms, and schedules.
- **Duplicate Ingredient Detection:** Automatically detects duplicate generic ingredients across multiple brand-name medicines and alerts you to ask a pharmacist for review.
- **Emergency Red-Flag Routing:** Immediately displays a full-screen local emergency warning if severe emergency red-flag symptoms are selected.
- **Public Evidence Retrieval:** Fetches official US label evidence from RxNorm, openFDA, and DailyMed.
- **AI Evidence Summarization:** Uses server-side Gemini 3.6 Flash to summarize official label evidence in plain language.

### What it DOES NOT Do:
- **It does NOT provide medical diagnosis or advice.**
- **It does NOT replace a licensed doctor or pharmacist.**
- **It does NOT tell you to start, stop, or change any medication.**
- **It does NOT store, save, or track personal health information (PHI) or patient names.**
- **It does NOT send images or raw OCR text over the internet.**

---

## How to Install and Run Locally

### 1. Prerequisites
Make sure Node.js (version 18 or later) is installed on your computer.

### 2. Set Up Environment Variables
Copy `.env.example` to create `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` in your code editor and insert your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> [!WARNING]
> **NEVER add `GEMINI_API_KEY` to GitHub or public repositories.** `.env.local` is listed in `.gitignore` to protect your key.

---

## Exact Commands

### Install Dependencies:
```bash
npm install
```

### Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Unit Tests:
```bash
npm test
```

### Build for Production:
```bash
npm run build
```

---

## How to Deploy to Vercel

1. Push your code to a private GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your HEALTHBOT repository.
4. Under **Environment Variables**, add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *Your Google Gemini API Key*
5. Click **Deploy**. Vercel will automatically build and publish your application.

---

## Important Free Tier & Demo Reminders

> [!IMPORTANT]
> - **Free Tier Limits:** Vercel and Gemini free tiers have usage rate limits and are intended for a personal educational prototype.
> - **Use Fictional Demo Data:** Only use fictional demo medicine names and sample inputs on free tiers. Do not enter real personal health information.
