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
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
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

 describe("GET: /api", () => {
    test("GET:200 should respond with an object", () => {
        return request(app).get("/api")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe('object')
        })
    })
    test("GET:200 should respond with an object with each endpoint as a property, and an object full of information as its value", () => {
        return request(app).get("/api")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe('object')
            expect(typeof body['GET /api']).toBe('object')
            expect(typeof body['GET /api/topics']).toBe('object')
            expect(typeof body['GET /api/articles']).toBe('object')
        })
    })
    test("GET:200 all endpoint objects should include a description property", () => {
        return request(app).get("/api")
        .expect(200)
        .then(({body}) => {
            const keys = Object.keys(body)
            keys.forEach(key => {
                expect(typeof body[key].description).toBe('string')
            })
        })
    })
    test(`GET:200 all endpoint objects except for "/api" should include queries array and exampleResponse object as properties`, () => {
        return request(app).get("/api")
        .expect(200)
        .then(({body}) => {
            const keys = Object.keys(body)
            keys.shift()
            keys.forEach(key => {
                expect(Array.isArray(body[key].queries)).toBe(true)
                expect(typeof body[key].exampleResponse).toBe('object')
            })
        })
    })
 })

 describe("GET: /api/articles/:article_id", () => {
    test("GET:200 should respond with an object", () => {
        return request(app).get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe('object')
        })
    })
    test("GET:200 returns an article based on the id given as a parameter", () => {
        return request(app).get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.article_id).toBe(1)
        })
    })
    test("GET:200 returns a correctly formatted article with all the correct properties", () => {
        return request(app).get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            console.log(body)
            expect(typeof body.article_id).toBe('number')
            expect(typeof body.author).toBe('string')
            expect(typeof body.title).toBe('string')
            expect(typeof body.body).toBe('string')
            expect(typeof body.topic).toBe('string')
            expect(typeof body.created_at).toBe('string')
            expect(typeof body.votes).toBe('number')
            expect(typeof body.article_img_url).toBe('string')
        })
    })
    test("GET:400 returns an appropriate status and message when passed an invalid parameter", () => {
        return request(app).get("/api/articles/not_a_number")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("GET:404 returns an appropriate status and message when passed a valid id that is not present in the table", () => {
        return request(app).get("/api/articles/99")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
 })