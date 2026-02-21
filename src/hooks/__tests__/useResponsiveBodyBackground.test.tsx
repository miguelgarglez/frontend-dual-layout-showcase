import { act, renderHook } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import useResponsiveBodyBackground, {
  RESPONSIVE_BODY_DEFAULT_CLASS,
  RESPONSIVE_BODY_GRADIENT_CLASS,
} from '../useResponsiveBodyBackground'

type IntersectionObserverCallbackParams = ConstructorParameters<typeof IntersectionObserver>[0]

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  private readonly callback: IntersectionObserverCallbackParams
  private readonly elements = new Set<Element>()

  constructor(callback: IntersectionObserverCallbackParams) {
    this.callback = callback
    mockObservers.add(this)
  }

  disconnect = vi.fn(() => {
    this.elements.clear()
  })

  observe = vi.fn((element: Element) => {
    this.elements.add(element)
  })

  takeRecords = vi.fn(() => [])

  unobserve = vi.fn((element: Element) => {
    this.elements.delete(element)
  })

  trigger(entryInit: Partial<IntersectionObserverEntry> = {}) {
    const [firstElement] = this.elements
    const target = entryInit.target ?? firstElement ?? document.createElement('div')
    const rect =
      entryInit.boundingClientRect ??
      (typeof target.getBoundingClientRect === 'function'
        ? target.getBoundingClientRect()
        : new DOMRect(0, 0, 0, 0))

    const entry: IntersectionObserverEntry = {
      boundingClientRect: rect,
      intersectionRatio: entryInit.intersectionRatio ?? 1,
      intersectionRect: rect,
      isIntersecting: entryInit.isIntersecting ?? true,
      rootBounds: null,
      target,
      time: 0,
    }

    this.callback([entry], this)
  }
}

const mockObservers = new Set<MockIntersectionObserver>()
const originalIntersectionObserver = globalThis.IntersectionObserver
const originalRequestAnimationFrame = globalThis.requestAnimationFrame

const createHeaderElement = () => {
  const element = document.createElement('div')
  element.getBoundingClientRect = () =>
    ({
      top: 0,
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => '',
    }) as DOMRect
  return element
}

describe('useResponsiveBodyBackground', () => {
  beforeAll(() => {
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0)
      return 0 as unknown as number
    }) as typeof requestAnimationFrame
  })

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
    globalThis.requestAnimationFrame = originalRequestAnimationFrame
  })

  beforeEach(() => {
    mockObservers.clear()
    document.body.className = ''
  })

  afterEach(() => {
    mockObservers.clear()
    document.body.className = ''
  })

  it('applies the gradient class while the header is visible', () => {
    const headerElement = createHeaderElement()
    const { result, unmount } = renderHook(() => useResponsiveBodyBackground())

    act(() => {
      result.current(headerElement)
    })

    expect(document.body.classList.contains(RESPONSIVE_BODY_GRADIENT_CLASS)).toBe(
      true,
    )
    expect(document.body.classList.contains(RESPONSIVE_BODY_DEFAULT_CLASS)).toBe(
      false,
    )
    unmount()
  })

  it('switches back to the default class when the header leaves the viewport', () => {
    const headerElement = createHeaderElement()
    const { result } = renderHook(() => useResponsiveBodyBackground())

    act(() => {
      result.current(headerElement)
    })

    const [observer] = mockObservers
    expect(observer).toBeDefined()

    act(() => {
      observer?.trigger({
        target: headerElement,
        intersectionRatio: 0,
        isIntersecting: false,
      })
    })

    expect(document.body.classList.contains(RESPONSIVE_BODY_GRADIENT_CLASS)).toBe(
      false,
    )
    expect(document.body.classList.contains(RESPONSIVE_BODY_DEFAULT_CLASS)).toBe(
      true,
    )
  })

  it('removes responsive classes on unmount', () => {
    document.body.classList.add('pre-existing-class')
    const headerElement = createHeaderElement()
    const { result, unmount } = renderHook(() => useResponsiveBodyBackground())

    act(() => {
      result.current(headerElement)
    })

    act(() => {
      unmount()
    })

    expect(
      document.body.classList.contains(RESPONSIVE_BODY_GRADIENT_CLASS),
    ).toBe(false)
    expect(
      document.body.classList.contains(RESPONSIVE_BODY_DEFAULT_CLASS),
    ).toBe(false)
    expect(document.body.classList.contains('pre-existing-class')).toBe(true)
  })
})
