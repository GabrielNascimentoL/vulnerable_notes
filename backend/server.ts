import express from "express";
import cors from "cors";
import appRoutes from "./src/routes";
import "dotenv/config";

const PORT = process.env.PORT || 3000


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(appRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});