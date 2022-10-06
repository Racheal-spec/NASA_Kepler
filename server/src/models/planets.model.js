const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

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
      .on("data", async (data) => {
        if (isConfirmedResults(data)) {
          savePlanet(data);
          // confirmedResults.push(data);
        }
      })
      .on("end", async () => {
        const getPlanetsLength = (await getPlanets()).length;
        console.log(`${getPlanetsLength} habitable planets`);
        resolve();
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      });
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        KeplerName: planet.kepler_name,
      },
      {
        KeplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`could not save planet, ${err}`);
  }
}

async function getPlanets() {
  return await planets
    .find
    // {},
    // {
    //   _id: 0,
    //   __v: 0,
    // }
    ();
}

module.exports = {
  loadPlanetsData,
  getPlanets,
};
