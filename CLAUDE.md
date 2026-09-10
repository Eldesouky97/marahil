# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"مراحل" (Marahil) — an Arabic-language (RTL), interactive tutoring/course platform covering every school stage (kindergarten through university and professional training), with quizzes, progress tracking, and auto-issued digital certificates with QR-code verification.

The repo is a monorepo with two independently deployed halves:

- **`frontend/`** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Deployed to Vercel with **Root Directory = `frontend`**.
- **`backend/`** — Firebase project config: Firestore/Storage security rules only. Deployed via `firebase deploy` run from inside `backend/` (project id `marahil-2026`, set in `backend/.firebaserc`).
- **`design-reference/`** — a static JSX mockup from an earlier, unrelated concept ("أُفُق"/Ofoq). Kept only as a visual reference; not imported or built by anything.

There is no separate Node/Express backend, and **no Cloud Functions** — the project intentionally stays on Firebase's free Spark plan (no billing account attached), so Auth + Firestore + Firestore security rules *are* the entire backend. The one exception is `frontend/src/app/api/upload/route.ts`, a single Vercel serverless API route (see "Image uploads" below) — that's Vercel infrastructure that ships with every Next.js app regardless, not a Firebase Cloud Function, so it doesn't touch the Spark-plan constraint.

## Commands

Run from `frontend/`:
- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build (also runs the TypeScript check)
- `npm run lint` — ESLint

Run from `backend/` (requires `firebase login` once):
- `firebase deploy` — deploys Firestore rules, indexes, and Storage rules together
- `firebase deploy --only firestore:rules` — deploy just the rules (the usual case)

## Architecture

### Data model (Firestore)

- `users/{uid}` — `{ name, email, role: "teacher"|"student"|"admin", photoURL?, createdAt }`. `role` can only be `"admin"` if another admin (or a human editing Firestore directly in the Firebase Console) set it that way — no client-side `create` path ever allows `role: "admin"`, so the first admin always has to be bootstrapped by hand-editing their `users/{uid}` doc in the Console after they register normally.
- `courses/{courseId}` — `{ title, description, stage, subject, teacherId, teacherName, published, lessonsCount, studentsCount, createdAt }`
  - `courses/{courseId}/lessons/{lessonId}` — `{ title, order, videoUrl?, content?, quiz?: QuizQuestion[] }`. A lesson either has a quiz (graded, drives progress) or is marked complete manually.
- `enrollments/{uid}_{courseId}` — one doc per student per course; id is deterministic (`uid_courseId`), not auto-generated. Tracks `completedLessonIds`, `quizScores`, `progress` (0–100), `certificateIssued`.
- `certificates/{uid}_{courseId}` — `{ uid, studentName, courseId, courseTitle, teacherName, serial, verifyCode, issuedAt }`. Same deterministic-id scheme as `enrollments`. Publicly readable (verification page needs it).

### Certificates are issued client-side, but gated entirely by Firestore rules — read `backend/firestore.rules` before touching this

There's no Cloud Function (see above — free plan, no billing account), so `frontend/src/lib/firebase/certificates.ts`'s `issueCertificate()` writes the `certificates` doc directly from the browser once `frontend/src/lib/hooks/useLessonPlayer.ts` sees `enrollment.progress` hit 100. The only thing standing between that and a student forging their own certificate is `backend/firestore.rules`:

- the `enrollments` update rule caps `completedLessonIds.size()` at the course's real `lessonsCount` and only allows `progress == 100` once that count is actually reached, and only allows `certificateIssued` to flip false→true (never back);
- the `certificates` create rule re-derives `studentName`/`courseTitle`/`teacherName` from the real `users`/`courses` docs via `get()` (a client can't write fake display text onto its own certificate), and requires the matching `enrollments/{uid}_{courseId}` doc to already show `progress == 100`.

This is a deliberate trade-off, not an oversight: it's not as airtight as a server-side issuer (a sufficiently motivated user could still pad `completedLessonIds` with fabricated ids up to the real count, since rules can't iterate the `lessons` subcollection to check each id is real), but it needs no billing account. If that gap ever matters, the fix is a Blaze-plan Cloud Function trigger on `enrollments` writes that issues the certificate via the Admin SDK instead — don't try to close it further with more rules; Firestore rules can't enumerate a subcollection's real ids.

If you change how progress/completion is computed, keep the invariant that `enrollments.progress` can only reach 100 in lockstep with the rules' `completedLessonIds.size()` check.

### Admin role is a Firestore-based bypass, not a Firebase Auth custom claim

There's no Admin SDK (see above), so there's no way to set a real Firebase custom claim from this codebase either — `isAdmin()` in `backend/firestore.rules` just checks `role == 'admin'` on the requester's own `users/{uid}` doc via `get()`, the same pattern `courseData()`/`userData()` already used. It's additive-only (`|| isAdmin()`) on top of every existing rule; no owner-only check was removed. `users` read/update, `courses` read, and `enrollments` read all have an admin bypass; `courses` write and `lessons` (read or write) deliberately don't — the admin courses dashboard is read-only, course editing stays the owning teacher's job. The admin dashboard (`/dashboard/admin/users`) can promote/demote any user's `role`, but can't delete a Firebase Auth account or the user's own admin status from someone else without going through the same role-update path — and nothing here can hard-delete a Firebase Auth account at all (needs the Admin SDK); removing a user fully still requires the Firebase Console.

### Auth flows: email/password, Google, forgot-password, complete-profile

`lib/firebase/auth.ts` has both `registerUser`/`loginUser` (email/password) and `signInWithGoogle()` (`GoogleAuthProvider` + `signInWithPopup`) — enabling the Google provider itself is a one-time manual step in Firebase Console → Authentication → Sign-in method, no code does it. Google sign-in has no role, so a first-time Google user has no `users/{uid}` doc yet; `RoleGuard.tsx` distinguishes this from "not signed in" by checking `firebaseUser` (from `useAuth()`) separately from `profile` — no `firebaseUser` → `/auth/login`, `firebaseUser` but no `profile` → `/auth/complete-profile`, `profile.role` mismatch → the user's own dashboard. `GoogleSignInButton.tsx` (shared by `LoginForm`/`RegisterForm`, since the post-sign-in branch is identical either way) does the same `getUserProfile` check right after sign-in to route directly. `resetPassword()` wraps `sendPasswordResetEmail`; the actual reset UI is Firebase's own default hosted action page, not a custom in-app route — deliberate, to avoid building `oobCode`/`confirmPasswordReset` handling for a Spark-plan project that otherwise has no server code.

### Image uploads (course cover, lesson image, avatar) go through Cloudflare R2, not Firebase Storage

`courses.coverImageUrl`, `lessons.imageUrl`, and `users.photoURL` (the last already existed for Google sign-in) can all point at an image in a Cloudflare R2 bucket instead of/alongside the defaults (`coverIcon` stays as the always-present fallback when no cover image was uploaded). `frontend/src/lib/firebase/client.ts` still initializes Firebase Storage, but it's unused — R2 is cheaper and this avoids a second security-rules surface to maintain.

The R2 secret access key can never reach the browser, so uploads go through the app's only server-side code, `app/api/upload/route.ts`: the client asks it for a short-lived presigned PUT URL (`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` against R2's S3-compatible endpoint), then uploads the file bytes straight to R2 from the browser — the file never passes through the Vercel function, avoiding its request-body size limit. Auth on that route is checked **without the Admin SDK**: it calls Firebase's own public Identity Toolkit REST endpoint (`identitytoolkit.googleapis.com/v1/accounts:lookup`) to verify the caller's ID token, the same "no service account" posture as everywhere else in this project. `frontend/src/lib/upload/uploadImage.ts` is the one client-side entry point every upload UI calls (`components/ui/ImageUploadField.tsx`); don't call `/api/upload` directly from a new call site.

Env vars `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` / `R2_PUBLIC_URL` are server-only (no `NEXT_PUBLIC_` prefix — see `.env.example`) and live in Vercel's project env vars plus local `.env.local`, never committed. `next.config.ts`'s `images.remotePatterns` has to list both the R2 public host and `lh3.googleusercontent.com` (Google avatar photos) for `next/image` to render them.

### Admin dashboard has its own sidebar shell — the only dashboard that does

`app/[locale]/dashboard/admin/layout.tsx` wraps every admin page in `RoleGuard role="admin"` once, then `AdminShell` (sidebar + topbar). Because of that, none of the individual `dashboard/admin/**/page.tsx` files or `*View` components carry their own `RoleGuard` or `<section><Container>` frame — that's the layout's job now. Teacher/student dashboards are unaffected and still self-contained per-page. `AdminSidebar.tsx` is fixed-positioned with Tailwind's logical-property utilities (`start-0`, `ms-64`, `border-e-*`, `ltr:-translate-x-full rtl:translate-x-full` for the mobile off-canvas state) rather than literal `left`/`right`/`margin-right` — this is the same convention `Hero.tsx`/`FinalCta.tsx`/`LessonPlayer.tsx` already use, and matters here specifically because the sidebar has to swap sides between the `ar` and `en` locales. The two overview charts (`AdminChart.tsx`, a thin Chart.js wrapper) are built with the `dataviz` skill's method — load that skill again before touching chart colors or adding a new chart, don't hand-pick colors.

### Frontend structure (`frontend/src/`)

Small, single-purpose files by convention — prefer adding a new file over growing an existing one.

- `app/[locale]/` — every route is nested under a `[locale]` segment (`ar`/`en`, see i18n below); there is no un-localized `app/` route. Each `page.tsx` is a thin wrapper that awaits `params` (Next 16: `params` is a `Promise`, and now also carries `locale`) and renders one component from `components/`. No business logic in `app/`. Lesson playback lives at `learn/[courseId]/[lessonId]`, not `lesson/` (that name is reserved for the `components/lesson/` group below). `profile/` (no `[locale]` inside it — it's a locale-scoped route like the rest, just role-agnostic, unlike everything under `dashboard/`) is the one signed-in page not gated by `RoleGuard`.
- `app/api/` — server-only route handlers, outside `[locale]` (API routes aren't localized pages). Currently just `upload/route.ts` — see "Image uploads" above before adding another one.
- `components/` — grouped by feature: `landing/`, `auth/` (also `GoogleSignInButton`, `ForgotPasswordForm`, `CompleteProfileForm`, `PendingApprovalNotice`, `PersonalDetailsForm`), `courses/`, `lesson/`, `quiz/`, `certificates/`, `profile/` (`ProfileView`), `dashboard/teacher/`, `dashboard/student/`, `dashboard/admin/` (also `AdminShell`/`AdminSidebar`/`AdminTopbar`/`AdminChart`), `layout/`, `theme/` (`ThemeToggle`, `ThemeScript`, `LanguageSwitcher`), `analytics/` (`AnalyticsInit`), `ui/` (generic primitives: `Button`, `Card`, `Badge`, `ProgressBar`, `Spinner`, `Container`, `FormField`, `ImageUploadField`).
- `lib/firebase/` — one file per collection/concern (`auth.ts`, `users.ts`, `courses.ts`, `enrollments.ts`, `certificates.ts`, `stages.ts`, `auditLog.ts`, `analytics.ts`, `client.ts` for SDK init). This is the only layer allowed to import from `firebase/*`.
- `lib/upload/` — `uploadImage.ts`, the R2 upload client (see "Image uploads" above). Not a Firebase concern, so it's deliberately outside `lib/firebase/`.
- `lib/hooks/` — one `useX` hook per screen/concern, each wrapping a `lib/firebase/*` call in loading/state management (e.g. `useCourseDetail`, `useEnrollment`, `useLessonPlayer`, `useTeacherCourses`). Components call hooks; hooks call `lib/firebase/*`; components never import `lib/firebase/*` directly.
- `context/` — global state: `AuthProvider.tsx` (Firebase auth user + Firestore profile + role, read via `useAuth()`) and `ThemeProvider.tsx` (light/dark, read via `useTheme()`).
- `types/` — one file per domain type (`course.ts`, `user.ts`, `quiz.ts`, `certificate.ts`, `stage.ts`).
- `data/stages.ts` — static list of school stages/subjects, used both by the landing page and the course-creation/filter UI. Edit here to add a stage or subject, not in components.

Role-gating: `components/auth/RoleGuard.tsx` wraps every `/dashboard/*` page (including `/dashboard/admin/*`) and redirects based on `useAuth().profile.role` — see the admin-role section above for its three-way (signed-out / no-profile-yet / wrong-role) redirect logic. There's no middleware-based *auth* protection — it's all client-side via this guard plus the Firestore rules being the real enforcement layer. (`proxy.ts` does exist, but it's `next-intl`'s locale-routing middleware, unrelated to auth — see below.)

i18n: routing/UI text is bilingual (Arabic default, English) via `next-intl`. `i18n/routing.ts` defines `locales: ["ar", "en"]`, `defaultLocale: "ar"`, `localePrefix: "always"`; `i18n/navigation.ts` exports locale-aware `Link`/`useRouter`/etc. to use instead of Next's own; `i18n/request.ts` resolves the active locale server-side. `proxy.ts` at the `src/` root (Next 16's rename of `middleware.ts` — same convention, new filename) runs `next-intl`'s middleware to redirect bare paths to a locale prefix. Copy is in `messages/ar.json` and `messages/en.json` — add new strings to both, don't hardcode UI text in components. `app/[locale]/layout.tsx` sets `dir="rtl"|"ltr"` from the locale and loads fonts.

Visual design: the whole app is driven by semantic CSS custom properties defined once in `app/globals.css` (`--bg`, `--surface`, `--heading`, `--body`, `--primary`, `--accent`, `--gold`, `--danger`, `--success`, etc.), re-exposed as Tailwind utilities via a Tailwind v4 `@theme inline` block (so `bg-primary`, `text-heading`, `border-gold/40` etc. just work) — there's no `tailwind.config` theme extension. Components essentially never hardcode a hex color; the only exceptions are `Constellation.tsx`'s canvas-rendering fallback constants, `useQrCode.ts`'s QR-library color option (the `qrcode` package needs literal hex, not `var()`), `GoogleSignInButton.tsx`'s inline Google "G" mark (Google's brand colors are fixed, not themeable), `lib/utils/chartColors.ts` reading the `--chart-1/2/3` tokens via `getComputedStyle` for the same reason (Chart.js draws to canvas, which can't resolve `var()`), and any inline `style={{ backgroundImage: "linear-gradient(..., var(--primary), ...)" }}` gradients that Tailwind utilities can't express — all still source the actual app colors from the same tokens wherever the app's own palette is involved. When adding a new color, add the token to `globals.css` (both the light `:root` block and the `[data-theme="dark"]` block) and its `--color-*` mapping in `@theme inline`, not a one-off arbitrary-value class. The brand palette is deep navy blue (`--primary`, trust/knowledge), teal (`--accent`, growth), and gold (`--gold`, achievement — the star in the logo); see `public/brand/`. `--chart-1/2/3` are a separate categorical triplet just for Chart.js marks — `--primary` itself is too dark to pass a chart mark's lightness band, so don't reuse it there; re-validate with the `dataviz` skill's `validate_palette.js` before changing any of the three.

Fonts: Cairo (Arabic + Latin) is the default for both `--font-display` and `--font-body`; an `html[lang="en"]` override in `globals.css` swaps to Poppins (with Cairo as fallback) for the English locale, per the brand typography spec. Both are loaded via `next/font/google` in `app/[locale]/layout.tsx` — don't reintroduce a manual `@import` for them in CSS (breaks `@import`-must-be-first CSS ordering with Tailwind's own `@import "tailwindcss"`).

Light/dark theme is a `data-theme` attribute on `<html>`, toggled by `ThemeProvider`/`ThemeToggle` and persisted to `localStorage`. Light is the fixed default regardless of system preference — `globals.css` deliberately has no `prefers-color-scheme: dark` block, only the explicit toggle switches to dark. `components/theme/ThemeScript.tsx` is inlined in `<head>` to apply a saved `dark` choice before first paint and avoid a flash — keep it a plain inline script, not a component that renders after hydration.

Logo: `components/layout/Logo.tsx` renders `public/brand/marahil-logo.png` (the full star + book + "مراحل"/"Marahil" lockup) via `next/image`; it's a fixed-color raster now, not a theme-aware inline SVG, so it doesn't recolor across light/dark. `public/brand/marahil-mark.png` is the icon-only crop (no wordmark) used for `app/icon.png`/`app/apple-icon.png` — the full lockup's text isn't legible at favicon size.

### Backend structure (`backend/`)

Just `firestore.rules`, `storage.rules`, and `firestore.indexes.json` — no server code. `firestore.rules` is the actual authorization logic for the whole app; read it before assuming what a client can or can't write.
