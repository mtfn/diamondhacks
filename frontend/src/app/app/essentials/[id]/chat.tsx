"use client";

import { ChatEntry } from "~/lib/types";
import avatarImage from "./avatar.png";
import { useUser } from "@auth0/nextjs-auth0";
import { Fragment, useState } from "react";
import Emoji from "react-emoji-render";
import ScrollableFeed from "react-scrollable-feed";

export default function Chat() {
  const { user } = useUser();

  const [messages, setMessages] = useState<ChatEntry[]>([]);

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
        <form
        className="pb-4 px-4"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements[0] as HTMLInputElement;
            const newMessage = input.value.trim();
            if (newMessage) {
              alert("Message sent: " + newMessage);
            }
          
            e.currentTarget.reset();
          }}
        >
          <input
            className="input input-bordered w-full mt-4"
            type="text"
            placeholder="Type your message here..."
          />
        </form>
      </ScrollableFeed>
    </div>
  );
}
