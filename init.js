import app from "./app";
import "./db";
import dotenv from "dotenv";

const PORT = process.env.PROT || 4000;

const handleListening = () =>
  console.log(` ✅ Listening on : http://localhost:${PORT}`);

app.listen(PORT, handleListening);
