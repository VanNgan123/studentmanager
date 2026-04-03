import { Router } from 'express';
import { Student } from '../models/Student.js';

export const studentsRouter = Router();

studentsRouter.get('/', async (request, response, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    response.json(students);
  } catch (error) {
    next(error);
  }
});

studentsRouter.post('/', async (request, response, next) => {
  try {
    const { fullName, studentCode, className, email } = request.body;

    if (!fullName || !studentCode || !className || !email) {
      return response.status(400).json({
        message: 'fullName, studentCode, className, and email are required',
      });
    }

    const createdStudent = await Student.create({
      fullName,
      studentCode,
      className,
      email,
    });

    response.status(201).json(createdStudent);
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: 'studentCode already exists',
      });
    }

    next(error);
  }
});
