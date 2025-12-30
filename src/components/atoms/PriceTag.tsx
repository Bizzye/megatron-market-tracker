import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function PriceTag({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
