import express, { Request, Response } from "express";

import { BorrowModel } from "../models/borrow.models";
export const borrowsRoutes = express.Router();
import { z } from "zod";
const CreateBorrowZodSchema = z.object({
book:z.string(),
  quantity:z.number(),
  dueDate:z.string()
});
// borrow -post
borrowsRoutes.post("/", async (req: Request, res: Response) => {
  try {
const zodBodyBorrow= CreateBorrowZodSchema.parse(req.body)
    // const { book, quantity, dueDate } = req.body;

    const data = await BorrowModel.Borrow(
      zodBodyBorrow.book, 
      zodBodyBorrow.quantity,
     new Date(zodBodyBorrow.dueDate));
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
     data
    });
  } catch (error: any) {
    res.status(400).json({
       message:error.message,
      success: false,
      error:error
    });
  }
});
// borrow get
borrowsRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const data = await BorrowModel.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
         
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn"
          },
         totalQuantity: 1
        }
         
      }
      
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow summary",
      error: error.message,
    });
  }
});

