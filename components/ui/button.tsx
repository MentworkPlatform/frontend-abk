import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#F5C400] text-[#0A0A0A] font-bold hover:bg-[#e0b300] active:scale-[0.99] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        dark: 'bg-[#0A0A0A] text-white font-bold hover:bg-[#2B2B2B] active:scale-[0.99] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        pill: 'bg-[#F5C400] text-[#0A0A0A] font-bold hover:bg-[#e0b300] active:scale-[0.99] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        'pill-dark': 'bg-[#0A0A0A] text-white font-bold hover:bg-[#2B2B2B] active:scale-[0.99] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        'pill-outline': 'border border-[#D8D5CF] text-[#0A0A0A] font-bold hover:bg-[#F2F1EE] active:scale-[0.99] rounded-full',
        destructive:
          'bg-[#B0674A] text-white font-bold hover:bg-[#99583F] active:scale-[0.99] rounded-xl',
        outline:
          'border border-[#D8D5CF] bg-white text-[#0A0A0A] font-semibold hover:bg-[#F2F1EE] active:scale-[0.99] rounded-xl',
        secondary:
          'bg-[#F2F1EE] text-[#0A0A0A] font-semibold hover:bg-[#E7E5E1] active:scale-[0.99] rounded-xl',
        ghost: 'hover:bg-[#F2F1EE] text-[#0A0A0A] font-semibold rounded-xl',
        link: 'text-[#0A0A0A] font-semibold underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
