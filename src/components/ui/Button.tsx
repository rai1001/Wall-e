import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
    const baseStyles = "font-bold transition-all duration-300 rounded-full flex items-center justify-center gap-2 active:scale-95 tracking-wide";

    const variants = {
        primary: "bg-terracotta text-cream shadow-soft hover:bg-accent hover:-translate-y-0.5",
        secondary: "bg-cream text-main border border-main/10 shadow-soft hover:bg-main/5",
        ghost: "bg-transparent text-main hover:text-terracotta hover:bg-terracotta/10"
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        />
    );
}
