/**
 * The one account no admin (including itself) can demote, disable, or lock
 * out via the app — enforced in backend/firestore.rules' isProtectedAccount().
 * The rules file can't import this, so the email is duplicated there as a
 * literal; keep both in sync if it ever changes.
 */
export const PROTECTED_ADMIN_EMAIL = "eldesouky71@gmail.com";
