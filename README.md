# QuickNotes System Design

QuickNotes System Design is a capstone project that demonstrates how a browser-based note-taking application can communicate with a REST API and scale into an online service for one million registered users. The project includes an interactive API client using JSONPlaceholder and design documents covering the API contract, relational data model and scalable system architecture.

## Features

- Load ten notes from a REST API using GET.
- Create notes using POST.
- Delete notes using DELETE.
- Validate note titles and enforce a 100-character limit.
- Display loading, success, error and empty states.
- Disable action buttons while requests are running.
- Render user-provided text safely using `textContent`.
- Document the production API, SQL schema and scaling architecture.

## How to Run the API Client

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` using a local development server, such as the VS Code Live Server extension.
4. Click **Load notes** to fetch ten sample notes.
5. Use the form to create a note or the Delete button to remove one from the displayed list.

The project uses HTML, CSS and JavaScript. An internet connection is required to reach JSONPlaceholder.

### Practice API

The client uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a demonstration REST API.

JSONPlaceholder simulates creating and deleting records. New notes and deletions are not permanently stored by the service; changes are reflected in the current page's local state.

## Design Documents

- [API Design](docs/api-design.md) — endpoints, request and response examples, status codes and errors.
- [Data Model](docs/data-model.md) — entities, relationships, SQL schema, queries and indexes.
- [Architecture](docs/architecture.md) — requirements, load estimates, component diagram, request flows and trade-offs.

## What I Learned

- I learned how asynchronous JavaScript and `fetch()` can communicate with a REST API.
- I learned how to handle HTTP failures, validate user input and display loading, success, error and empty states.
- I learned how to design REST endpoints with suitable HTTP methods and status codes.
- I learned how primary keys, foreign keys, joins and indexes support a relational data model.
- I learned how caches, read replicas, load balancers and queues can help an application scale.
- I learned how to use Git commits to document development progress.

## Limitations

This project is a front-end demonstration and system design exercise. It does not implement a production backend, real authentication, persistent note storage or production infrastructure. The documents describe the proposed backend design.