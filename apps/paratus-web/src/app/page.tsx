"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa6";

import { authClient } from "~/auth/client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    console.log({ session, isPending });
  }, [session, isPending]);
  if (session) {
    redirect("/inbox");
  } else {
    return <LoginPage />;
  }
}

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="bg-foreground w-full max-w-sm rounded p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Sign in to Paratus
        </h1>
        <button
          className="mb-4 flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => authClient.signIn.social({ provider: "google" })}
        >
          <FaGoogle />
          Sign in with Google
        </button>
        <button
          className="mb-4 flex w-full items-center justify-center gap-2 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
          onClick={() => authClient.signIn.social({ provider: "github" })}
        >
          <FaGithub />
          Sign in with GitHub
        </button>
        {/* <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </div> */}
      </div>
    </div>
  );
};
