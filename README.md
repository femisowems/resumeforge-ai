# ResumeForge AI 🚀

**Land more interviews by letting AI tailor your resume to every job — in seconds.**

ResumeForge AI analyzes your existing resume alongside any job description and produces a polished, targeted resume that is optimized to pass automated screening tools and catch a recruiter's eye.

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🎨 **Visual WYSIWYG Editor** | Edit your resume like a Pro. Bold, highlight, and format your text visually — no Markdown knowledge required. |
| 🎭 **Premium Templates** | Switch between **Classic, Modern, Minimalist, and Executive** styles with one click. |
| 👀 **Live Preview** | See your changes update instantly on a professional "Page-on-Desk" preview. |
| 🎯 **Smart AI Alignment** | automatically highlights and inserts the right keywords from the job description so your resume isn't filtered out. |
| ⚡ **Instant Generation** | Get a fully tailored resume from your PDF/DOCX source in under 30 seconds. |
| 💎 **Skill Badges** | Highlight key skills and turn them into stylish, colored pill badges for extra impact. |
| 📥 **PDF & Docx Export** | Download your polished resume as a clean PDF or Word document. |

---

## 🗺️ How It Works

1. **Upload Your Resume** — Drop in your existing PDF or Word file.
2. **Paste the Job Description** — Copy the listing from any job board.
3. **Generate & Polish** — Let AI tailor the content, then use the **Visual Editor** to add your personal touch.
4. **Choose Your Style** — Switch templates to find the perfect look.
5. **Export** — Download your optimized PDF or DOCX and start applying!

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
│   ├── web/        # Next.js 16 frontend — TipTap WYSIWYG, TailwindCSS, Zustand
│   └── api/        # NestJS backend — Google Gemini AI, BullMQ queues, PDF/DOCX processing
├── packages/
│   └── types/      # Shared TypeScript types across the monorepo
└── package.json    # Monorepo workspaces & centralized scripts
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
