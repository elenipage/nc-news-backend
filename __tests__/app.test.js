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
            for (let key in body) {
                expect(typeof body[key].description).toBe('string')
            }    
            })
        })
    })
    test(`GET:200 all endpoint objects except for "/api" should include queries and exampleResponse as properties`, () => {
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

 describe("GET: /api/articles", () => {
    test("GET:200 returns an array of article objects", () => {
        return request(app).get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.articles)).toBe(true)
            expect(body.articles.length).not.toBe(0)
            expect(typeof body.articles[0]).toBe('object')
        })
    })
    test("GET:200 article objects have the correct formatting with no body property and include a comment_count", () => {
        return request(app).get("/api/articles")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe('number')
            expect(typeof article.author).toBe('string')
            expect(typeof article.title).toBe('string')
            expect(typeof article.topic).toBe('string')
            expect(typeof article.created_at).toBe('string')
            expect(typeof article.votes).toBe('number')
            expect(typeof article.article_img_url).toBe('string')
            expect(typeof article.comment_count).toBe('string')
            expect(article.hasOwnProperty('body')).toBe(false)
            })
        })
    })
    test("GET:200 articles are sorted by date in descending order", () => {
        return request(app).get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
            })
    })
})

describe("GET: /api/articles/:article_id/comments", () => {
    test("GET:200 returns an array of correctly formatted comments with the given article_id", () => {
        return request(app).get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            body.comments.forEach(comment => {
                expect(comment.article_id).toBe(1)
                expect(typeof comment.comment_id).toBe('number')
                expect(typeof comment.votes).toBe('number')
                expect(typeof comment.created_at).toBe('string')
                expect(typeof comment.author).toBe('string')
                expect(typeof comment.body).toBe('string')
            })
            
        })
    })
    test("GET:200 comments should be returned with the most recent comment first", () => {
        return request(app).get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            console.log(body)
            expect(body.comments).toBeSortedBy( "created_at", {descending: true})
        })
    })
    test("GET:200 when passed an article_id that is valid but has no comments, returns an empty array", () => {
        return request(app).get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
        })
    })
    test("GET:400 when given an invalid id parameter, responds with an appropriate status and message", () => {
        return request(app).get("/api/articles/not_a_number/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("GET:404 when given an id parameter that doesn't exist in the database, responds with an appropriate status and message", () => {
        return request(app).get("/api/articles/99/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
 })