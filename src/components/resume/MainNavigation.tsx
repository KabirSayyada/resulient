
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

export function MainNavigation() {
  const { user } = useAuth();

  return (
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
              to="/pricing"
              className={navigationMenuTriggerStyle()}
            >
              Pricing
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
  )
}
