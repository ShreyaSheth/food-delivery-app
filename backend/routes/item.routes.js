import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createItem, editItem } from "../controllers/item.controller.js";
import { upload } from "../utils/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), createItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);

export default itemRouter;
