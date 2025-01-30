const request = require("supertest");
const { getAllBooks } = require("../controllers");
const { app } = require("../index");

const http = require("http");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllBooks: jest.fn(),
}));

let server;
beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3000, done);
});

afterAll((done) => {
  server.close(done);
});

describe("Controller Function Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Exercise 5: Mock the Get All Book Function
  it("should return all books", () => {
    let mockedBooks = [
      {
        bookId: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
      },
      {
        bookId: 2,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
      },
      {
        bookId: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
      },
    ];

    getAllBooks.mockReturnValue(mockedBooks);
    let result = getAllBooks();
    expect(result).toEqual(mockedBooks);
    expect(result.length).toBe(3);
  });
});

describe("API Endpoints Testing", () => {
  // Exercise 3: Test Retrieve All Books
  it("GET /books should get all books", async () => {
    let result = await request(server).get("/books");
    expect(result.status).toBe(200);
    expect(result.body.books).toEqual([
      {
        bookId: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
      },
      {
        bookId: 2,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
      },
      {
        bookId: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
      },
    ]);
  });
  // Exercise 4: Test Retrieve Book by ID
  it("GET /books/details/:id should return game by ID", async () => {
    let result = await request(server).get("/books/details/1");
    expect(result.status).toBe(200);
    expect(result.body.book).toEqual({
      bookId: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
    });
  });
});
