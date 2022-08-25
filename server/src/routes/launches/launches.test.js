const request = require("supertest");
const app = require("../../app");

describe("Test GET / launches", () => {
  test("It should respond with a status code 200", async () => {
    const response = await request(app).get("/launches").expect(200);
  });
});

describe("Test POST / launch", () => {
  const completeLaunchData = {
    mission: "USS Mission",
    rocket: "NCC 1201-D",
    target: "Kepler-186 f",
    launchDate: "January 4, 2028",
  };
  const launchDataWithoutDate = {
    mission: "USS Mission",
    rocket: "NCC 1201-D",
    target: "Kepler-186 f",
  };
  const launchDataWithInvalidDate = {
    mission: "USS Mission",
    rocket: "NCC 1201-D",
    target: "Kepler-186 f",
    launchDate: "girl",
  };
  test("It should respond with status code(201)", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing parameters", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
  test("It should catch invalid launch date", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
