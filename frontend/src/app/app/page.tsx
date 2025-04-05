export default function App() {
  return <div className="w-full h-full flex">
    <div className="w-lg flex flex-col h-full">

      <nav className="h-full m-1">
        <li className="p-4 space-y-2">
          <ul className="p-2 border-3 rounded-lg text-lg border-cyan-600">
            First option
          </ul>
          <ul className="p-2 border-3 rounded-lg text-lg">
            Second Option
          </ul>
        </li>
      </nav>
      <div className="border-1"></div>
      <div className="h-full m-1">
        chat
      </div>
    </div>
    <div className="w-full m-1 border-l-2">
      <div className="p-8">
        <div className="font-mono font-medium">
          This is mono terminal text
        </div>
      </div>
    </div>
  </div>;
}