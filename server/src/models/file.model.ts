// models/File.ts
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Automatically update `updated_at` on update
fileSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const File = mongoose.model('File', fileSchema);

export default File;
