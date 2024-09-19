import express from 'express';
import mercury from '@mercury-js/core';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.get('/', (req, res) => {
  res.send({ message: 'Hello API', mercury: JSON.stringify(mercury.typeDefs) });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
