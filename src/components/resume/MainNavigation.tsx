
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/auth/UserMenu";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainNavigation() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="w-full relative py-4">
      {isMobile ? (
        <div className="px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="font-bold text-xl text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text">Resulient</Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="p-1"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          
          {menuOpen && (
            <div className="absolute top-full left-0 right-0 bg-background z-50 shadow-lg py-2 px-4 border-b">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/resume-scoring"
                  className="py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Resume Score
                </Link>
                <Link
                  to="/industry-leaderboard"
                  className="py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/subscription"
                  className="py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Subscription
                </Link>
                <Link
                  to="/blog"
                  className="py-2 font-medium text-primary hover:text-primary/90"
                  onClick={() => setMenuOpen(false)}
                >
                  Blog
                </Link>
                {!user && (
                  <Link
                    to="/auth"
                    className="py-2 hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
              {user && (
                <div className="mt-4 pt-4 border-t">
                  <UserMenu />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/resume-scoring"
                  className={navigationMenuTriggerStyle()}
                >
                  Resume Score
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/industry-leaderboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Leaderboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/subscription"
                  className={navigationMenuTriggerStyle()}
                >
                  Subscription
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/blog"
                  className={`${navigationMenuTriggerStyle()} font-medium text-primary hover:text-primary/90`}
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <NavigationMenuContent>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
          {user ? (
            <UserMenu />
          ) : (
            <NavigationMenuLink asChild>
              <Link
                to="/auth"
                className={navigationMenuTriggerStyle()}
              >
                Sign In
              </Link>
            </NavigationMenuLink>
          )}
        </NavigationMenu>
      )}
    </div>
  )
}
