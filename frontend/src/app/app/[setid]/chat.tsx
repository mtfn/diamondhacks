"use client";

import avatarImage from "./avatar.png";
import { useUser } from "@auth0/nextjs-auth0";

export default function Chat() {
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
  return (
    <div className="h-full m-1">
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="AI chat bubble" src={avatarImage.src} />
          </div>
        </div>
        <div className="chat-bubble">
          whats up chsdflkajsdlfjasldfj alsdkfjlaskjdflajsdf
          lajsdfljasdflalsdkjf asdlfkjalsdf alsdkjf;lasdkjf
          as;dlfkja;sldfjalsdkjf elkj falskdjf lakewj flkasjd flkasj flkej
          alksdj flkej alksj dlfkjelka jsldkfja kejf eiu urieoaroiwerj at
        </div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="User chat bubble" src={user.picture} />
          </div>
        </div>
        <div className="chat-bubble chat-bubble-info">Calm down, Anakin.</div>
      </div>
    </div>
  );
}
