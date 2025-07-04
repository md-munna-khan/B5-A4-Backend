import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/book.interface";

const bookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: [true, "Book title is required."],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required."],
      trim: true,
    },
    genre: {
      type: String,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, or FANTASY",
      },
      required: [true, "Genre is required."],
      trim: true,
    },
    isbn: {
      type: String,
      required: [
        true,
        "ISBN (International Standard Book Number) is required.",
      ],

      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required."],
      min: [0, "Number of copies must be a positive number."],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// query middleware
bookSchema.pre("findOne", function (next) {
  console.log("Pre findOne query filter:", this.getQuery());
  next();
});

// bookSchema.pre('save', function(next) {
//   if (!this.title) {
//     return next(new Error('Title is required!'));
//   }
  
//   next();
// });
bookSchema.post("findOne", function (doc, next) {
  if (!doc) {
    return next(new Error("Book not found"));
  }
 
  next();
});

    

export const BookModel = model<IBooks>("Book", bookSchema);
