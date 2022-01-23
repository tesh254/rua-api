import bcrypt from "bcrypt";

export async function checkPass(newPass, oldPass) {
  const result = await bcrypt.compare(newPass, oldPass);
  return result;
}

export async function hashPass(newPass) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPass, salt);
  return hash;
}