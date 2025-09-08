import express, { Request, Response } from "express";
import airportRouter from './routes/airports.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6000;

// Mount API Router
app.use('/api/v1/airports', airportRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

