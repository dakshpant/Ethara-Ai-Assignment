import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing",
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});