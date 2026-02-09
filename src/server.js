import express from 'express';
import helmet from 'helmet';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
// Middleware для парсингу JSON
app.use(express.json({ limit: '10mb' }));
// app.use(cors());         // 3. Дозвіл для запитів з інших доменів
// Дозволяє запити з будь-яких джерел
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
//
app.use(helmet()); //захищає від типових веб-атак/Express-сервер використовує стандартні HTTP-заголовки безпеки
app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);
// Додаємо раути користувача
app.use(userRoutes);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);
// обробка помилок від celebrate (валідація)
app.use(errors());
// Middleware для обробки помилок
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
