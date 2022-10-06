const launchesMongo = require("./launches.mongo");
const planetsMongo = require("./planets.mongo");

const launches = new Map();

let DEFAULT_FLIGHT_NO = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer ISI",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunches(launch);

// launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  const latestlaunch = await launchesMongo.findOne().sort("-flightNumber");

  if (!latestlaunch) {
    return DEFAULT_FLIGHT_NO;
  }
}

async function AllLaunches() {
  return await launchesMongo.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunches(launch) {
  const planet = await planetsMongo.findOne({
    KeplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }
  await launchesMongo.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Zero to mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunches(newLaunch);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  AllLaunches,
  scheduleLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
