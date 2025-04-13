"use client";

export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow-md w-full p-2 flex justify-between items-center fixed top-0 left-0 z-10">
      <div className="flex justify-center w-full absolute left-0 right-0">        
        <img src="/images/logo.webp" alt="Logo" className="h-8 w-auto" />
      </div>
    </header>
  );
}
