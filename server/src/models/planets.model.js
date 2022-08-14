const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

let confirmedResults = [];

const isConfirmedResults = (planets) => {
  return (
    planets["koi_disposition"] === "CONFIRMED" &&
    planets["koi_insol"] > 0.36 &&
    planets["koi_insol"] < 1.11 &&
    planets["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isConfirmedResults(data)) {
          confirmedResults.push(data);
        }
      })
      .on("end", () => {
        console.log(`${confirmedResults.length} habitable planets`);
        resolve();
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      });
  });
}

function getPlanets() {
  return confirmedResults;
}

module.exports = {
  loadPlanetsData,
  getPlanets,
};
