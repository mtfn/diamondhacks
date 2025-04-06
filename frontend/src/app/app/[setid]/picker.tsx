"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { toast } from "sonner";

export default function Picker() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">You are not logged in.</p>
        <a href={"/api/auth/login"} className="btn btn-primary ml-4">
          Login
        </a>
      </div>
    );
  }

  const selectChallengeSet = async (id: number) => {
    const resp = await fetch(`http://127.0.0.1:5000/sessions/${user.sub}`, {
      method: "POST",
      body: JSON.stringify({
        challenge_set_id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status !== 201) {
      try {
        const json = await resp.json();
        toast.error(
          json.error || "Failed to select challenge set. Please try again."
        );
      } catch {
        toast.error("Failed to select challenge set. Please try again.");
      }
      return;
    }
  };

  return (
    <nav className="h-full m-1">
      <li className="p-4 space-y-2">
        <ul className="w-full">
          <button
            className="btn btn-outline w-full btn-info"
            onClick={() => selectChallengeSet(0)}
          >
            Challenge Set 1
          </button>
        </ul>
        <ul className="p-2 btn btn-outline w-full">Second Option</ul>
      </li>
    </nav>
  );
}
