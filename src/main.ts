import { createApp } from './app.js';
const app = await createApp();
const port = Number(process.env.PORT ?? 4431);
await app.listen(port, '127.0.0.1');
console.log(`Film API: http://127.0.0.1:${port}/docs`);
