import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@lib/utils/cn'

type BaseSegmentedOption<Value extends string> = {
  value: Value
  tabId: string
  panelId: string
}

type SegmentedRenderState = {
  isSelected: boolean
  isFocused: boolean
}

const segmentedControlVariants = cva('', {
  variants: {
    variant: {
      pill: 'grid grid-cols-2 gap-1',
      frequency: 'bg-greyscale-20 flex rounded-[80px]',
    },
  },
  defaultVariants: {
    variant: 'pill',
  },
})

const segmentedOptionVariants = cva('pressable focus-outline-brand transition', {
  variants: {
    variant: {
      pill: 'rounded-full px-4 py-2 text-sm font-semibold',
      frequency:
        'text-greyscale-140 flex w-full flex-col items-center rounded-[64px] border px-4 py-3 text-center',
    },
  },
  defaultVariants: {
    variant: 'pill',
  },
})

type SegmentedControlVariant = NonNullable<
  VariantProps<typeof segmentedControlVariants>['variant']
>

const segmentedOptionStateClasses: Record<
  SegmentedControlVariant,
  { selected: string; unselected: string }
> = {
  pill: {
    selected: 'bg-basic-white text-greyscale-140 shadow-(--shadow-positive-1)',
    unselected: 'text-greyscale-110',
  },
  frequency: {
    selected: 'border-client-100 bg-client-40 text-greyscale-140',
    unselected:
      'border-transparent bg-transparent hover:bg-basic-white/60 text-greyscale-140',
  },
}

type SegmentedControlProps<
  Value extends string,
  Option extends BaseSegmentedOption<Value>,
> = VariantProps<typeof segmentedControlVariants> & {
  ariaLabel: string
  value: Value
  options: Option[]
  onChange: (value: Value) => void
  className?: string
  optionClassName?: string
  getOptionClassName?: (option: Option, state: SegmentedRenderState) => string
  renderOptionContent?: (
    option: Option,
    state: SegmentedRenderState,
  ) => ReactNode
}

const SegmentedControl = <
  Value extends string,
  Option extends BaseSegmentedOption<Value>,
>({
  ariaLabel,
  value,
  options,
  onChange,
  className,
  optionClassName,
  getOptionClassName,
  renderOptionContent,
  variant,
}: SegmentedControlProps<Value, Option>) => {
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const [focusedValue, setFocusedValue] = useState<Value>(value)
  const resolvedVariant: SegmentedControlVariant = variant ?? 'pill'
  const optionStateClasses = segmentedOptionStateClasses[resolvedVariant]

  useEffect(() => {
    setFocusedValue(value)
  }, [value])

  useEffect(() => {
    if (!options.some((option) => option.value === focusedValue)) {
      setFocusedValue(value)
    }
  }, [focusedValue, options, value])

  const optionsCount = options.length
  const effectiveFocusedValue = useMemo(() => {
    return options.some((option) => option.value === focusedValue)
      ? focusedValue
      : value
  }, [focusedValue, options, value])

  const focusTab = useCallback((index: number) => {
    const node = tabsRef.current[index]
    node?.focus()
  }, [])

  const moveFocus = useCallback(
    (nextIndex: number) => {
      const next = options[nextIndex]
      if (!next) {
        return
      }
      setFocusedValue(next.value)
      focusTab(nextIndex)
    },
    [focusTab, options],
  )

  const selectOption = useCallback(
    (index: number) => {
      const next = options[index]
      if (next) {
        onChange(next.value)
      }
    },
    [onChange, options],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      if (!optionsCount) {
        return
      }

      const lastIndex = optionsCount - 1

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          event.preventDefault()
          moveFocus((currentIndex + 1) % optionsCount)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          event.preventDefault()
          moveFocus((currentIndex - 1 + optionsCount) % optionsCount)
          break
        }
        case 'Home': {
          event.preventDefault()
          moveFocus(0)
          break
        }
        case 'End': {
          event.preventDefault()
          moveFocus(lastIndex)
          break
        }
        case ' ':
        case 'Enter': {
          event.preventDefault()
          selectOption(currentIndex)
          break
        }
        default:
          break
      }
    },
    [moveFocus, optionsCount, selectOption],
  )

  if (!optionsCount) {
    return null
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        segmentedControlVariants({
          variant: resolvedVariant,
        }),
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value
        const isFocused = option.value === effectiveFocusedValue

        return (
          <button
            key={option.value}
            ref={(node) => {
              tabsRef.current[index] = node
            }}
            id={option.tabId}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={option.panelId}
            tabIndex={isFocused ? 0 : -1}
            onClick={() => {
              setFocusedValue(option.value)
              onChange(option.value)
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onFocus={() => setFocusedValue(option.value)}
            className={cn(
              segmentedOptionVariants({ variant: resolvedVariant }),
              isSelected ? optionStateClasses.selected : optionStateClasses.unselected,
              optionClassName,
              getOptionClassName?.(option, { isFocused, isSelected }),
            )}
          >
            {renderOptionContent?.(option, { isFocused, isSelected }) ??
              option.value}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
