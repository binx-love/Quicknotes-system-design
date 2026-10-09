# QuickNotes Data Model

## Overview

QuickNotes uses a relational database to store users, notes, tags and the relationships between notes and tags. Primary keys identify records, while foreign keys preserve referential integrity.

## Entities and Columns

### 1. users

- `id`: INTEGER, primary key.
- `name`: TEXT, required.
- `email`: TEXT, required and unique.
- `password_hash`: TEXT, required.
- `created_at`: TEXT, required.

### 2. notes

- `id`: INTEGER, primary key.
- `user_id`: INTEGER, required foreign key referencing `users.id`.
- `title`: TEXT, required, maximum 100 characters.
- `body`: TEXT, optional.
- `created_at`: TEXT, required.
- `updated_at`: TEXT, required.

### 3. tags

- `id`: INTEGER, primary key.
- `user_id`: INTEGER, required foreign key referencing `users.id`.
- `name`: TEXT, required.

A tag belongs to a user, so users can organise their notes with their own tags.

### 4. note_tags

- `note_id`: INTEGER, foreign key referencing `notes.id`.
- `tag_id`: INTEGER, foreign key referencing `tags.id`.
- Composite primary key: (`note_id`, `tag_id`).

The composite key prevents the same tag from being attached to the same note more than once.

## Relationships

**Users to notes — one-to-many:** One user can create many notes, but each note belongs to one user. The `notes.user_id` foreign key represents this relationship.

**Users to tags — one-to-many:** One user can create many tags, but each tag belongs to one user. The `tags.user_id` foreign key represents this relationship.

**Notes to tags — many-to-many:** One note can have several tags, and one tag can be used on several notes. The `note_tags` join table stores each note-tag association. It is necessary because a relational database does not directly represent a many-to-many relationship with a single foreign key.

## SQLite CREATE TABLE Statements

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
    body TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);