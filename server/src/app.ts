import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

export { app, httpServer, uploadDir };
