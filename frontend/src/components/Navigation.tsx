import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from './ui/navigation-menu';
import { Button } from './ui/button';

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <Button
                  variant={isActive('/about') ? 'default' : 'ghost'}
                  className="flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.full_name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant={isActive('/auth') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign in</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}