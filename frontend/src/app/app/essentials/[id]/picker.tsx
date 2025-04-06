"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Challenge } from "~/lib/types";

export default function Picker({
  challenges,
  selected,
}: {
  challenges: Challenge[];
  selected: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  console.log(challenges, selected);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">You are not logged in.</p>
      </div>
    );
  }

  const selectChallengeSet = async (id: number) => {
    if (selected === id) {
      toast.info(
        "This challenge set is already selected. Press reset to clear your work."
      );
      return;
    }

    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`,
      {
        method: "DELETE",
        headers: {
          "X-Pinggy-No-Screen": "true",
        }
      }
    ).catch(() => {
      // not deleting is fine
      return;
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`,
      {
        method: "POST",
        body: JSON.stringify({
          challenge_set_id: id,
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Pinggy-No-Screen": "true",
        },
      }
    );

    setLoading(false);

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

    // redirect
    router.push(`/app/essentials/${id}`);
    toast.success("Challenge set selected");
  };

  return (
    <nav className="h-full m-1">
      {loading && (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      )}
      <li className="p-4 space-y-2">
        {challenges.map((challenge) => (
          <ul key={challenge.id} className="w-full">
            <button
              className={
                "btn btn-outline w-full justify-start ps-4" +
                (selected === challenge.id ? " btn-info" : "")
              }
              onClick={() => selectChallengeSet(challenge.id)}
            >
                {challenge.name}
            </button>
          </ul>
        ))}
      </li>
    </nav>
  );
}
