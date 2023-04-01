import express, { Request, Response } from "express";
import { Db } from "mongodb";
import { genSalt, hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config";

const router = express.Router();

export function AuthRouter(db: Db) {
  router.post("/register", register);
  router.post("/login", login);

  async function register(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
      });
    }

    const hashedPassword = await hash(password, await genSalt());

    const dbRes = await db.collection("users").insertOne({
      username,
      hashedPassword,
    });

    if (!dbRes.acknowledged) {
      return res.status(400).json({
        status: "error",
        message: "failed to save user",
      });
    }

    return res.json({
      status: "success",
      message: "sign up successfully, please use login api to login",
    });
  }

  async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
      });
    }

    const dbRes = await db.collection("users").findOne({
      username,
    });

    if (!dbRes) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    console.log("%cauthController.ts line:64 dbRes", "color: #007acc;", dbRes);

    const isHashMatching = await compare(password, dbRes.hashedPassword);

    if (!isHashMatching) {
      return res.status(403).json({
        status: "error",
        message: "failed to verify user",
      });
    }

    return res.json({
      status: "success",
      token: sign(
        {
          sid: dbRes._id,
        },
        config.JWT_SECRET
      ),
    });
  }

  return router;
}
