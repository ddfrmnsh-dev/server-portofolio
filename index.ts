import app from "./app";
const PORT = process.env.PORT || 3001;
const HOST = "localhost";

app.listen(PORT, () => {
  console.log(`Serve berjalan pada port http:://${HOST}:${PORT}`);
});
