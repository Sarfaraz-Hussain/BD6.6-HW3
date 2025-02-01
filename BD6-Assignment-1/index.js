let express = require("express");
let app = express();
let cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.json());

const { getAllShows, getShowById, addNewShow } = require("./controllers");

// Exercise 1: Get All Shows
app.get("/shows", async (req, res) => {
  let shows = getAllShows();
  res.json({ shows });
});

// Exercise 2: Get Show by ID
app.get("/shows/details/:id", async (req, res) => {
  let show = getShowById(parseInt(req.params.id));
  res.json({ show });
});

// Exercise 3: Add a New Show
app.post("/shows", async (req, res) => {
  let data = req.body;
  if (
    !data.title ||
    typeof data.title !== "string" ||
    !data.theatreId ||
    typeof data.theatreId !== "number" ||
    !data.time ||
    typeof data.time !== "string"
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid input: title must be a string, theatreId must be a number, and time must be a string.",
      });
  }
  let show = addNewShow(data);
  res.status(201).json({ show });
});
module.exports = {
  app,
};
