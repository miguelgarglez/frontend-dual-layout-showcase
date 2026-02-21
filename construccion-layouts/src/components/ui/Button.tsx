import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@lib/utils/cn'

const buttonVariants = cva(
  'pressable focus-outline-brand inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-professional-100 text-white hover:bg-professional-100/90 disabled:bg-professional-100/60',
        secondary:
          'border border-pinned-greyscale-140 bg-white text-pinned-greyscale-140 hover:bg-greyscale-40',
        primaryClient:
          'bg-client-100 text-basic-white hover:bg-client-100/90 disabled:bg-client-100/60',
        secondaryClient:
          'border border-greyscale-80 bg-basic-white text-greyscale-140 hover:border-greyscale-100 hover:bg-basic-white',
        ghost: 'text-pinned-greyscale-140 hover:bg-greyscale-40',
        link: 'bg-transparent underline underline-offset-4 shadow-none',
      },
      size: {
        sm: 'rounded-xl px-4 py-2.5 text-sm',
        md: 'rounded-lg px-6 py-3 text-base',
        inline: 'rounded-md px-0 py-0 text-base leading-normal',
      },
      linkTone: {
        professional: '',
        navy: '',
      },
    },
    compoundVariants: [
      {
        variant: 'link',
        linkTone: 'professional',
        class: 'text-professional-100 hover:text-professional-100/80',
      },
      {
        variant: 'link',
        linkTone: 'navy',
        class: 'text-pinned-navy hover:text-pinned-navy/80',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      linkTone: 'professional',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonProps = ButtonVariants & {
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      linkTone,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      // Passing className lets sections handle bespoke layouts (icon spacing, custom rounding)
      className={cn(
        buttonVariants({
          variant,
          size: size ?? (variant === 'link' ? 'inline' : undefined),
          linkTone,
        }),
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export default Button
