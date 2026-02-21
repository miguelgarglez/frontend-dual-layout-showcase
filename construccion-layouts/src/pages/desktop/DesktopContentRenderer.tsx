import ContentHeader from '@pages/desktop/components/ContentHeader'
import { desktopContentPages, type DesktopContentPageKey } from './contentPages'

/**
 * Bridges the routing layer with the content page definition map and renders the appropriate view.
 */
const DesktopContentRenderer = ({ contentPageKey }: { contentPageKey: DesktopContentPageKey }) => {
  const contentPage = desktopContentPages[contentPageKey]
  const Content = contentPage.render

  return (
    <>
      <ContentHeader title={contentPage.title} />
      <Content />
    </>
  )
}

export default DesktopContentRenderer
