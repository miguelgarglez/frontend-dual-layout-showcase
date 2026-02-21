import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useState,
} from 'react'
import { cn } from '@lib/utils/cn'

type FallbackImageProps<T extends ElementType = 'figure'> = {
  as?: T
  src?: string
  alt: string
  fallbackContent?: ReactNode
  className?: string
  imageClassName?: string
  fallbackClassName?: string
  loading?: 'lazy' | 'eager'
  disableImageDrag?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') ||
  '—'

/**
 * Generic image wrapper that renders a fallback when the remote source fails or is missing.
 * It works with any wrapper element (figure, div, button, etc.) and keeps styling flexible via class overrides.
 * Designed for avatars, cards, and grids where sizes/aspect ratios differ but the fallback behavior must be consistent.
 */
const FallbackImage = <T extends ElementType = 'figure'>(
  {
    as,
    src,
    alt,
    fallbackContent,
    className,
    imageClassName,
    fallbackClassName,
    loading = 'lazy',
    disableImageDrag = true,
    ...rest
  }: FallbackImageProps<T>,
) => {
  const Component = (as ?? 'figure') as ElementType
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const shouldShowFallback = !src || failedSrc === src

  return (
    <Component
      className={cn(
        'relative overflow-hidden bg-slate-100 text-slate-600',
        className,
      )}
      {...rest}
    >
      {shouldShowFallback ? (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-wide',
            fallbackClassName,
          )}
          role="img"
          aria-label={alt}
        >
          {fallbackContent ?? getInitials(alt)}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailedSrc(src ?? null)}
          draggable={disableImageDrag ? false : undefined}
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      )}
    </Component>
  )
}

export default FallbackImage
