/**
 * Egyptian national ID (الرقم القومي): 14 digits — century(1) + birth YYMMDD(6)
 * + governorate code(2) + daily sequence(4, last digit's parity is gender) +
 * check digit(1). Only the birth date is used here (to derive age); the
 * check digit isn't verified — getting that checksum subtly wrong would
 * reject genuinely valid IDs, which is worse than skipping it, and it isn't
 * needed for age anyway.
 */
export function parseEgyptianNationalId(id: string): { birthDate: Date; age: number } | null {
  if (!/^\d{14}$/.test(id)) return null;

  const centuryDigit = id[0];
  if (centuryDigit !== "2" && centuryDigit !== "3") return null;
  const century = centuryDigit === "2" ? 1900 : 2000;

  const year = century + Number(id.slice(1, 3));
  const month = Number(id.slice(3, 5));
  const day = Number(id.slice(5, 7));
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  if (age < 0 || age > 120) return null;

  return { birthDate, age };
}
