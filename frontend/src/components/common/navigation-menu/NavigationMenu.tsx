import React from 'react';

interface NavigationMenuProps {
    children: React.ReactNode;
}

export function NavigationMenu({ children }: NavigationMenuProps) {
    return (
        <nav className="relative">
            {children}
        </nav>
    );
}

export function NavigationMenuList({ children }: { children: React.ReactNode }) {
    return (
        <ul className="flex gap-2 items-center">
            {children}
        </ul>
    );
}

export function NavigationMenuItem({ children }: { children: React.ReactNode }) {
    return (
        <li>
            {children}
        </li>
    );
}

export function NavigationMenuLink({ children }: { children: React.ReactNode }) {
    return (
        <div className="block select-none space-y-1 rounded-md leading-none no-underline outline-none">
            {children}
        </div>
    );
}