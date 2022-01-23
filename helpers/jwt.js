import jwt from "jwt-simple";

const SECRET = process.env.RUA_JWT_SECRET;

export function encode(payload) {
  return jwt.encode(payload, SECRET);
}

export function decode(token) {
  return jwt.decode(token, SECRET);
}
