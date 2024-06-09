import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT });
      }}
    >
      <Button type="submit">Continue with Google</Button>
    </form>
  );
}
