# QuickNotes REST API Design

## Overview

The QuickNotes API allows authenticated users to create, retrieve, update and delete their notes and organise them with tags.

Base URL: `https://api.quicknotes.example.com/v1`

All request and response bodies use JSON. Protected endpoints require a valid bearer access token.

## Endpoints

| Method | Path | Description | Success status |
|---|---|---|---|
| GET | `/notes` | List the authenticated user's notes; supports pagination. | 200 OK |
| GET | `/notes/{id}` | Retrieve one note owned by the user. | 200 OK |
| POST | `/notes` | Create a new note. | 201 Created |
| PUT | `/notes/{id}` | Replace an existing note's editable fields. | 200 OK |
| PATCH | `/notes/{id}` | Partially update a note. | 200 OK |
| DELETE | `/notes/{id}` | Delete a note owned by the user. | 204 No Content |
| GET | `/notes?tag=study` | List the user's notes matching a tag. | 200 OK |
| GET | `/tags` | List tags available to the authenticated user. | 200 OK |

## Create a Note

### Request

`POST /v1/notes`

```json
{
  "title": "Prepare for the presentation",
  "body": "Review the architecture diagram.",
  "tagIds": [2, 4]
}