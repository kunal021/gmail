import ApiKeyInput from "@/components/ApiKeyInput";
import { SignIn } from "@/components/SignIn";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col space-y-10 justify-center items-center min-h-screen">
      <SignIn />
      <ApiKeyInput />
      <Link href={"/getkey"} className="underline text-blue-900 font-semibold">
        GET GEMINI API KEY?
      </Link>
    </div>
  );
}
