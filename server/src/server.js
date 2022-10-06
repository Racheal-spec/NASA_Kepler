const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const PORT = process.env.PORT || 5000;

const MONGO_URL =
  "mongodb+srv://Nasa-Api:qKxfriizLIXU0nsz@nasa-api.59syemr.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Mongo DB connection ready!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});
const server = http.createServer(app);

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData();
}

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

startServer();
