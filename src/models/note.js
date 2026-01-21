import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: [...TAGS],
      default: 'Todo',
    },
  },
  {
    // автоматично буде додавати до об'єкту два поля: createdAt (дата створення) та updatedAt (дата оновлення).
    timestamps: true,
    // вимикає службове поле __v
    versionKey: false,
  },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю title можна робити $text
noteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', noteSchema);
//export const Student = mongoose.model("Student", studentSchema);
