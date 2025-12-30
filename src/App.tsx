import {
  NavLink,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'upload', element: <UploadPage /> },
    ],
  },
]);

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-lg font-semibold text-primary">Megatron Pricing</p>
          <nav className="flex gap-4 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
              end
            >
              Painel
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Upload
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
