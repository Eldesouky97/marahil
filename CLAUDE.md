# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"مراحل" (Marahil) — an Arabic-language (RTL), interactive tutoring/course platform covering every school stage (kindergarten through university and professional training), with quizzes, progress tracking, and auto-issued digital certificates with QR-code verification.

The repo is a monorepo with two independently deployed halves:

- **`frontend/`** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Deployed to Vercel with **Root Directory = `frontend`**.
- **`backend/`** — Firebase project config: Firestore/Storage security rules only. Deployed via `firebase deploy` run from inside `backend/` (project id `marahil-2026`, set in `backend/.firebaserc`).
- **`design-reference/`** — a static JSX mockup from an earlier, unrelated concept ("أُفُق"/Ofoq). Kept only as a visual reference; not imported or built by anything.

There is no separate Node/Express backend, and **no Cloud Functions** — the project intentionally stays on Firebase's free Spark plan (no billing account attached), so Auth + Firestore + Firestore security rules *are* the entire backend.

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

- `users/{uid}` — `{ name, email, role: "teacher"|"student", createdAt }`
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

### Frontend structure (`frontend/src/`)

Small, single-purpose files by convention — prefer adding a new file over growing an existing one.

- `app/` — routes only; each `page.tsx` is a thin wrapper that awaits `params` (Next 16: `params` is a `Promise`) and renders one component from `components/`. No business logic in `app/`.
- `components/` — grouped by feature: `landing/`, `auth/`, `courses/`, `lesson/`, `quiz/`, `certificates/`, `dashboard/teacher/`, `dashboard/student/`, `layout/`, `ui/` (generic primitives: `Button`, `Card`, `Badge`, `ProgressBar`, `Spinner`, `Container`, `FormField`).
- `lib/firebase/` — one file per collection/concern (`auth.ts`, `users.ts`, `courses.ts`, `enrollments.ts`, `certificates.ts`, `client.ts` for SDK init). This is the only layer allowed to import from `firebase/*`.
- `lib/hooks/` — one `useX` hook per screen/concern, each wrapping a `lib/firebase/*` call in loading/state management (e.g. `useCourseDetail`, `useEnrollment`, `useLessonPlayer`, `useTeacherCourses`). Components call hooks; hooks call `lib/firebase/*`; components never import `lib/firebase/*` directly.
- `context/AuthProvider.tsx` — the only global state (Firebase auth user + Firestore profile + role). Read via `useAuth()`.
- `types/` — one file per domain type (`course.ts`, `user.ts`, `quiz.ts`, `certificate.ts`, `stage.ts`).
- `data/stages.ts` — static list of school stages/subjects, used both by the landing page and the course-creation/filter UI. Edit here to add a stage or subject, not in components.

Role-gating: `components/auth/RoleGuard.tsx` wraps every `/dashboard/*` page and redirects based on `useAuth().profile.role`. There's no middleware-based route protection — it's all client-side via this guard plus the Firestore rules being the real enforcement layer.

Visual design: colors/fonts are plain Tailwind arbitrary-value classes (`bg-[#0B1224]`, `text-[#D4A94F]`, etc.) plus CSS variables in `app/globals.css`; there's no `tailwind.config` theme extension (Tailwind v4 CSS-first config). Fonts (Amiri for display/Arabic headings, Tajawal for body) are loaded via `next/font/google` in `app/layout.tsx` — don't reintroduce a manual `@import` for them in CSS (breaks `@import`-must-be-first CSS ordering with Tailwind's own `@import "tailwindcss"`).

### Backend structure (`backend/`)

Just `firestore.rules`, `storage.rules`, and `firestore.indexes.json` — no server code. `firestore.rules` is the actual authorization logic for the whole app; read it before assuming what a client can or can't write.
