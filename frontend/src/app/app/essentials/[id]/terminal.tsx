"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { Fragment, useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { toast } from "sonner";
import { Challenge, SessionEntry } from "~/lib/types";

export default function Terminal({ challenge }: { challenge?: Challenge }) {
  const { user } = useUser();

  const [session, setSession] = useState<SessionEntry[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [commandBackIdx, setCommandBackIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !user.sub) {
      return;
    }
    // fetch session once
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`, {
      headers: {
        "X-Pinggy-No-Screen": "true",
      },
    })
      .then((resp) => resp.json())
      .then((data: { log: SessionEntry[]; correct: boolean }) => {
        console.log(data);

        if (!Array.isArray(data.log)) {
          console.error("Invalid session data received:", data);
          toast.error("Error loading session");
          setActive(false);
          setSession([]);
        }
        setActive(true);
        setSession(data.log);
      })
      .catch((err) => {
        toast.error("Failed to load session: " + err.message);
        setSession([]);
      });
  }, [setSession, user, user?.sub]);

  if (!(user && user.sub)) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">You are not logged in.</p>
      </div>
    );
  }

  if (!active || !challenge) {
    return (
      <div className="p-8">
        <div className="font-mono font-medium flex flex-col gap-1">
          <div className="mockup-code w-full text-lg">
            <h3 className="font-bold mb-4">
              Start a challege set to begin a session
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <label className="h-full block" htmlFor="cli">
      <div className="p-8">
        <div className="font-mono font-medium flex flex-col gap-1">
          <div className="mockup-code w-full text-lg">
            <details className="collapse border-base-300 border mb-4 -mt-8 bg-zinc-900">
              <summary className="collapse-title font-semibold">
                {challenge.name}
                {correct && (
                  <span className="badge badge-success ml-2">Completed</span>
                )}
                {loading ? (
                  <span className="float-right loading loading-bars loading-xl"></span>
                ) : (
                  <button
                    className="btn btn-error mb-4 float-right btn-sm"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`,
                          {
                            method: "DELETE",
                            headers: {
                              "X-Pinggy-No-Screen": "true",
                            },
                          }
                        );

                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-Pinggy-No-Screen": "true",
                            },
                            body: JSON.stringify({
                              challenge_set_id: challenge.id,
                            }),
                          }
                        );
                        setCorrect(false);
                      } finally {
                        setLoading(false);
                      }

                      setSession([]); // Clear the session state
                    }}
                  >
                    Reset Shell State
                  </button>
                )}
              </summary>
              <div className="collapse-content text-sm">
                {challenge.description}
              </div>
            </details>
            <div className="max-h-[50vh] lg:max-h-[60vh] xl:max-h-[70vh] overflow-y-auto">
              <ScrollableFeed forceScroll>
                {session.map((entry, index) => (
                  <Fragment key={index}>
                    <pre data-prefix="$" className="text-white text-wrap">
                      <code>{entry.cmd}</code>
                    </pre>
                    {entry.stdout && entry.stdout.trim() !== "" && (
                      <pre className="text-white/85 text-wrap no-before">
                        <code>{entry.stdout}</code>
                      </pre>
                    )}
                    {entry.stderr && entry.stderr.trim() !== "" && (
                      <pre className="text-red-400 text-wrap no-before">
                        <code className="indent-[0px] ">{entry.stderr}</code>
                      </pre>
                    )}
                  </Fragment>
                ))}
              </ScrollableFeed>
            </div>

            <pre data-prefix="$" className="text-white">
              <textarea
                id="cli"
                rows={1}
                className="mt-1 box-border w-[90%] flex-grow"
                spellCheck={false}
                onInput={(e) => {
                  const elem = e.target as HTMLTextAreaElement;
                  elem.style.height = "auto";
                  elem.style.height = elem.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key == "ArrowUp" && !e.shiftKey) {
                    e.preventDefault();

                    if (commandBackIdx < session.length) {
                      const command =
                        session[session.length - 1 - commandBackIdx].cmd;
                      (e.target as HTMLTextAreaElement).value = command;
                      setCommandBackIdx(commandBackIdx + 1);
                    }
                  } else if (e.key == "ArrowDown" && !e.shiftKey) {
                    e.preventDefault();

                    if (commandBackIdx > 1) {
                      setCommandBackIdx(commandBackIdx - 1);
                      const command =
                        session[session.length - commandBackIdx + 1].cmd;
                      (e.target as HTMLTextAreaElement).value = command || "";
                    } else {
                      setCommandBackIdx(0);
                      (e.target as HTMLTextAreaElement).value = "";
                    }
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${user.sub}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          "X-Pinggy-No-Screen": "true",
                        },
                        body: JSON.stringify({
                          command: (
                            e.target as HTMLTextAreaElement
                          ).value.trim(),
                        }),
                      }
                    )
                      .then((resp) => {
                        if (!resp.ok) {
                          throw new Error("Failed to send command");
                        }
                        return resp.json() as Promise<{
                          log: SessionEntry[];
                          correct: boolean;
                        }>;
                      })
                      .then((newData) => {
                        setSession(newData.log);
                        setCorrect(newData.correct);
                        (e.target as HTMLTextAreaElement).value = ""; // Clear input
                        (e.target as HTMLTextAreaElement).style.height = "auto"; // Reset height
                        setCommandBackIdx(0);
                      })
                      .catch((err) => {
                        toast.error("Failed to send command: " + err.message);
                        // Optionally, you can keep the input value if sending fails
                      });
                  }
                }}
              />
            </pre>
          </div>
        </div>
      </div>
    </label>
  );
}
