const request = require("supertest");
const { getAllShows, addNewShow } = require("../controllers");
const { app } = require("../index");

const http = require("http");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllShows: jest.fn(),
  addNewShow: jest.fn(),
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

  // Test 6: Mock getAllShows Function
  it("should return all shows", () => {
    let mockedShows = [
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
      { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
      { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
    ];

    getAllShows.mockReturnValue(mockedShows);
    let result = getAllShows();
    expect(result).toEqual(mockedShows);
    expect(result.length).toBe(4);
  });

  // Test 7: Mock Add Show Function (Async)
  it("should add a show", () => {
    addNewShow.mockReturnValue({
      showId: 5,
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
    let result = addNewShow({
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
    expect(result).toEqual({
      showId: 5,
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
  });
});

describe("API Endpoints Testing", () => {
  // Test 1: Get All Shows
  it("GET /shows should get all shows", async () => {
    let result = await request(server).get("/shows");
    expect(result.status).toBe(200);
    expect(result.body.shows).toEqual([
      { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
      { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
      { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
      { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
    ]);
  });

  // Test 2: Get Show by ID
  it("GET /shows/details/:id should return show by ID", async () => {
    let result = await request(server).get("/shows/details/1");
    expect(result.status).toBe(200);
    expect(result.body.show).toEqual({
      showId: 1,
      title: "The Lion King",
      theatreId: 1,
      time: "7:00 PM",
    });
  });

  // Test 3: Add a New Show
  it("POST /shows should add a show", async () => {
    let result = await request(server).post("/shows").send({
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
    expect(result.status).toBe(201);
    expect(result.body.show).toEqual({
      showId: 5,
      title: "Phantom of the Opera",
      theatreId: 2,
      time: "5:00 PM",
    });
  });

  // Test 4: Error Handling for Get Show by Invalid ID
  it("GET /shows/details/:id should return null by invalid ID", async () => {
    let result = await request(server).get("/shows/details/99");
    expect(result.status).toBe(200);
    expect(result.body.show).toBeNull();
  });

  // Test 5: Input Validation for Add Show
  it("POST /shows should check invalid inout", async () => {
    let result = await request(server).post("/shows").send({
      theatreId: 2,
      time: "5:00 PM",
    });
    expect(result.status).toBe(400);
    expect(result.body.error).toEqual(
      "Invalid input: title must be a string, theatreId must be a number, and time must be a string.",
    );
  });
});
