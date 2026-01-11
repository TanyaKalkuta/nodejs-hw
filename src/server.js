import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import pino from 'pino-http';

const PORT = process.env.PORT ?? 3000;

const app = express();
// Дозволяє запити з будь-яких джерел
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
// Middleware для парсингу JSON
app.use(express.json({ limit: '10mb' }));

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.post('/users', (req, res) => {
  console.log(req.body); // тепер тіло доступне як JS-об’єкт
  res.status(201).json({ message: 'User created' });
});

// Список усіх нотатків
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Конкретна нотатка за id
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  //якщо треба в форматі числа:
  //const userId = Number(req.params.userId);
  res.status(200).json({ message: `Retrieved note with ID:${noteId}` });
});

// тестовий маршрут
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd ? 'Internal Server Error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
