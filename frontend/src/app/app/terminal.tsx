"use client";

import { Fragment } from "react";
import { Challenge, SessionEntry } from "~/lib/types";

export default function Terminal({
  challenge,
  session,
}: {
  challenge: Challenge;
  session: SessionEntry[];
}) {
  return (
    <label className="h-full block">
      <div className="p-8">
        <div className="font-mono font-medium flex flex-col gap-1">
          <div className="mockup-code w-full text-lg">
            <details className="collapse border-base-300 border mb-4 -mt-8 bg-zinc-900">
              <summary className="collapse-title font-semibold">
                {challenge.name}
              </summary>
              <div className="collapse-content text-sm">{challenge.desc}</div>
            </details>
            {session.map((entry, index) => (
              <Fragment key={index}>
                <pre data-prefix="$" className="text-white text-wrap">
                  <code>{entry.cmd}</code>
                </pre>
                {entry.stdout && entry.stdout.trim() !== "" && (
                  <pre data-prefix="" className="text-white/85 text-wrap">
                    <code>{entry.stdout}</code>
                  </pre>
                )}
                {entry.stderr && entry.stderr.trim() !== "" && (
                  <pre data-prefix="" className="text-red-400 text-wrap">
                    <code>{entry.stderr}</code>
                  </pre>
                )}
              </Fragment>
            ))}

            <pre data-prefix="$" className="text-white">
              <textarea
                rows={1}
                className="mt-1 box-border w-[90%] flex-grow"
                spellCheck={false}
                onInput={(e) => {
                  const elem = e.target as HTMLTextAreaElement;
                  elem.style.height = "auto";
                  elem.style.height = elem.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    alert((e.target as HTMLTextAreaElement).value);
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
