import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Popover from '../Popover'

const noop = () => {}

describe('Popover body scroll lock', () => {
  // Covered at component level to validate the real stacking scenario; the hook
  // could also be tested in isolation if another consumer appears, just like we did with useFocusTrap.
  afterEach(() => {
    // Ensure tests don't leak styling assertions across cases.
    document.body.style.overflow = ''
  })

  it('restores the previous overflow value when toggled', () => {
    document.body.style.overflow = 'scroll'
    const { rerender, unmount } = render(
      <Popover open onClose={noop} labelledBy="dialog-1">
        <div>Content</div>
      </Popover>,
    )

    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <Popover open={false} onClose={noop} labelledBy="dialog-1">
        <div>Content</div>
      </Popover>,
    )

    expect(document.body.style.overflow).toBe('scroll')
    unmount()
  })

  it('keeps the body locked while any popover remains open', () => {
    const Controlled = ({
      firstOpen,
      secondOpen,
    }: {
      firstOpen: boolean
      secondOpen: boolean
    }) => (
      <>
        <Popover open={firstOpen} onClose={noop} labelledBy="dialog-1">
          <div>First</div>
        </Popover>
        <Popover open={secondOpen} onClose={noop} labelledBy="dialog-2">
          <div>Second</div>
        </Popover>
      </>
    )

    const { rerender, unmount } = render(
      <Controlled firstOpen={true} secondOpen={true} />,
    )

    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Controlled firstOpen={false} secondOpen={true} />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Controlled firstOpen={false} secondOpen={false} />)
    expect(document.body.style.overflow).toBe('')

    unmount()
  })
})
