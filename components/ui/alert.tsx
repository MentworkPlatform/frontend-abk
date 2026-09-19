import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4.5 [&>svg]:h-4 [&>svg]:w-4',
  {
    variants: {
      variant: {
        default: 'bg-[#F2F1EE] border-[#E7E5E1] text-[#0A0A0A] [&>svg]:text-[#0A0A0A]',
        destructive:
          'bg-[#FDF2F0] border-[#B0674A]/30 text-[#8A5642] [&>svg]:text-[#B0674A]',
        success:
          'bg-[#F0F5F3] border-[#5B7B6E]/30 text-[#3F5750] [&>svg]:text-[#5B7B6E]',
        warning:
          'bg-[#FFF9E6] border-[#F5C400]/50 text-[#0A0A0A] [&>svg]:text-[#0A0A0A]',
        info:
          'bg-[#F0F3F8] border-[#6E7BA8]/30 text-[#4E5A80] [&>svg]:text-[#6E7BA8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
