# Book Management Library API

This is a RESTful API built using Node.js, Express.js, TypeScript, and MongoDB (via Mongoose) to manage a library of books and borrow records. It supports book CRUD operations, borrowing system, filtering by genre, sorting, limiting results, and borrow summary using aggregation.

---

## Features

- Full Create, Read, Update, Delete (CRUD) for books
- Borrow books with quantity and due date tracking
- Filter books by genre
- Sort books by any field (title, createdAt, etc.)
- Limit results via query
- Borrowed books summary with aggregation
- Validations and error handling
- Duplicate ISBN error handling
- Timestamp for createdAt and updatedAt

---

## Technologies Used

Node.js, Express.js, TypeScript, MongoDB, Mongoose, Dotenv, Nodemon

---

## Getting Started

## 📦 Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/md-munna-khan/Library-Management-assignment-3.git
cd Library-Management-assignment-3
```
2. Install Dependencies
```bash
npm install
```
3. Create .env File
```bash
PORT=5000
DATABASE_URL=mongodb://localhost:27017/libraryDB
```
4. Run the Server
```bash
npm run dev     # For development
npm run build   # Compile TypeScript
npm start       # Run in production
```


Server will run on: `http://localhost:5000`

---

 ##### Middleware & Methods
post('findOne') — throws error if book not found

pre('deleteOne') — logs before deleting

BookSchema.static('borrowBook') — custom logic to deduct quantity and update availability
## API Endpoints


✅ Create Book

##### POST /api/books



### POST /api/books

Create a new book.

Request Body:
```bash
{ "title": "The Theory of Everything", "author": "Stephen Hawking", "genre": "SCIENCE", "isbn": "9780553380165", "description": "An overview of cosmology and black holes.", "copies": 5 }
```
---
##### Get all books with optional filtering, sorting, and limiting.

### GET /api/books
Query Parameters:
- `filter`: Filter by genre (e.g., SCIENCE)
- `sortBy`: Sort field (e.g., createdAt)
- `sort`: asc or desc
- `limit`: Limit number of results

Example:

GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5

---


###  Get Book by ID
```bash
GET /api/books/:bookId
```
###  Update Book
```bash
PUT /api/books/:bookId
```
Example:
```bash
{ "copies": 10 }
```
✅ Delete Book
```bash
DELETE /api/books/:bookId
```
### POST /api/borrows

Borrow a book.


##### Business Logic:

Check if enough copies exist

Deduct borrowed quantity

Set available to false if copies = 0

POST /api/borrow

```bash


{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}

```
---

### GET /api/borrow

Returns borrowed books summary using aggregation.

Sample Response:
```bash
{
  "success": true,
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}

``` 
---

## Validation Rules

- title: required
- author: required
- genre: required, must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY
- isbn: required, unique
- description: optional
- copies: required, number ≥ 0
- available: default true

Borrow Schema:
- book: ObjectId (required)
- quantity: number ≥ 1
- dueDate: valid date, required

---

## Validation Messages

- "Title is required."
- "ISBN must be unique."
- "Copies must be a positive number."
- "Genre must be one of: SCIENCE, FICTION, FANTASY..."

---

## Aggregation Logic (GET /api/borrows)

1. Group borrow records by book ID  
2. Sum total quantity  
3. Lookup book details from Book collection  
4. Return book title, isbn, and total quantity in response

#  Zod Validation in Library Management API

This project uses **Zod** — a TypeScript-first schema declaration and validation library — to validate request payloads before interacting with the database.

---

##  What is Zod?

Zod is a runtime validation library that works well with TypeScript.  
It ensures API inputs are:
-  Type-safe
-  Properly validated
-  Clean and meaningful in error responses




