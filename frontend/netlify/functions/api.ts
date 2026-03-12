import serverless from "serverless-http";
import app from "./lib/index";

export const handler = serverless(app);
