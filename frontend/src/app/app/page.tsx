import { auth0 } from "~/lib/auth0";
import Terminal from "./terminal";
import avatarImage from "./avatar.png";

export default async function App() {
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

  return (
    <div className="w-full h-full flex">
      <div className="w-lg flex flex-col h-full">
        <nav className="h-full m-1">
          <li className="p-4 space-y-2">
            <ul className="join-item p-2 btn btn-outline w-full btn-info">
              First option
            </ul>
            <ul className="p-2 btn btn-outline w-full">Second Option</ul>
          </li>
        </nav>
        <div className="border-1"></div>
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
                <img alt="User chat bubble" src={session.user.picture} />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-info">
              Calm down, Anakin.
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full m-1 border-l-2">
        <Terminal
          challenge={{ name: "test", desc: "test", id: 1 }}
          session={[
            { cmd: "pwd", stderr: "", stdout: "/root" },
            {
              cmd: "alskdjflkasjefljaelkfjalsdkfj aleskfjlasekjf asdflkjaelfjalsjdflekajsfd",
              stdout:
                "asdlfkjasldfk lkjasdflkjasdf lakjsdflkjasdflk lakwejflkjasdlfasdlfkjasldfk lkjasdflkjasdf lakjsdflkjasdflk lakwejflkjasdlfasdlfkjasldfk lkjasdflkjasdf lakjsdflkjasdflk lakwejflkjasdlf   asdlfkjasldfk lkjasdflkjasdf lakjsdflkjasdflk lakwejflkjasdlf ",
              stderr: "asdkfjalsdkjf elkajsdfl asdlkfjelk sdlkfjslkejf",
            },
          ]}
        />
      </div>
    </div>
  );
}
