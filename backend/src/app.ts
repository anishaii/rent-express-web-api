import express, { Application, Request, Response } from "express";

const app: Application = express();
app.use(express.json());

export default app;
