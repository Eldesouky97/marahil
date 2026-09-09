export function generateSerial(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 89999);
  return `MRH-${year}-${random}`;
}

export function generateVerifyCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
