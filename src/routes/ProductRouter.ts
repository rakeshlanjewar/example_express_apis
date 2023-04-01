import express, { Request, Response } from "express";
import { Db } from "mongodb";
import { registerValidateJwtMiddleware } from "../utils/validateToken";

const router = express.Router();

export function ProductRouter(db: Db) {
  registerValidateJwtMiddleware(router);

  router.get("/", getProducts);
  router.post("/", saveProduct);

  async function getProducts(req: Request, res: Response) {
    const allResults = await db.collection("products").find().toArray();

    return res.json({
      status: "success",
      data: allResults,
    });
  }

  async function saveProduct(req: Request, res: Response) {
    const {
      name,
      description,
      categoryId,
      subCategoryId,
      keywords,
      sku,
      price,
      createdAt,
    } = req.body;

    const dbRes = await db.collection("products").insertOne({
      name: name,
      description: description,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      keywords: keywords,
      sku: sku,
      price: price,
      createdAt: createdAt,
    });

    return res.json({
      status: "success",
      id: dbRes.insertedId,
    });
  }

  return router;
}
