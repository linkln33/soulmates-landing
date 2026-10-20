/**
 * shadcn/ui Button (new-york), adapted to the site: pill shape, 48 px touch
 * height, the site's raspberry action colour and glass secondary, and the
 * site's own focus outline (globals.css `:focus-visible`) kept pill-shaped.
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import './ui.css';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap no-underline transition-[background-color,box-shadow,transform] duration-150 focus-visible:rounded-full active:scale-[.98] disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-[var(--action-hover)]',
        glass:
          'bg-[var(--glass-bg)] text-foreground shadow-[var(--btn3d-glass-rest)] backdrop-blur-[var(--glass-blur)] hover:shadow-[var(--btn3d-glass-lift)]',
        ghost: 'bg-transparent text-[var(--teal-text)] hover:bg-accent',
        link: 'h-auto px-0 text-[var(--pink-text)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-12 px-[22px] text-base',
        sm: 'min-h-10 px-4 text-[15px]',
        lg: 'min-h-[52px] px-[26px] text-base',
        icon: 'size-12',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'default'}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
