const supertest = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');
const Users = require("../auth/auth-model")

beforeEach(async () => {
    await db("users").truncate();
  })

afterAll(async () => {
    await db.destroy()
})

describe("AuthN Integration Tests", () => {
    it("Registers New User", async () => {
        const newUser = {
            username: "newUserTest",
            password: "newUserPassword"
        }

        const res = await supertest(server)
            .post("/api/auth/register")
            .send(newUser)
            
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.id).toBe(1)
        expect(res.body.username).toMatch(/newusertest/i)

    })

    it("Doesn't Register New User", async () => {
		const res = await supertest(server).post("/api/auth/register")
		expect(res.statusCode).toBe(500)
    })

    it("Login the User", async () => {
        await Users.add({
            username: "newUserTest",
            password: "newUserPassword"
        })

        await supertest(server)
            .post("/api/auth/login")
            .send({
                username: "newUserTest",
                password: "newUserPassword"
            })
            .then(res => {
                expect(res.statusCode).toBe(200)
                expect(res.type).toBe("application/json")
                expect(res.body.message).toMatch(/Welcome/i)
            })
    })
})