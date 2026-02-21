import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DesktopLayout from '@pages/desktop/DesktopLayout'
import ResponsiveLayout from '@pages/responsive/ResponsiveLayout'
import Home from '@pages/Home'
import DesktopContentRenderer from '@pages/desktop/DesktopContentRenderer'
import { desktopContentPages, type DesktopContentPageKey } from '@pages/desktop/contentPages'

const desktopContentPageKeys = Object.keys(desktopContentPages) as DesktopContentPageKey[]
const routerBasename = import.meta.env.BASE_URL

const App = () => {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/desktop" element={<DesktopLayout />}>
          <Route index element={<Navigate to="anuncios" replace />} />
          {desktopContentPageKeys.map((key) => (
            <Route key={key} path={key} element={<DesktopContentRenderer contentPageKey={key} />} />
          ))}
        </Route>
        <Route path="/responsive" element={<ResponsiveLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
