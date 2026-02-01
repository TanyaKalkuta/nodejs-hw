import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

import { celebrate } from 'celebrate';
import {
  getAllNotesSchema,
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();
// 2. Додаємо middleware до всіх шляхів, що починаються з /notes
router.use('/notes', authenticate);

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

router.post('/notes', celebrate(createNoteSchema), createNote);

router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
