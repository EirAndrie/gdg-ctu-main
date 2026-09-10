# GDGoC‑CTU‑Main – Backend API Reference

All routes are mounted in **`backend/src/modules/index.ts`** and are prefixed with the versioned base path defined in `backend/src/server.ts`:

```
GET/POST/…  /GDGoC-CTU-Main/v0.0.1/<module-router>
```

> **Note** – In the frontend you will most likely use a shared Axios instance where the `baseURL` already contains the versioned prefix (`/GDGoC-CTU-Main/v0.0.1`). That means the paths listed below can be used **without** the prefix when you call `axios.get('/admins')`, `axios.post('/media', ...)`, etc.

---

## 1. Admins (`/admins`)

| Method   | Path          | Description                                           |
| -------- | ------------- | ----------------------------------------------------- |
| `POST`   | `/admins/`    | Create a new admin.                                   |
| `GET`    | `/admins/`    | List admins (supports `page` & `limit` query params). |
| `GET`    | `/admins/:id` | Get a single admin by UUID.                           |
| `PATCH`  | `/admins/:id` | Update an admin (partial payload).                    |
| `DELETE` | `/admins/:id` | Delete an admin (fails if referenced elsewhere).      |

---

## 2. Auth (`/auth`)

| Method | Path              | Description                                                     |
| ------ | ----------------- | --------------------------------------------------------------- |
| `GET`  | `/auth/me`        | Return the currently‑authenticated Clerk admin (protected).     |
| `POST` | `/auth/auth/sync` | Sync the Clerk user into the local `admins` table (admin‑only). |

---

## 3. Team Members (`/team-members`)

| Method   | Path                       | Description                                                                        |
| -------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `POST`   | `/team-members/`           | Create a new team‑member (no image).                                               |
| `POST`   | `/team-members/with-image` | Create a team‑member **and** upload a profile image in a single multipart request. |
| `GET`    | `/team-members/`           | List team‑members (pagination).                                                    |
| `GET`    | `/team-members/slug/:slug` | Get a team‑member by its slug.                                                     |
| `GET`    | `/team-members/:id`        | Get a team‑member by UUID.                                                         |
| `PATCH`  | `/team-members/:id`        | Update a team‑member (optional new profile image).                                 |
| `DELETE` | `/team-members/:id`        | Delete a team‑member (blocked if referenced by events).                            |

---

## 4. Events (`/events`)

| Method   | Path                 | Description                                                                  |
| -------- | -------------------- | ---------------------------------------------------------------------------- |
| `POST`   | `/events/`           | Create a new event. Optional multipart `file` field for cover image.         |
| `GET`    | `/events/`           | List events (pagination).                                                    |
| `GET`    | `/events/slug/:slug` | Get an event by its slug.                                                    |
| `GET`    | `/events/:id`        | Get an event by UUID.                                                        |
| `PATCH`  | `/events/:id`        | Update an event. Optional multipart `file` field to replace the cover image. |
| `DELETE` | `/events/:id`        | Delete an event.                                                             |

---

## 5. Event Hosts (`/event-hosts`)

| Method   | Path               | Description                                                |
| -------- | ------------------ | ---------------------------------------------------------- |
| `POST`   | `/event-hosts/`    | Create a new event‑host linking a team‑member to an event. |
| `GET`    | `/event-hosts/`    | List event‑hosts (pagination).                             |
| `GET`    | `/event-hosts/:id` | Get a specific event‑host.                                 |
| `PATCH`  | `/event-hosts/:id` | Update an event‑host.                                      |
| `DELETE` | `/event-hosts/:id` | Delete an event‑host.                                      |

---

## 6. Event Attendees (`/event-attendees`)

| Method   | Path                   | Description                           |
| -------- | ---------------------- | ------------------------------------- |
| `POST`   | `/event-attendees/`    | Register a new attendee for an event. |
| `GET`    | `/event-attendees/`    | List attendees (pagination).          |
| `GET`    | `/event-attendees/:id` | Get a single attendee by UUID.        |
| `PATCH`  | `/event-attendees/:id` | Update attendee information.          |
| `DELETE` | `/event-attendees/:id` | Delete an attendee.                   |

---

## 7. Event Speakers (`/event-speakers`)

| Method   | Path                                                        | Description                                           |
| -------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `POST`   | `/event-speakers/`                                          | Create a new speaker entry for an event.              |
| `GET`    | `/event-speakers/`                                          | List all event speakers.                              |
| `GET`    | `/event-speakers/slug/:slug`                                | Get a speaker by its slug.                            |
| `GET`    | `/event-speakers/:id`                                       | Get a speaker by UUID.                                |
| `PATCH`  | `/event-speakers/:id`                                       | Update a speaker.                                     |
| `DELETE` | `/event-speakers/:id`                                       | Delete a speaker.                                     |
| `GET`    | `/event‑speakers/team‑members/:teamMemberId/event‑speakers` | List speakers associated with a specific team‑member. |

---

## 8. Media (`/media`)

| Method   | Path         | Description                                            |
| -------- | ------------ | ------------------------------------------------------ |
| `POST`   | `/media/`    | Upload a media file (uses Multer memory storage).      |
| `GET`    | `/media/`    | List media assets (pagination).                        |
| `GET`    | `/media/:id` | Retrieve a single media record.                        |
| `PATCH`  | `/media/:id` | Update media metadata.                                 |
| `DELETE` | `/media/:id` | Delete a media record (also removes Cloudinary asset). |

---

## 9. Media Collections (`/media-collections`)

| Method   | Path                     | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `POST`   | `/media-collections/`    | Create a new media collection. |
| `GET`    | `/media-collections/`    | List collections (pagination). |
| `GET`    | `/media-collections/:id` | Get a collection by UUID.      |
| `PATCH`  | `/media-collections/:id` | Update collection fields.      |
| `DELETE` | `/media-collections/:id` | Delete a collection.           |

---

## 10. Media Collection Items (`/media-collection-items`)

| Method   | Path                                             | Description                               |
| -------- | ------------------------------------------------ | ----------------------------------------- |
| `POST`   | `/media-collection-items/`                       | Add a media item to a collection.         |
| `GET`    | `/media-collection-items/`                       | List collection‑items (pagination).       |
| `GET`    | `/media-collection-items/:collectionId/:mediaId` | Retrieve a specific item by composite PK. |
| `DELETE` | `/media-collection-items/:collectionId/:mediaId` | Remove a media item from its collection.  |

---

## 11. Site Content (`/site-content`)

| Method   | Path                                | Description                             |
| -------- | ----------------------------------- | --------------------------------------- |
| `POST`   | `/site-content/`                    | Create a new piece of site content.     |
| `GET`    | `/site-content/`                    | List all site‑content entries.          |
| `GET`    | `/site-content/section/:sectionKey` | Get content for a specific section key. |
| `GET`    | `/site-content/:id`                 | Get a single site‑content record.       |
| `PATCH`  | `/site-content/:id`                 | Update site‑content.                    |
| `DELETE` | `/site-content/:id`                 | Delete a site‑content record.           |

---

## 12. Member Terms (`/member-terms`)

| Method   | Path                    | Description                                                                        |
| -------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `POST`   | `/member-terms/`        | Create a new member term.                                                          |
| `GET`    | `/member-terms/`        | List member terms (pagination).                                                    |
| `GET`    | `/member-terms/by-term` | List members for a specific term (supports `termId` query param, plus pagination). |
| `GET`    | `/member-terms/:id`     | Get a member term by UUID.                                                         |
| `PATCH`  | `/member-terms/:id`     | Update a member term.                                                              |
| `DELETE` | `/member-terms/:id`     | Delete a member term.                                                              |

---

## 13. Terms (`/terms`)

| Method   | Path         | Description              |
| -------- | ------------ | ------------------------ |
| `POST`   | `/terms/`    | Create a new term.       |
| `GET`    | `/terms/`    | List terms (pagination). |
| `GET`    | `/terms/:id` | Get a term by UUID.      |
| `PATCH`  | `/terms/:id` | Update a term.           |
| `DELETE` | `/terms/:id` | Delete a term.           |

---

## 14. Using the Endpoints with Axios

A typical front‑end setup will create a single Axios instance that already includes the versioned base path:

```ts
// src/api/axiosInstance.ts
import axios from "axios";

export const api = axios.create({
      // Base URL points to the API server; the version prefix is baked in.
      baseURL: "/GDGoC-CTU-Main/v0.0.1",
      // You can add auth headers, interceptors, etc., here.
});
```

Because the `baseURL` contains `/GDGoC-CTU-Main/v0.0.1`, you can call the routes exactly as they appear in this document **without** the prefix:

```ts
// Example: fetch the first page of admins
import { api } from "./axiosInstance";

const admins = await api.get("/admins", { params: { page: 1, limit: 20 } });

// Example: create a new event with a cover image (multipart/form‑data)
const form = new FormData();
form.append("title", "Hackathon 2026");
form.append("file", imageFile); // <input type="file" name="file" />
await api.post("/events", form);
```

If you ever need to change the API version, only the `baseURL` in the Axios instance has to be updated – the endpoint list remains the same.

---

## 15. How to Use This Document

- **Base URL** – prepend your server host (e.g., `https://api.example.com`) and the version prefix **only** when you are not using the shared Axios instance.
- **Authentication** – all routes are registered under a **protected router** (`protectedRouter.use(requireAuth)`) in `backend/src/modules/index.ts`. Therefore a valid Clerk session (or the `requireAuth` middleware) is required for every endpoint **except** those that might be publicly exposed later (none at present).
- **Pagination** – most list endpoints accept `?page=1&limit=20` (validated by `validateQuery` middleware). Adjust limits as needed.
- **Error handling** – controllers throw `AppError` (with HTTP status codes). The global error handler converts them to JSON responses (`{ success: false, error: "...", ... }`).
