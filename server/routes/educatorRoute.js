import express from "express";
import { updateRoleToEducator } from "../controller/educator.js";

const educatorRouter = express.Router();

educatorRouter.get('/update-role', updateRoleToEducator);

export default educatorRouter;