# Northcoders News API

## About the Project

This project is the back-end of an "nc-news" site. The database holds tables including articles, users, topics and comments, and has endpoints to do things such as fetch and filter articles, add or remove comments, and add or remove article votes.

A list of availabe endpoints and what they do can be found at the /api endpoint.

You can view the hosted version of this project [here](https://nc-news-backend-37tu.onrender.com/api)!


## Getting Started

### Prerequisites

To run this project you will need:

- `Node.js` version `>=12`

- `Postgres` version `>=8.8.0`

---
### Cloning and Installation

To clone this repo, run: 
```sh
git clone https://github.com/elenipage/nc-news-backend.git
```

To install all relevent NPM packages: 
```sh
npm install
```

## Seeding your Local Databases

If you don't already have databases set up locally, you can run:
```sh
npm run setup-dbs
```

You'll need to add a `.env` file that sets the PGDATABASE environment variable to the name of your database. You will need two of these, one for development and one for testing.

For example:

```js
PGDATABASE=database_name_here
```

See the `.env-example` file for an example of how to set up these files.

---
### Now, to seed your tables: 
```sh
npm run seed
```

## Testing

If you want to run the tests, use:
```sh
npm test app
```
This will run the tests for all of the available endpoints using your test database. 

Your test database will be re-seeded before each test is run.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
