import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Map, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from "@/components/common/navigation-menu";
import { Button } from "@/components/common/button";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full h-full border-b bg-[linear-gradient(to_top,#fef3c7,#fdd888,#c47f3d)] shadow-lg">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'default' : 'brutal'}
                  className="flex items-center gap-2 "
                >
                  <img src="/images/logoHome.svg" alt="LogoHome" className='w-5 h-5 mr-2' />
                  <span className='text-sm md:text-lg'>Home</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/trips">
                <Button
                  variant={isActive('/trips') ? 'default' : 'brutal'}
                  className="flex items-center gap-2"
                >
                  <img src="/images/trips.svg" alt="logoMappa"  className='w-7 h-7 mr-2'/>
                  <span className='text-sm md:text-lg'>My Trips</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <Button
                  variant={isActive('/about') ? 'default' : 'brutal'}
                  className="flex items-center"
                >
                  <img src="/images/aboutUs.svg" alt="" className='w-7 h-7 mr-3' />
                  <span className='text-sm md:text-lg'>About</span>
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.full_name || user?.email}
          </span>
          <Button
            variant="brutal"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleSignOut}
          >
            <img src="/images/logout.svg" alt="logoLogout" className='w-7 h-7 ' />
            <span className='text-sm md:text-lg'>Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}