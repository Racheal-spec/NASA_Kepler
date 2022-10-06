const {
  AllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleLaunch,
} = require("../../models/launch.model");

async function getAllLaunches(req, res) {
  return res.status(200).json(await AllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  // The next checks if the date is not a number. This because isNaN
  //checks the valueOf() the date first, which is suppose to return the timestamp number, then if it is not, then it's true.
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  addNewLaunch(launch);
  await scheduleLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  getAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
