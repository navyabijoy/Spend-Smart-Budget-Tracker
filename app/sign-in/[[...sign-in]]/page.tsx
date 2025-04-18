"use client";

import { SignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <SignIn fallbackRedirectUrl={'/dashboard'} />
    </div>
  );
}