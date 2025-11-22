// src/lib/user-utils/utils.ts

export function emailToUsername(email: string | undefined) {
  const username = email?.substring(
    0,
    Number(email.indexOf("@"))
  );
  return username;
}