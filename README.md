# MeraRoom

A modern room rental platform for India — built with Next.js 14, MongoDB, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Auth:** NextAuth.js
- **Images:** Cloudinary

## Getting Started

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - Cloudinary keys
   - Google Maps API key

3. Install dependencies (if not already):

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/           → Pages & API routes
components/    → UI components (layout, home, rooms, admin, ui)
lib/           → MongoDB, Cloudinary, utilities
models/        → Mongoose schemas
hooks/         → Custom React hooks
types/         → TypeScript interfaces
constants/     → App constants & config
public/        → Static assets
```

## Scripts

| Command        | Description          |
| -------------- | -------------------- |
| `npm run dev`  | Start dev server     |
| `npm run build`| Production build     |
| `npm run start`| Start production     |
| `npm run lint` | Run ESLint           |
