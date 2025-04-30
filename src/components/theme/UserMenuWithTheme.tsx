
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "./ThemeToggle";

export function UserMenuWithTheme() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <UserMenu />
    </div>
  );
}
