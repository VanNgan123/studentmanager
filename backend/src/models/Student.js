import { Schema, model } from 'mongoose';

const studentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    studentCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = model('Student', studentSchema);
