import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Condenses conditional className logic while letting Tailwind keep the last word
 * when utilities collide (e.g. `px-4` vs `px-6`).
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
