import app from './app'
import DatabaseService from './utils/DatabaseService';
DatabaseService.initialize();

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Serve berjalan pada port http://localhost:${PORT}`)
});