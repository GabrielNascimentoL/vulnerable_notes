import express from "express";
import appRoutes from "./src/routes";
import "dotenv/config";

const PORT = process.env.PORT || 3000


const app = express();

app.use(express.json());
app.use(appRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});