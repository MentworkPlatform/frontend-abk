import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#F5C400] text-[#0A0A0A] font-bold',
        secondary:
          'border-transparent bg-[#F2F1EE] text-[#2B2B2B] font-semibold',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground font-semibold',
        outline: 'border-[#D8D5CF] text-[#0A0A0A] font-semibold',
        sage: 'border-transparent bg-[#5B7B6E] text-white font-bold',
        'sage-subtle': 'border-transparent bg-[rgba(91,123,110,0.15)] text-[#3F5750] font-bold',
        rust: 'border-transparent bg-[#B0674A] text-white font-bold',
        'rust-subtle': 'border-transparent bg-[rgba(176,103,74,0.15)] text-[#8A5642] font-bold',
        slate: 'border-transparent bg-[#6E7BA8] text-white font-bold',
        'slate-subtle': 'border-transparent bg-[#EBEDF5] text-[#6E7BA8] font-bold',
        yellow: 'border-transparent bg-[#F5C400] text-[#0A0A0A] font-bold',
        black: 'border-transparent bg-[#0A0A0A] text-white font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
