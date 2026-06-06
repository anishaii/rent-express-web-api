import app from "./src/app";
import { PORT } from "./src/configs/constant";

app.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
