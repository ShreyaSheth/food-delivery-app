import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createItem,
  deleteItem,
  editItem,
  getItemById,
  getItemsByCity,
} from "../controllers/item.controller.js";
import { upload } from "../utils/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), createItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-by-city/:city", isAuth, getItemsByCity);

export default itemRouter;
