# Reverso Solutions — Phase 1 (Next.js + Firebase)

A content-driven marketing site where staff edit text in a spreadsheet-style admin and the
live site updates automatically. Includes Contact / Free Demo forms, signup/login, and
Firestore security rules. Payment and video are Phase 2.

## What's inside

```
src/
  lib/           firebase init, data types, content fetchers
  app/
    layout.tsx   header/footer from siteSettings, ISR (revalidate 60s)
    page.tsx     home: banners, services, courses, testimonials
    [slug]/      dynamic content pages (about, privacy-policy, service pages)
    courses/     course list + course detail
    contact/     contact + free-demo forms
    login, signup
    api/
      submit-form   optional email notification
      revalidate    instant content refresh (called by a Firestore trigger)
    components/   Header, Footer, ContactForm, AuthForm
scripts/seed.mjs  one-time content seeding
firestore.rules   security rules (public read, admin-only write)
```

## Setup (about 20 minutes)

### 1. Create the Firebase project
1. Go to console.firebase.google.com → **Add project**.
2. Build → **Firestore Database** → Create (production mode, region `asia-south1`).
3. Build → **Authentication** → Get started → enable **Email/Password**.
4. Project settings → **Your apps** → add a **Web app** → copy the config values.

### 2. Configure environment
```bash
cp .env.example .env.local
```
Fill in the six `NEXT_PUBLIC_FIREBASE_*` values from step 1.

### 3. Install and run
```bash
npm install
npm run dev        # http://localhost:3000
```
The site runs immediately, but pages are empty until you seed content.

### 4. Seed starter content
1. Project settings → **Service accounts** → **Generate new private key**.
2. Save the downloaded file as `serviceAccount.json` in the project root (git-ignored).
3. Run:
   ```bash
   npm run seed
   ```
Refresh the site — home, courses, about, and contact now have content.

### 5. Deploy the security rules
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Make yourself an admin (to edit content)
Content writes are locked to admins. In the Firebase console → Firestore, create a
collection **`admins`** with a document whose **ID is your user's UID** (find it under
Authentication → Users after you sign up on the site). Any content field is fine, e.g. `{ role: "owner" }`.

## Editing content (the "CMS")

Two options:

- **Rowy (recommended, no code):** go to rowy.io, connect this Firebase project, and you
  get a spreadsheet view of every collection (`siteSettings`, `courses`, `services`,
  `banners`, `testimonials`, `pages`, `news`, `faqs`). Staff edit cells and save.
- **Firebase console:** edit documents directly under Firestore Database.

Edits appear on the live site within 60 seconds. For **instant** updates, add a Cloud
Function that calls `POST /api/revalidate?secret=...` whenever a content document changes.

## Deploy the site

**Firebase Hosting (web frameworks):**
```bash
firebase experiments:enable webframeworks
firebase init hosting        # choose this project, "." as source
firebase deploy --only hosting
```
> Cloud Functions / Storage require the **Blaze** plan (card on file). You stay within the
> free quota for a site this size — set a Google Cloud **budget alert** to be safe.

**Alternative — Cloudflare Pages:** works too and avoids the card; connect the repo and set
the same env vars in the dashboard.

## Forms & email

Submissions are saved to the `formSubmissions` collection and are visible in Rowy/console.
To also get email alerts, put a **Resend** or **Brevo** free-tier API key in `EMAIL_API_KEY`
(and `EMAIL_TO`) — see `src/app/api/submit-form/route.ts`.

## Before go-live checklist

- [ ] Seed real content / migrate text from the current site
- [ ] Add 301 redirects from old `.php` URLs to the new paths
- [ ] Generate `sitemap.xml`, submit in Google Search Console
- [ ] Set a Google Cloud budget alert
- [ ] Enable Firebase **App Check** to protect against abuse

## What's deliberately NOT here (Phase 2)

Payment checkout, course purchase → enrollment, and gated video playback (Bunny Stream
signed URLs). The course detail page already has the "Enquire / Enroll" slot where the
buy button will go.
