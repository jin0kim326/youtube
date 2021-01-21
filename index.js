const express = require("express");
const app = express();

const PORT = 4000;

function handleListening() {
  console.log(`Listening on : http://localhost:${PORT}`);
}

// const handleListening = () => {};

app.listen(PORT, handleListening);
