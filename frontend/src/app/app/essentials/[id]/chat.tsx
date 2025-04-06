"use client";

import { ChatEntry } from "~/lib/types";
import avatarImage from "./avatar.png";
import { useUser } from "@auth0/nextjs-auth0";
import { Fragment, useEffect, useState } from "react";
import Emoji from "react-emoji-render";
import ScrollableFeed from "react-scrollable-feed";
import { toast } from "sonner";

async function getMessages(sub: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assistant/${sub}`,
    {
      headers: {
        "X-Pinggy-No-Screen": "true",
      },
    }
  );
  return toMessages(await res.json()) as ChatEntry[];
}

interface ChatEntryResp {
  user: "user" | "assistant";
  message: string;
}

function toMessages(entries: ChatEntryResp[]): ChatEntry[] {
  return entries.map((entry) => {
    try {
      console.log(entry.message);
      const data = JSON.parse(entry.message);
      console.log(data);
      return {
        role: entry.user,
        message: data["feedback"],
        emoji: data["emoji"] || undefined,
      };
    } catch {
      return {
        role: entry.user,
        message: entry.message, // Fallback to raw message if parsing fails
        emoji: undefined,
      };
    }
  });
}
export default function Chat() {
  const { user } = useUser();

  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [inProgressMessage, setInProgressMessage] = useState<string>("");
  const [v, setV] = useState<string>("");

  useEffect(() => {
    if (!user || !user.sub) {
      return;
    }
    const timer = setInterval(() => {
      getMessages(user.sub)
        .then(setMessages)
        .catch((err) => {
          toast.error("Failed to load messages: " + err.message);
        });
    }, 5000);
    return () => clearInterval(timer);
  }, [user]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[60vh] overflow-y-auto m-1">
      <ScrollableFeed forceScroll>
        {messages.map((entry, index) => (
          <Fragment key={index}>
            {entry.role === "assistant" ? (
              <div className="chat chat-start" key={index}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img alt="AI chat bubble" src={avatarImage.src} />
                  </div>
                </div>
                <div className="chat-bubble">
                  {entry.message}
                  {entry.emoji && <Emoji className="ps-4" text={entry.emoji} />}
                </div>
              </div>
            ) : (
              <div className="chat chat-end" key={index}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img alt="User chat bubble" src={user.picture} />
                  </div>
                </div>
                <div className="chat-bubble chat-bubble-info">
                  {entry.message}
                </div>
              </div>
            )}
          </Fragment>
        ))}
        {inProgressMessage !== "" && (
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="User chat bubble" src={user.picture} />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-info animate-pulse">
              {inProgressMessage}
            </div>
          </div>
        )}
        <form
          className="pb-4 px-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const newMessage = v.trim();
            if (newMessage) {
              setInProgressMessage(newMessage);
              setV("");
              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/assistant/${user.sub}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Pinggy-No-Screen": "true",
                    },
                    body: JSON.stringify({ message: newMessage }),
                  }
                );
                setInProgressMessage("");
                if (!res.ok) {
                  toast.error("Failed to send message. Please try again.");
                  return;
                }

                const json = await res.json();
                setMessages(toMessages(json));
              } catch (err) {
                setInProgressMessage("");
                toast.error(
                  "Failed to send message: " + (err as Error).message
                );
              }
            }
          }}
        >
          <input
            className="input input-bordered w-full mt-4"
            type="text"
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="Ask for help here..."
          />
        </form>
      </ScrollableFeed>
    </div>
  );
}
