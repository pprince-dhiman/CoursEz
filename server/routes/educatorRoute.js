import express from "express";
import { updateRoleToEducator } from "../controller/educator.js";

const educatorRouter = express.Router();

educatorRouter.post('/update-role', updateRoleToEducator);

export default educatorRouter;