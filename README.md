# ResumeForge AI 🚀

**Land more interviews by letting AI tailor your resume to every job — in seconds.**

ResumeForge AI analyzes your existing resume alongside any job description and produces a polished, targeted resume that is optimized to pass automated screening tools and catch a recruiter's eye.

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🎯 **Smart Keyword Matching** | Automatically highlights and inserts the right keywords from the job description so your resume isn't filtered out before a human sees it. |
| ⚡ **Instant Generation** | Upload your resume, paste a job description, and get a fully tailored resume in under 30 seconds. |
| 📊 **Match Score** | See a real-time score showing how well your resume aligns with the job before you apply. |
| 📄 **Multiple File Formats** | Upload your resume as a PDF or Word document (.docx) — no re-typing needed. |
| 📥 **PDF Export** | Download your new, tailored resume as a clean, professional PDF. |

---

## 🗺️ How It Works

1. **Upload Your Resume** — Drop in your existing PDF or Word file.
2. **Paste the Job Description** — Copy the listing from any job board and paste it in.
3. **Get Your Tailored Resume** — Click **Generate** and download your optimized resume.

---

## 🚀 Getting Started

### What You Need First

- [Node.js 18+](https://nodejs.org) — for the monorepo workspace
- [PostgreSQL](https://www.postgresql.org) — the database
- [Redis](https://redis.io) — for BullMQ background jobs

### 1. Install Dependencies

```bash
# This installs dependencies for the root, api, web, and shared types workspaces all at once
npm install
```

### 2. Start the Application

```bash
# Starts both the NestJS API and Next.js frontend concurrently
# API will run on http://localhost:3001
# Web will run on http://localhost:3000
npm run dev
```

Then open **http://localhost:3000** in your browser and you're ready to go!

---

## 🏗️ Project Layout

```
resumeforge-ai/
├── apps/
│   ├── web/        # Next.js 14 frontend — React, TailwindCSS, Zustand
│   └── api/        # NestJS backend — Auth, BullMQ queues, Gemini AI integration
├── packages/
│   └── types/      # Shared TypeScript types for full-stack consistency
└── package.json    # Root npm workspace commands
```

---

## 💡 Free to Try

- ✅ No credit card required to sign up
- ✅ 2 free resume generations included
- ✅ PDF export always included

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source. See the `LICENSE` file for details.
