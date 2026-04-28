# Team One Risk - Corporate Website

A full-fledged multipage website template for **Team One Risk**, built with:
- HTML5
- CSS3 (modern responsive UI)
- Vanilla JavaScript
- Node.js + Express backend
- SQLite database for contact and newsletter data

## Pages Included
- Home (`/`)
- About (`/about.html`)
- Services (`/services.html`)
- Contact (`/contact.html`)
- Custom 404 page

## Features
- Responsive navigation and modern hero section
- Corporate service showcase and CTA sections
- Contact inquiry form saved to database
- Newsletter subscription saved to database
- JSON API endpoints for form submission

## Setup
```bash
npm install
npm start
```

Server runs on: `http://localhost:3000`

## API Endpoints
- `POST /api/inquiry`
- `POST /api/newsletter`
- `GET /api/health`

## Database
SQLite DB file is auto-created at:
`data/teamonerisk.db`

Tables:
- `inquiries`
- `newsletter_subscribers`
