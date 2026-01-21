import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Список усіх нотатків
export const getAllNotes = async (req, res) => {
  // Отримуємо пара метри пагінації
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  // Створюємо базовий запит до колекції
  // const studentsQuery = Student.find();
  const notesQuery = Note.find();
  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }
  // Будуємо фільтр
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Виконуємо одразу два запити паралельно
  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);
  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};
// // Конкретна нотатка за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  //якщо треба в форматі числа:
  //const userId = Number(req.params.userId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true, // повертаємо оновлений документ
  });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
