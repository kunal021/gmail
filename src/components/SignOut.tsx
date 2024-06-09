import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { publicRoutes } from "@/routes";
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: publicRoutes });
      }}
    >
      <Button className="text-xs md:text-base" type="submit">
        Sign Out
      </Button>
    </form>
  );
}
