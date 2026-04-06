# Appifylab Full Stack Engineer Task

A social feed web application built with React, TypeScript, Vite, Redux Toolkit, and RTK Query.

This project includes authentication, feed timeline, profile management, comments/reactions, image uploads, and post privacy controls.

## Live Features Implemented

### Authentication

- User login
- User registration
- Token refresh flow
- Protected routes (`/`, `/feed`, `/profile`)
- Logout flow with state cleanup

### Feed and Posts

- Create post with image upload
- Edit post content/image
- Delete post
- Like and unlike post with optimistic UI
- Comments section loading and creation support
- Owner dropdown actions

### Post Visibility (Public/Private)

- Posts support `PUBLIC` and `PRIVATE` visibility
- Post owner can toggle visibility from post dropdown:
  - `Make Private`
  - `Make Public`
- Public feed hides private posts for other users
- Owner can still see own private posts
- My Posts page shows all owner posts

### Profile

- Dedicated profile page (`/profile`)
- Fetch profile data from API
- Update profile fields:
  - `name`
  - `first_name`
  - `last_name`
  - `phone`
  - `bio`
  - `location`
- Profile image upload support
- Edit mode is opened from avatar edit icon
- Profile form hidden by default until edit icon is clicked

### Data Refresh and Cache Handling

- Profile update invalidates profile query and refetches
- Profile update also invalidates posts and my posts queries
- Profile page refetches on mount/focus/reconnect
- Stale profile data guard for user switching (prevents showing cached data from previous user)

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- React Router DOM
- React Toastify
- Bootstrap 5

## Project Structure (High Level)

```text
src/
  api/                 # API route definitions
  components/          # Reusable UI components
  hooks/               # Custom hooks
  routes/              # Public/private route handling
  store/
    api/               # RTK Query APIs (auth, posts, comments, likes, replies)
    slices/            # Redux slices
  views/
    feed/              # Feed page
    login/             # Login page
    registration/      # Registration page
    profile/           # Profile page
```

## API Base URL Configuration

The app reads backend base URL from environment variable:

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

If not provided, the default fallback is:

```text
http://localhost:5050/api
```

## Installation and Run

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

### 5) Run lint

```bash
npm run lint
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build
- `npm run preview` - Preview built app
- `npm run lint` - Run ESLint

## Routing

- Public:
  - `/login`
  - `/registration`
- Private:
  - `/`
  - `/feed`
  - `/profile`

## Notes for Reviewers

- The project uses RTK Query cache invalidation for profile and posts synchronization.
- Post visibility logic is enforced in the UI layer for feed rendering.
- Profile page includes protection against stale cached profile mismatch after account switch.

## Future Improvements

- Add unit/integration tests
- Add role-based authorization checks at API response level
- Add pagination/infinite scroll for feed
- Add stronger form validation and field-level error messages
