
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 justify-end">
      <User2 className="text-primary" />
      <span className="font-medium text-gray-700">{user.email}</span>
      <Button variant="outline" size="sm" onClick={signOut}>
        <LogOut className="mr-1" /> Logout
      </Button>
    </div>
  );
}
