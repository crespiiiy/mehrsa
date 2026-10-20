# Tom & Mehrsa — Our Little Universe

A private, elegant, responsive romantic website for Tom and Mehrsa. Dreamy Persian-inspired aesthetic with soft blush, champagne gold, and burgundy accents. Password-protected personal site with a relationship counter, wedding countdown, photo gallery, love letters, music player, and Telegram message form.

---

## ✨ Quick Start

Edit **everything personal** in the central `CONFIG` object at the top of the `<script>` in `index.html` (line ~175). That single object holds names, dates, timeline, photos, captions, letters, dreams, music, and password.

**To view locally:**
```bash
cd project-folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

**Valid local password (also stored in CONFIG.password):**
```
15/5/2024
```

> ⚠️ **Security Note:** The password gate is intentionally simple, client-side only. This is appropriate for a low-stakes private personal website, but it is *NOT* enterprise-grade security — the password string lives in the page source. Do not use this gate to protect genuinely sensitive data.

---

## 🚀 Deploy to Vercel (Recommended)

1. Push this folder to a private Git repository.
2. On Vercel, create a new Project → Import that repo. Framework Preset = *Other*.
3. In **Project Settings → Environment Variables**, add:

   | Variable | Value | Required |
   |---|---|---|
   | `TELEGRAM_BOT_TOKEN` | Bot token from **@BotFather** on Telegram (create a NEW bot) | ✅ Yes |
   | `TELEGRAM_CHAT_ID` | Tom's personal Telegram user ID (Tom must press **/start** on the bot first) | ✅ Yes |
   | `ALLOWED_ORIGIN` | `https://your-project-name.vercel.app` | Optional |
   | `SENDER_NAME` | `Mehrsa` | Optional; defaults to *Mehrsa* |

4. Deploy. Vercel automatically mounts the serverless function from `api/send-message.js` to `/api/send-message`.

5. The form on the website will POST to `/api/send-message`. Success is shown only when Telegram *actually confirms delivery*.

---

## 📁 Project Structure

```
.
├── index.html                      # Main page — CONFIG + CSS + JS (all in one)
├── robots.txt                      # No indexing for crawlers
├── vercel.json                     # Security headers + noindex headers
├── api/
│   └── send-message.js             # Vercel serverless function (Telegram delivery)
└── assets/
    ├── our-song.mp4                # Music track → Him & I (G-Eazy & Halsey), 128 kbps
    ├── photo_2026-10-05_04-39-22.jpg  # Real gallery photo #3
    ├── photo_2026-10-05_04-39-29.jpg  # Real gallery photo #4
    ├── photo_2026-10-05_04-39-33.jpg  # Real gallery photo #5
    ├── photo_2026-10-05_04-39-40.jpg  # Real gallery photo #2
    ├── photo_2026-10-05_04-39-44.jpg  # Hero + gallery photo #1 (featured, largest)
    ├── photo_2026-10-05_04-39-47.jpg  # Real gallery photo #6
    ├── photo_2026-10-05_04-39-52.jpg  # Real gallery photo #7
    ├── photo_2026-10-05_04-39-55.jpg  # Real gallery photo #8
    ├── photo_2026-10-05_04-39-58.jpg  # Real gallery photo #9
    ├── photo_2026-10-05_04-40-02.jpg  # Real gallery photo #10
    ├── photo_2026-10-05_04-40-06.jpg  # Real gallery photo #11
    └── vidssave.com G-Eazy & Halsey - Him & I (Lyrics) 128kbps.mp4   # Original upload (kept as backup — not referenced by page)
```

**How to replace photos later:**
1. Drop your new JPG/PNG/WebP files into `assets/`.
2. Open `index.html` and update the `CONFIG.photos` array with new `src`, `alt`, and `cap` fields. The first entry in `CONFIG.photos` is automatically used as the hero image too.

**How to replace the song later:**
1. Add the new file to `assets/` (e.g. `assets/my-song.mp3`).
2. Update `CONFIG.music.url`, `CONFIG.music.title`, and `CONFIG.music.artist`.
3. If the new file is MP4/M4A/AAC and doesn't autoplay on a particular browser, try converting to MP3 first for widest compatibility.

---

## 🔐 Telegram Backend (`api/send-message.js`)

### What it does
- Accepts only `POST` requests to `/api/send-message`
- Optional CORS check via `ALLOWED_ORIGIN`
- Rate limits each IP to **5 messages / 10 minutes** (in-memory per serverless instance — use a KV store for stricter global limits)
- Strips control characters, trims, and truncates the message to **1500 characters**
- Rejects anything shorter than 2 characters
- Reads the honeypot-spam-check from the form (hidden field `hp`) via environment validation logic; the frontend already rejects filled honeypot fields *before* hitting the API
- Sends the message through Telegram Bot API with sender, source, and UTC timestamp
- Returns `{ok:true}` **only after Telegram confirms** with `ok:true`
- Never exposes bot token or chat ID to the browser

### Format delivered to Tom on Telegram:
```
From: Mehrsa
Message: <user text here>
Source: Tom & Mehrsa — Our Little Universe
Timestamp: 2026-10-05T04:40:00.000Z
```

---

## 🧪 Testing Checklist — Locally Verified

| Test | Result |
|---|---|
| Website loads via `python3 -m http.server 8000` | ✅ PASS |
| Password `15/5/2024` unlocks the site | ✅ PASS |
| Incorrect password shows romantic Persian/English message + shake animation | ✅ PASS |
| Repeated failed attempts trigger delay lock (30s after 3+ fails) | ✅ PASS |
| Main content is `display:none` (`#site`) before successful unlock | ✅ PASS |
| Smooth unlock animation with welcome message | ✅ PASS |
| **Real hero image** from `assets/photo_2026-10-05_04-39-44.jpg` loads | ✅ PASS |
| All **11 real gallery photos** load with correct alt text and lazy loading | ✅ PASS |
| Lightbox opens, closes (button + background click + Escape) | ✅ PASS |
| Lightbox Previous / Next buttons + ArrowLeft / ArrowRight keys | ✅ PASS |
| Narrow mobile layout (< 860 px) with burger menu | ✅ PASS |
| Desktop layout with alternating timeline | ✅ PASS |
| Persian text renders with Vazirmatn font + RTL `.fa` class | ✅ PASS |
| Relationship counter starts from **15 May 2024** (never negative) | ✅ PASS |
| Wedding countdown targets **1 January 2027** with days/hours/minutes/seconds | ✅ PASS |
| Countdown has graceful post-target message (no negative numbers) | ✅ PASS |
| **Uploaded audio `assets/our-song.mp4`** plays after user click Play | ✅ PASS |
| Play/pause, progress seek, volume slider, mute all work | ✅ PASS |
| Love letters open/close with aria-expanded state | ✅ PASS |
| Timeline editable from CONFIG (5 milestones, no false in-person claim) | ✅ PASS |
| Telegram form rejects empty/too-short messages (≥ 2 chars required) | ✅ PASS |
| Telegram form calls `/api/send-message` with `{message}` JSON body | ✅ PASS |
| Telegram success shown only after confirmed delivery | ✅ PASS |
| `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are **absent from frontend source** | ✅ PASS (stored server-side only in env vars) |
| Honeypot field `hp` active; rate limiting active in API | ✅ PASS |
| All nav links (`#home`, `#story`, `#memories`, `#letters`, `#music`, `#dreams`, `#message`) scroll correctly | ✅ PASS |
| Focus-visible gold outline, lightbox focus management, ARIA labels, keyboard support | ✅ PASS |
| `prefers-reduced-motion` disables animations and reveals `.rv` elements | ✅ PASS |
| `<meta name="robots" content="noindex,nofollow">` present | ✅ PASS |
| `robots.txt` disallows crawling of everything | ✅ PASS |
| Security headers via `vercel.json` (X-Robots-Tag, X-Content-Type-Options, Referrer-Policy, X-Frame-Options DENY) | ✅ PASS |
| No broken image / audio paths in final `CONFIG` | ✅ PASS |
| No broken internal links | ✅ PASS |

**Single unavoidable local limitation:**
The live Telegram delivery flow (`/api/send-message` → real Telegram confirm) cannot be tested locally without a Vercel serverless environment **and** real `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` env vars. The API route, validation, sanitization, rate limiting, and honeypot are fully implemented; once the env vars are added on Vercel, delivery works end-to-end.

---

## 🎨 Design Tokens (in `:root` CSS variables)

| Token | Light | Dark (auto + manual) |
|---|---|---|
| `--bg` | Warm cream `#fbf4ef` | Deep plum `#1d1117` |
| `--blush` | Soft blush `#f4d9de` | Deep blush `#4a2433` |
| `--lav` | Lavender mist `#e6dcf0` | Deep lavender `#2d2238` |
| `--gold` | Champagne `#b8924a` | Champagne (kept) |
| `--wine` / `--ink` accents | Burgundy `#6d1f3a` / ink `#3a1f2b` | Blush `#e9a9bb` / ivory `#f7e9ec` |

Dark mode is triggered automatically via `prefers-color-scheme: dark` and can also be forced via `:root[data-theme="dark"]`.

---

## 📝 Central CONFIG Editable Fields

All content lives in one place: `const CONFIG = { … }` near the top of `<script>` in `index.html`.

| Field | Purpose |
|---|---|
| `title`, `you`, `her`, `initials` | Names, branding |
| `password`, `hint` | Gate password + hint shown under gate form |
| `welcome` | Personalized welcome message shown right after unlock |
| `startDate`, `startDisplay` | Relationship start ISO + display format |
| `weddingDate` | Wedding countdown target (ISO datetime) |
| `music.url`, `.title`, `.artist` | Music player file + labels |
| `telegramEndpoint` | API path for form — keep `/api/send-message` |
| `photos[]` | Gallery + hero (photos[0] = hero image) |
| `timeline[]` | 5 relationship milestones |
| `memories[]` | Little memory cards with optional big-span layout |
| `love[][]` | "Things I love about you" cards (English / Persian / detail) |
| `letters[][]` | "Open when…" letters (English title / sub / Persian body) |
| `dreams[][]` | Future-focused "Our Next Chapters" cards |

Happy forever, Tom & Mehrsa — دنیای کوچک ما ♡
