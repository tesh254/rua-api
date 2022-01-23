import { fetchAccount } from "../../controllers/auth/authenticate";
import { decode } from "../../helpers/jwt";

export default async function authChecker(req, res, next) {
  let user = null;
  if (req.headers.authorization) {
    const payload = decode(req.headers.authorization.split(" ")[1]);

    user = await fetchAccount(payload.id);
    if (user) {
      req.user = user;
      next();
    } else {
      req.user = null;
      next();
    }
  } else {
      req.user = null;
      next();
  }
}