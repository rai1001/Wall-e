interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-soft p-6 border border-stone-100 ${className}`}
        >
            {children}
        </div>
    );
}
