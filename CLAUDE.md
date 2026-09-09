# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"مراحل" (Marahil) — an Arabic-language (RTL), interactive tutoring/course platform covering every school stage (kindergarten through university and professional training), with quizzes, progress tracking, and auto-issued digital certificates with QR-code verification.

The repo is a monorepo with two independently deployed halves:

- **`frontend/`** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Deployed to Vercel with **Root Directory = `frontend`**.
- **`backend/`** — Firebase project config: Firestore/Storage security rules + one Cloud Function. Deployed via `firebase deploy` run from inside `backend/` (project id `marahil-2026`, set in `backend/.firebaserc`).
- **`design-reference/`** — a static JSX mockup from an earlier, unrelated concept ("أُفُق"/Ofoq). Kept only as a visual reference; not imported or built by anything.

There is no separate Node/Express backend — Firebase (Auth, Firestore, Storage, Cloud Functions) *is* the backend.

## Commands

Run from `frontend/`:
- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build (also runs the TypeScript check)
- `npm run lint` — ESLint

Run from `backend/functions/`:
- `npm run build` — compile Cloud Functions TypeScript to `lib/`

Run from `backend/` (requires `firebase login` once):
- `firebase deploy` — deploys Firestore rules, Storage rules, and Cloud Functions together
- `firebase deploy --only firestore:rules,firestore:indexes,storage` / `--only functions` — deploy a subset

## Architecture

### Data model (Firestore)

- `users/{uid}` — `{ name, email, role: "teacher"|"student", createdAt }`
- `courses/{courseId}` — `{ title, description, stage, subject, teacherId, teacherName, published, lessonsCount, studentsCount, createdAt }`
  - `courses/{courseId}/lessons/{lessonId}` — `{ title, order, videoUrl?, content?, quiz?: QuizQuestion[] }`. A lesson either has a quiz (graded, drives progress) or is marked complete manually.
- `enrollments/{uid}_{courseId}` — one doc per student per course; id is deterministic (`uid_courseId`), not auto-generated. Tracks `completedLessonIds`, `quizScores`, `progress` (0–100), `certificateIssued`.
- `certificates/{certificateId}` — `{ uid, studentName, courseId, courseTitle, teacherName, serial, verifyCode, issuedAt }`. Publicly readable (verification page needs it), but **never client-writable**.

### Certificates are server-authoritative — this is the one thing not to casually "simplify"

A client could otherwise call a Firestore write directly and forge a certificate for itself. So:

1. The frontend only ever updates `enrollments/*` (via `frontend/src/lib/firebase/enrollments.ts`), and Firestore rules (`backend/firestore.rules`) forbid a client from ever setting `certificateIssued: true` or writing to `certificates/*` at all.
2. `backend/functions/src/certificates/issueOnCompletion.ts` is an `onDocumentWritten` trigger on `enrollments/{enrollmentId}`. When it sees `progress >= 100 && !certificateIssued`, it creates the `certificates` doc (via the Admin SDK, which bypasses rules) and flips `certificateIssued` itself.
3. The frontend (`frontend/src/lib/hooks/useLessonPlayer.ts`) never issues a certificate — after progress hits 100%, it calls `watchCertificateForCourse` (`frontend/src/lib/firebase/certificates.ts`), an `onSnapshot` listener that resolves once the Cloud Function's write lands.

If you change how progress/completion is computed, keep this split intact: client writes progress, server decides when that's "done" and mints the certificate.

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

- `firestore.rules` — the actual authorization logic; read this before assuming what a client can/can't write.
- `functions/src/lib/` — tiny shared helpers (`admin.ts` for Admin SDK init, `certificateSerial.ts` for serial/verify-code generation). These live only here now — the frontend used to have its own copy back when certificate issuance ran client-side, but that code was deleted when issuance moved server-side (see above). Don't re-add serial/verify-code generation to the frontend.
