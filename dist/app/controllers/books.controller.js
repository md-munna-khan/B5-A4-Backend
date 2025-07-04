"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookZodSchema = exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = require("../models/book.models");
exports.booksRoutes = express_1.default.Router();
const zod_1 = require("zod");
exports.CreateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Book title is required"),
    author: zod_1.z.string().min(1, "Author name is required"),
    genre: zod_1.z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: zod_1.z.string().min(1, "ISBN is required"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0, "Copies must be a positive number"),
    available: zod_1.z.boolean().optional(),
});
// book -post
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zodBody = exports.CreateBookZodSchema.parse(req.body);
        const data = yield book_models_1.BookModel.create(zodBody);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error.name === "ValidationError"
                ? { name: error.name, errors: error.errors }
                : error,
        });
    }
}));
// book -get all
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // =============== Query parameters ============
        const filterGenre = req.query.filter || "";
        const sortBy = req.query.sortBy || "createAt";
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        const limit = parseInt(req.query.limit);
        const filter = {};
        if (filterGenre) {
            filter.genre = filterGenre;
        }
        const data = yield book_models_1.BookModel.find(filter)
            .sort({ [sortBy]: sortOrder })
            .limit(limit);
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error.name === "ValidationError"
                ? { name: error.name, errors: error.errors }
                : error,
        });
    }
}));
// book - single id
exports.booksRoutes.get("/:booksId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.booksId;
        const data = yield book_models_1.BookModel.findOne({ _id: bookId });
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            success: false,
            error: error,
        });
    }
}));
// book - update single  id
exports.booksRoutes.put("/:booksId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booksId = req.params.booksId;
        const updateBooks = req.body;
        const data = yield book_models_1.BookModel.findByIdAndUpdate(booksId, updateBooks, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error.name === "ValidationError"
                ? { name: error.name, errors: error.errors }
                : error,
        });
    }
}));
// book - delete id
exports.booksRoutes.delete("/:booksId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booksId = req.params.booksId;
        const data = yield book_models_1.BookModel.findOneAndDelete({ _id: booksId });
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            success: false,
            error: error,
        });
    }
}));
