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

 describe.only("GET: /api/articles", () => {
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
    test("GET:200 accepts a sort_by query which sorts the articles by the given column", () => {
        return request(app).get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('votes', {descending: true})
            })
    })
    test("GET:200 accepts an order query which sorts the articles in the given order", () => {
        return request(app).get("/api/articles?order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSorted({ascending: true})
            })
    })
    test("GET:400 when passed an invalid sort_by column, returns appropriate status and message", () => {
        return request(app).get("/api/articles?sort_by=not_a_column")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            })
    })
    test("GET:400 when passed an invalid order, returns appropriate status and message", () => {
        return request(app).get("/api/articles?order=not_an_order")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            })
    })
    test("GET:200 accepts a topic query which filters the articles by the topic value specified", () => {
        return request(app).get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test("GET:404 if the topic passed is invalid or not present in the database, return an appropriate status and message", () => {
        return request(app).get("/api/articles?topic=octopuses")
        .expect(404)
        .then(({body}) => {
                expect(body.msg).toBe('Not Found')
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

 describe("POST: /api/articles/:article_id/comments", () => {
    test("POST:201 inserts a new comment into the database and returns the posted comment", () => {
        const newComment = {
            body: "this is a new test comment",
            author: 'rogersop'
        }
        return request(app).post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comment.article_id).toBe(2)
            expect(body.comment.comment_id).toBe(19)
            expect(typeof body.comment.votes).toBe('number')
            expect(typeof body.comment.created_at).toBe('string')
            expect(typeof body.comment.author).toBe('string')
            expect(typeof body.comment.body).toBe('string')
        })
    })
    test("POST:400 when passed an invalid article id, responds with an appropriate status and message", () => {
        const newComment = {
            body: "this is a new test comment",
            author: 'rogersop'
        }
        return request(app).post("/api/articles/not_a_valid_id/comments")
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("POST:400 when passed an incomplete comment, responds with an appropriate message and status", () => {
        const newComment = {
            author: 'rogersop'
        }
        return request(app).post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("POST:404 when passed a valid article id that does not exist in the database, responds with an appropriate status and message", () => {
        const newComment = {
            body: "this is a new test comment",
            author: 'rogersop'
        }
        return request(app).post("/api/articles/99/comments")
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
 })

 describe("PATCH: /api/articles/:article_id", () => {
    test("PATCH:200 increments the votes by the given value for the article with the corresponding id, then returns the updated article", () => {
        const voteIncrement = {
            inc_votes: 1
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1)
            expect(body.article.votes).toBe(101)
            expect(typeof body.article.author).toBe('string')
            expect(typeof body.article.title).toBe('string')
            expect(typeof body.article.body).toBe('string')
            expect(typeof body.article.topic).toBe('string')
            expect(typeof body.article.created_at).toBe('string')
            expect(typeof body.article.article_img_url).toBe('string')
        })
    })
    test("PATCH:400 when passed an invalid article id, returns the appropriate status and message", () => {
        const voteIncrement = {
            inc_votes: 1
        }
        return request(app).patch("/api/articles/not_an_id")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:400 when passed an incomplete vote increment, returns the appropriate status and message", () => {
        const voteIncrement = {
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:400 when passed an invalid vote increment, returns the appropriate status and message", () => {
        const voteIncrement = {
            inc_votes: 'not a number'
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:404 when passed a valid article id that does not exist in the database, returns the appropriate status and message", () => {
        const voteIncrement = {
        }
        return request(app).patch("/api/articles/99")
        .send(voteIncrement)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
 })

 describe("DELETE:204 /api/comments/:comment_id", () => {
    test("DELETE:204 deletes the comment with the corresponding id from the comments database", () => {
        return request(app).delete("/api/comments/1")
        .expect(204)
        .then(() => {
        return request(app).delete("/api/comments/1")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
        })
    })
    test("DELETE:400 when passed an invalid id, responds with the appropriate status and message", () => {
        return request(app).delete("/api/comments/not_an_id")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("DELETE:404 when passed an id for a comment that is not in the database, responds with the appropriate status and message", () => {
        return request(app).delete("/api/comments/99")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    })
})
    
describe("PATCH: /api/articles/:article_id", () => {
    test("PATCH:200 increments the votes by the given value for the article with the corresponding id, then returns the updated article", () => {
        const voteIncrement = {
            inc_votes: 1
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1)
            expect(body.article.votes).toBe(101)
            expect(typeof body.article.author).toBe('string')
            expect(typeof body.article.title).toBe('string')
            expect(typeof body.article.body).toBe('string')
            expect(typeof body.article.topic).toBe('string')
            expect(typeof body.article.created_at).toBe('string')
            expect(typeof body.article.article_img_url).toBe('string')
        })
    })
    test("PATCH:400 when passed an invalid article id, returns the appropriate status and message", () => {
        const voteIncrement = {
            inc_votes: 1
        }
        return request(app).patch("/api/articles/not_an_id")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:400 when passed an incomplete vote increment, returns the appropriate status and message", () => {
        const voteIncrement = {
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:400 when passed an invalid vote increment, returns the appropriate status and message", () => {
        const voteIncrement = {
            inc_votes: 'not a number'
        }
        return request(app).patch("/api/articles/1")
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test("PATCH:404 when passed a valid article id that does not exist in the database, returns the appropriate status and message", () => {
        const voteIncrement = {
        }
        return request(app).patch("/api/articles/99")
        .send(voteIncrement)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
 })

 describe("GET:200 /api/users", () => {
    test("GET:200 should respond with an array of all user objects with the correct properties", () => {
        return request(app).get("/api/users")
        .expect(200)
        .then(({body}) => {
            const users = body.users
            expect (Array.isArray(users)).toBe(true)
            expect(users.length).toBe(4)
            users.forEach(user => {
                expect(typeof user.username).toBe('string')
                expect(typeof user.name).toBe('string')
                expect(typeof user.avatar_url).toBe('string')
            });
        })
    })
})
    
