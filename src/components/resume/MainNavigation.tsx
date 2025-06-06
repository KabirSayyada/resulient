import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MainNavigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Resume Scoring", path: "/resume-scoring" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Referrals", path: "/referrals" },
    { name: "Blog", path: "/blog" },
    { name: "Pricing", path: "/pricing" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl">
          Resulient
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 ${
                isActive(item.path) ? "font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the application.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 ${
                    isActive(item.path) ? "font-semibold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url as string}
                    />
                    <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user?.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
