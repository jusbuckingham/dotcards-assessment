# dotcards-assessment

## The Problem

You’ve been asked to build a generic database proxy - that is, a REST API for CRUD on a SQL database - in Node.JS. Translate REST language into valid SQL statements using your API endpoint handlers, written in Typescript/Node. Use any server framework (Express, Koa) and SQL flavor (MySQL, Postgres) you like.
You don’t know what the schema looks like, so your DB proxy should implement a system to ingest schema files (could be TS or JSON, whatever you like) and build the DB schema based on that, on every server startup.

## Technical Requirements
- Create, Read, Update and Delete SQL statements should map to 
  - POST /:collection
  - GET /:collection/:id
  - POST /:collection/:id 
  - DELETE /:collection/:id

- DB Proxy should check for the existence of the tables specified by your example schema and create/add columns if not detected.
- Your DB can be a local SQLite instance or you may include a Dockerfile to define it.
- This project should use Typescript and Node.JS.
- This project should include a README that addresses anything you may not have completed. It should also address what additional changes you might need to make if the application were intended to run in a concurrent environment. Any other comments or thoughts about the project are also welcome.

## Bonus Points
Automated tests that ensure the business logic implemented is correct.
