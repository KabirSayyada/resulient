
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
import { ReferralStatusIndicator } from "@/components/referrals/ReferralStatusIndicator";

export function MainNavigation() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="w-full relative mb-6">
      {isMobile ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</div>
              <div className="flex items-center space-x-2">
                {user && <ReferralStatusIndicator />}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </div>
            </div>
            
            {menuOpen && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <nav className="grid grid-cols-1 gap-3">
                  <Link
                    to="/"
                    className="text-center py-3 px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Resume Builder
                  </Link>
                  <Link
                    to="/resume-scoring"
                    className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Resume Score
                  </Link>
                  <Link
                    to="/resume-optimization"
                    className="text-center py-3 px-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Resume Optimization
                  </Link>
                  <Link
                    to="/jobs"
                    className="text-center py-3 px-4 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Job Listings
                  </Link>
                  {!user && (
                    <Link
                      to="/auth"
                      className="text-center py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </nav>
                {user && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <UserMenu />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={navigationMenuTriggerStyle()}
                  >
                    Resume Builder
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
                    to="/resume-optimization"
                    className={navigationMenuTriggerStyle()}
                  >
                    Resume Optimization
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/jobs"
                    className={navigationMenuTriggerStyle()}
                  >
                    Job Listings
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {!user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/auth"
                      className={navigationMenuTriggerStyle()}
                    >
                      Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-4">
            {user && <ReferralStatusIndicator />}
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
          </div>
        </div>
      )}
    </div>
  )
}
