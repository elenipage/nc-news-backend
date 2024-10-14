const request = require("supertest")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const app = require("../db/app")
const data = require("../db/data/test-data/index")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe("Invalid endpoint", () => {
    test("GET:404 should respond with the appropriate status and error message if endpoint doesn't exist or is mistyped", () => {
        return request(app).get("/api/invalid")
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found')
        })  
    })
})

describe("GET: /api/topics", () => {
    test("GET:200 should respond with an array", () => {
        return request(app).get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
        })
    })
    test("GET:200 should respond with an array of topic objects with the properties: slug, description", () => {
        return request(app).get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(3)
            body.forEach(topic => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            });
        })
    })
 })
