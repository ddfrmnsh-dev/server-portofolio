import app from "./app";
const PORT = process.env.PORT || 3001;
const HOST = "127.0.0.1";

app.listen(PORT, () => {
  console.log(`Serve berjalan pada port http:://${HOST}:${PORT}`);
});
// app.listen(PORT, () => {
//     console.log(`Serve berjalan pada port http://localhost:${PORT}`)
// });
