# Jemeka Tours API Documentation

## Overview
The Jemeka Tours API is built with **Hono** and exposes a **tRPC** interface for the frontend.

## Base URL
- Development: `http://localhost:4000/api/trpc`
- Production: `https://api.jemekatours.com/api/trpc` (TBD)

## Authentication
The API uses **Auth.js** (NextAuth) session tokens stored in cookies.
- Cookie Name: `authjs.session-token` or `__Secure-authjs.session-token`

## Routers

### Destination Router
- `getBySlug`: Fetches a destination by its slug.
- `list`: Lists all active destinations.

### Package Router
- `getBySlug`: Fetches a tour package by its slug.
- `list`: Lists packages with optional filtering by destination.

### Booking Router
- `create`: Submits a new booking enquiry.
- `list` (Admin Only): Lists all bookings.
- `updateStatus` (Admin Only): Updates the status of a booking.

### Enquiry Router
- `create`: Submits a general enquiry.
- `list` (Admin Only): Lists all enquiries.

## Error Handling
The API returns structured tRPC errors. Validation errors include a `zodError` field with flattened field errors.
