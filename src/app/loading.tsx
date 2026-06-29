'use client'

import LoadingSpinner from "./components/loading-spinner";

// app/blog/loading.tsx
export default function Loading() {
  return (
    <div>
      {/* Skeleton UI or spinner */}
      {/* <div className="skeleton" style={{ height: '2rem', width: '50%' }} />
      <div className="skeleton" style={{ height: '1rem', width: '80%' }} />
      <p>Loading posts...</p> */}
      <LoadingSpinner />
    </div>
  )
}