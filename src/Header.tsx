import { Cog6ToothIcon } from "@heroicons/react/24/outline";

function Header() {
  return (
    <header className="top-0 p-4 mb-5 border-b">
      <nav className="container flex justify-between">
        <h1 className="text-2xl font-bold">Video Downloader</h1>
        <div className="flex items-center">
          <Cog6ToothIcon className="h-6 w-6 hover:stroke-2 hover:cursor-pointer" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
