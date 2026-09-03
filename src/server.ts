import app from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.info(`Nexshop API is running at http://localhost:${env.PORT}`);
});
