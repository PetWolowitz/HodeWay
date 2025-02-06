import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'brutal'; // Aggiungi 'brutal'
    size?: 'default' | 'sm';
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
        // Definisci le classi in base alla variante
        const variantClasses = {
            default: '',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            brutal:
                "px-8 py-0.5 border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    variantClasses[variant],
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
