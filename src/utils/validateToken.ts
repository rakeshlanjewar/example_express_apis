import { Router } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config";

export function registerValidateJwtMiddleware(router: Router) {
  router.use((req, res, next) => {
    if (req.header("auth-token")) {
      const payload = verify(
        req.header("auth-token") as string,
        config.JWT_SECRET
      );

      if (payload) {
        next();
        return;
      }
    }

    return res.status(401).json({ status: "Forbidden" });
  });
}
