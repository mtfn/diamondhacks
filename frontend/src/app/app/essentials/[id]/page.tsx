import { auth0 } from "~/lib/auth0";
import Terminal from "./terminal";
import Picker from "./picker";
import Chat from "./chat";
import { Challenge } from "~/lib/types";

export default async function App({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = +(await params).id;

  const session = await auth0.getSession();

  if (!session || !session.user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">You are not logged in.</p>
        <a href={"/"} className="btn btn-primary ml-4">
          Back
        </a>
      </div>
    );
  }

  // start the session here
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${session.user.sub}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Pinggy-No-Screen": "true",
      },
      body: JSON.stringify({ challenge_set_id: id }),
    }
  );

  if (resp.status === 400) {
    try {
      const data = await resp.json();

      if (!data["error"].includes("already exists")) {
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg text-red-500">
              {data.message || "Failed to start session."}
            </p>
            <a href={"/"} className="btn btn-primary ml-4">
              Back
            </a>
          </div>
        );
      }

      // this is fine
    } catch {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-lg text-red-500">Failed to start session.</p>
          <a href={"/"} className="btn btn-primary ml-4">
            Back
          </a>
        </div>
      );
    }
  }

  const challengesResp = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/challenges`,
    {
      headers: {
        "X-Pinggy-No-Screen": "true",
      },
    }
  );
  const challenges = (await challengesResp.json()) as Challenge[];

  return (
    <div className="w-full h-[94%] flex">
      <div className="w-lg flex flex-col h-full">
        <Picker challenges={challenges} selected={id} />
        <div className="border-1"></div>
        <Chat />
      </div>
      <div className="w-full h-full m-1 border-l-2">
        <Terminal challenge={challenges.find((ch) => ch.id === id)} />
      </div>
    </div>
  );
}
