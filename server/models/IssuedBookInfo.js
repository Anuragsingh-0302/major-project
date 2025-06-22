// models/IssuedBookInfo.js
import mongoose from 'mongoose';

const issueBookSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentInfo',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  className: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  submissionDate: {
    type: Date,
    required: true
  },
  isReturned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent re-issuing same book to same student again
issueBookSchema.index({ student: 1, book: 1 }, { unique: true });

export default mongoose.model("IssuedBook", issueBookSchema);
