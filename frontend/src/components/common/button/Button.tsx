// src/components/common/button/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';  // dovremo creare questa utility

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost';
    size?: 'default' | 'sm';
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
                    size === 'default' && 'h-10 px-4 py-2',
                    size === 'sm' && 'h-9 rounded-md px-3',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';