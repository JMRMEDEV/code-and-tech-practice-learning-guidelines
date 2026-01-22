# Movie Explorer — Challenge

## Background

A media company wants a lightweight movie exploration client that allows users to browse, search, and save favorite movies. The application must consume a public API (TMDB) and support offline-friendly behavior for favorites via local persistence. The focus is on clean architecture, state management, performance, and correctness.

The app should remain small but well-structured, with strong typing, predictable state flow, and clear UX feedback during loading, errors, and navigation.

---

## Tech Stack Requirements

**Required:**

* React (18+)
* TypeScript
* React Router
* State Management: Zustand **or** Redux Toolkit
* Styling: Tailwind **or** CSS Modules
* Build Tool: Vite **or** Next.js
* Data Source: TMDB API
* Testing: Vitest or Jest + React Testing Library

**Optional new learning tech:**

* Custom hooks with caching strategies
* Error Boundaries and React Suspense

---

## Expected Capabilities

1. Dynamic search with debounced input and error handling
2. Movie listing with responsive grid layout
3. Infinite scroll or paginated fetching
4. Details page with caching to avoid redundant API calls
5. Favorites functionality with local persistence (localStorage or IndexedDB)
6. Clear loading, error, and empty states throughout the UI

---

## Functional Requirements

* **Search**: Query TMDB API with debouncing; show errors gracefully.
* **Movie List**: Responsive grid; infinite scroll or pagination.
* **Movie Detail**: Show detailed info; cache responses for fast revisits.
* **Favorites**:

  * Persist locally (localStorage or IndexedDB)
  * Mark/unmark favorites from listing and detail views
* **Offline-friendly favorites**: Favorites list should load without API calls.

---

## Non-Functional Requirements

* Strong TypeScript typing (minimal `any` usage)
* Modular architecture with clear separation of concerns
* Error Boundaries for major failures
* Custom hooks for data fetching or caching logic
* Predictable state management with selectors when applicable
* Testing coverage (unit + integration where reasonable)

---

## Data Model

**Movie (simplified)**

```
id: number
 title: string
 overview: string
 posterPath: string | null
 releaseDate: string
 voteAverage: number
 genres?: string[]
```

**Favorite**

```
id: number
 addedAt: string
```

You may expand or adjust based on TMDB fields.

---

## Constraints

* Must run locally with free TMDB API access (requires API key but no payment).
* No paid services or external cloud dependencies.
* Entire app must run via a single command (e.g., `npm run dev`).
* Must be completable within 1–2 weeks.

---

## Deliverables

* Fully working Movie Explorer app
* README with setup instructions
* Demo screenshots or video
* Explanation of architectural decisions
* Test cases (unit + integration)

---

## Evaluation Focus

* **Type Safety**: Strong TS models and strict component props
* **State Management Quality**: Predictability, memoization, selectors
* **Architecture**: Modular, clean, and maintainable structure
* **UX Quality**: Responsive layout, proper loading & empty states
* **Performance**: Debouncing, caching, avoiding unnecessary re-renders
* **Testing**: Coverage and clarity of test cases
* **Error Handling**: Boundaries, retry mechanisms, fallback states

---

## Assets

TMDB API Docs: [https://developer.themoviedb.org/docs/getting-started](https://developer.themoviedb.org/docs/getting-started)
