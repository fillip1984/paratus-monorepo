import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2">
      <p>The collection or page was not found... how about you check out:</p>
      <Link href="/today">
        <button
          type="button"
          className="bg-primary rounded px-2 py-1 text-white"
        >
          Today
        </button>
      </Link>
      <Link href="/inbox">
        <button
          type="button"
          className="bg-secondary rounded px-2 py-1 text-white"
        >
          Inbox
        </button>
      </Link>
      <Link href="/upcoming">
        <button
          type="button"
          className="bg-secondary rounded px-2 py-1 text-white"
        >
          Upcoming
        </button>
      </Link>
    </div>
  );
}
