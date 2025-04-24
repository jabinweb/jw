import { cn } from '@/lib/utils';

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 1 },
  gap = '2rem',
  className,
  ...props
}: ResponsiveGridProps) {
  const getGridCols = () => {
    const { default: defaultCols, sm, md, lg } = cols;
    return cn(
      `grid-cols-${defaultCols}`,
      sm && `sm:grid-cols-${sm}`,
      md && `md:grid-cols-${md}`,
      lg && `lg:grid-cols-${lg}`
    );
  };

  return (
    <div
      className={cn(
        'grid',
        getGridCols(),
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}