import ApiKeyInput from "@/components/ApiKeyInput";
import { SignIn } from "@/components/SignIn";

export default function Home() {
  return (
    <div className="flex flex-col space-y-10 justify-center items-center min-h-screen">
      <SignIn />
      <ApiKeyInput />
    </div>
  );
}
