"use client";

import { useUser } from "@auth0/nextjs-auth0";

export default function Topbar() {
  const { user, isLoading } = useUser();

  console.log(user)

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">CLASH</a>
      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          {!isLoading && user === null ? (
            <a href="/auth/login" className="btn btn-primary">
              Log in
            </a>
          ) : isLoading || user?.picture === undefined ? (
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar avatar-placeholder"
            >
              <div className="w-10 rounded-full">
                <span>?</span>
              </div>
            </div>
          ) : (
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User pic" src={user.picture} />
              </div>
            </div>
          )}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 z-20 rounded-box p-2 mt-3 w-52 shadow"
          >
            <li>
              <a href="/auth/logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
