# QuickNotes System Architecture

## 1. Overview

QuickNotes is moving from browser-only storage to an online service for one million registered users. The system must securely manage notes, provide fast retrieval, support note creation and deletion, and scale as usage increases.

The proposed design separates the web client, application processing, caching, relational data storage and asynchronous background work.

## 2. Functional Requirements

- Users can authenticate and access their own notes.
- Users can create, list, update and delete notes.
- Users can organise notes with tags.
- Users can search and paginate through their notes.
- The API validates inputs and returns meaningful HTTP status codes.
- Users cannot access another user's private notes.
- The service supports asynchronous background jobs where appropriate.

## 3. Non-Functional Requirements

- **Scalability:** Application capacity can increase by adding app servers.
- **Availability:** The service should continue operating when an individual app server fails.
- **Performance:** Frequently requested data should be served with low latency.
- **Security:** HTTPS, authentication, authorisation and secure secret handling are required.
- **Durability:** Database backups and recovery procedures protect stored notes.
- **Consistency:** Note creation and updates must be persisted reliably.
- **Observability:** Logs, metrics, alerts and health checks help detect failures.
- **Maintainability:** Clear API contracts and separated components simplify changes.

## 4. Load Estimates for One Million Users

### Assumptions

- Registered users: 1,000,000.
- 10% are active on an average day: 100,000 daily active users.
- Each active user makes 50 note-list or note-read requests per day.
- Each active user creates one note per day.
- A stored note, including its average text and metadata, uses approximately 2 KB.
- One day has 86,400 seconds and one year has 365 days.
- The figures represent average traffic, not peak traffic.
- These estimates exclude login traffic, tag operations, retries, indexes, backups and replication overhead.

### Reads per second

Daily read requests:

100,000 active users × 50 reads = 5,000,000 reads per day.

Average reads per second:

5,000,000 ÷ 86,400 ≈ **57.87 reads per second**.

For planning, a five-times peak estimate would be approximately 289 reads per second.

### Writes per second

Daily note creations:

100,000 active users × 1 note = 100,000 writes per day.

Average writes per second:

100,000 ÷ 86,400 ≈ **1.16 writes per second**.

For planning, a five-times peak estimate would be approximately 5.79 writes per second. Updates and deletes would add further writes.

### Storage per year

Annual notes created:

100,000 notes per day × 365 = 36,500,000 notes.

Annual raw note storage:

36,500,000 × 2 KB = 73,000,000 KB.

Using decimal units, this is approximately **73 GB per year** of new note data.

Actual storage requirements will be higher after accounting for indexes, backups, replicas, database overhead and other records. This estimate is for text notes and metadata, not photo or video attachments.

## 5. Architecture Diagram

```text
                         +------------------+
                         |      Client      |
                         | Web / Mobile App |
                         +------------------+
                                  |
                                  v
                         +------------------+
                         |       DNS        |
                         | Domain Resolution|
                         +------------------+
                                  |
                                  v
                         +------------------+
                         |       CDN        |
                         | Static Assets    |
                         +------------------+
                                  |
                                  v
                         +------------------+
                         |  Load Balancer   |
                         +------------------+
                            /           \
                           v             v
                  +----------------+ +----------------+
                  | App Server 1   | | App Server 2   |
                  | API / Auth     | | API / Auth     |
                  +----------------+ +----------------+
                           \             /
                            \           /
                    +--------+---------+--------+
                    |                           |
                    v                           v
             +--------------+            +--------------+
             | Cache        |            | Primary DB   |
             | Notes / Tags |            | Read / Write |
             +--------------+            +--------------+
                                                |
                                                | Replication
                                                v
                                         +--------------+
                                         | Read Replica |
                                         | Read Queries |
                                         +--------------+

                  App Servers
                       |
                       v
                +--------------+
                | Job Queue    |
                +--------------+
                       |
                       v
                +--------------+
                | Worker       |
                | Background   |
                | Jobs         |
                +--------------+
                       |
                       v
                +--------------+
                | Primary DB   |
                | / External   |
                | Services     |
                +--------------+