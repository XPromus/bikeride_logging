# Ride Database

Small Angular, NestJS and MongoDB learning project.

Upload GPX files from bike rides, view parsed statistics (distance, elevation, average moving speed), and see the route on an interactive map.

## Architecture

```
Browser ──> nginx (port 80) ──> Frontend (static files)
                            └──> /api/* ──> NestJS (port 3000) ──> MongoDB (port 27017)
```

| Layer | Technology |
|---|---|
| Frontend | Angular 22, Tailwind CSS 4, Leaflet |
| Backend | NestJS 11, Mongoose 9.9, fast-xml-parser |
| Database | MongoDB |
| Reverse Proxy | nginx (SPA routing + API proxy) |
| API Docs | Swagger UI (`/api`) |
| Infra | Docker Compose |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/gpx` | List all rides (sorted by date, descending) |
| `GET` | `/gpx/:id` | Get a single ride by ID |
| `GET` | `/gpx/points/:id` | Get track points for a ride |
| `POST` | `/gpx/upload` | Upload a GPX file (multipart/form-data, max 10 MB) |
| `DELETE` | `/gpx/:id` | Delete a ride |

## GPX Processing

The backend parses uploaded GPX files and computes:

- **Distance** via the Haversine formula
- **Elevation gain** (cumulative positive elevation changes)
- **Average moving speed** in km/h, filtering out stops (speed < 1 km/h)
