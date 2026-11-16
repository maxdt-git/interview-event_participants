import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import EventsPage from './pages/EventsPage'
import EventPage from './pages/EventPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <EventsPage /> },
      { path: 'events/:eventId', element: <EventPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
