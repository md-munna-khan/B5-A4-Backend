import express, { Request, Response } from "express";
import { BookModel } from "../models/book.models";
export const booksRoutes = express.Router();
import { z } from "zod";
export const CreateBookZodSchema = z.object({
  title: z.string().min(1, "Book title is required"),
  author: z.string().min(1, "Author name is required"),
  genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.number().min(0, "Copies must be a positive number"),
  available: z.boolean().optional(),
});

// book -post
booksRoutes.post("/", async (req: Request, res: Response) => {
  
  try {
    const zodBody = CreateBookZodSchema.parse(req.body)
    const data = await BookModel.create(zodBody);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error: any) {
   
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error:
        error.name === "ValidationError"
          ? { name: error.name, errors: error.errors }
          : error,
    });
  }
});
// book -get all
booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    // =============== Query parameters ============
    const filterGenre = (req.query.filter as string) || "";
    const sortBy = (req.query.sortBy as string) || "createAt";
    const sortOrder = req.query.sort === "desc" ? -1 : 1;
    const limit = parseInt(req.query.limit as string)  ;

    const filter: any = {};
    if (filterGenre) {
      filter.genre = filterGenre;
    }
    const data = await BookModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(limit);

    res.status(201).json({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error:
        error.name === "ValidationError"
          ? { name: error.name, errors: error.errors }
          : error,
    });
  }
});
// book - single id
booksRoutes.get("/:booksId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.booksId;
    const data = await BookModel.findOne({ _id: bookId });

    res.status(201).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: error,
    });
  }
});
// book - update single  id
booksRoutes.put("/:booksId", async (req: Request, res: Response) => {
  try {
    const booksId = req.params.booksId;
    const updateBooks = req.body;
    const data = await BookModel.findByIdAndUpdate(booksId, updateBooks, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error:
        error.name === "ValidationError"
          ? { name: error.name, errors: error.errors }
          : error,
    });
  }
});
// book - delete id
booksRoutes.delete("/:booksId", async (req: Request, res: Response) => {
  try {
    const booksId = req.params.booksId;

    const data = await BookModel.findOneAndDelete({ _id: booksId });

    res.status(201).json({
      success: true,
      message: "Book deleted successfully",
      data:null,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: error,
    });
  }
});

