const supertest = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(async () => {
    await db("users").truncate();
  })

afterAll(async () => {
    await db.destroy()
})

test("GET /", async () => {
    // start by ARRANGING the test data we need
    const endpoint = "/"
    const status = 200

    // then we ACT on whatever we're testing
    const res = await supertest(server).get(endpoint)
    //console.log(res)

    // ASSERT the response data
    expect(res.statusCode).toBe(status)
    expect(res.type).toBe("application/json")
    expect(res.body.message).toBe("Welcome to our API")
})