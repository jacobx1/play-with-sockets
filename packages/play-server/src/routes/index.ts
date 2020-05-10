import express from "express";
import socket from "./socket";

const routes = express.Router();

routes.use("/socket", socket);

export default routes;
