import express from "express";
import { getAllUser, makeAdmin } from "../../controllers/admin/user.controller.js";

export const adminUserRouter = express.Router();

adminUserRouter.get("/getAll", getAllUser);

adminUserRouter.get("/:id", makeAdmin);
