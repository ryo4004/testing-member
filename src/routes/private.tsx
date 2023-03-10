import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Audio, Video } from '../features/media'
import { FullScreenLoading } from '../components/ContentsBox'
import { ArchiveRoutes } from '../features/archive'
import { Home } from '../features/home'
import { PracticeRoutes } from '../features/practice'
import { PhotoModal } from '../features/archive/components/PhotoModal'
import { ScoreRoutes } from '../features/score'
import { ScoreModal } from '../features/score/components/ScoreModal'
import { ScoreEditModal } from '../features/score/components/ScoreEditModal'
import { ScoreBoxModal } from '../features/score/components/BoxModal'
import { SettingRoutes } from '../features/setting'
import { ManagerRoutes } from '../features/manager'
import { BBSRoutes } from '../features/bbs'
import { Tutorial } from '../features/tutorial'

const App = () => {
  return (
    <Suspense fallback={<FullScreenLoading />}>
      <Outlet />
      <Audio />
      <Video />
      <PhotoModal />
      <ScoreModal />
      <ScoreEditModal />
      <ScoreBoxModal />
      <Tutorial />
    </Suspense>
  )
}

export const privateRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/practice/*', element: <PracticeRoutes /> },
      { path: '/manager/*', element: <ManagerRoutes /> },
      { path: '/bbs/*', element: <BBSRoutes /> },
      { path: '/archive/*', element: <ArchiveRoutes /> },
      { path: '/score/*', element: <ScoreRoutes /> },
      { path: '/setting/*', element: <SettingRoutes /> },
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]
