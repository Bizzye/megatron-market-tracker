import {
  NavLink,
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { PurchasePage } from './pages/PurchasePage';
import { ProductPage } from './pages/ProductPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <RootLayout />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'nova-compra', element: <UploadPage /> },
      { path: 'compras/:id', element: <PurchasePage /> },
      { path: 'produtos/:id', element: <ProductPage /> },
    ],
  },
]);

function BottomNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isUpload = location.pathname === '/nova-compra';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-100 bg-white md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        <NavLink
          to="/"
          end
          className="flex flex-col items-center gap-0.5 px-5 py-1"
        >
          <svg
            className={`h-6 w-6 ${isHome ? 'text-zinc-900' : 'text-zinc-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isHome ? 2.5 : 1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
            />
          </svg>
          <span
            className={`text-[10px] font-medium ${isHome ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            Início
          </span>
        </NavLink>

        <NavLink
          to="/nova-compra"
          className="flex flex-col items-center gap-0.5 px-5 py-1"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${isUpload ? 'bg-zinc-900' : 'bg-zinc-100'}`}
          >
            <svg
              className={`h-5 w-5 ${isUpload ? 'text-white' : 'text-zinc-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </NavLink>

        <LogoutNavItem />
      </div>
    </nav>
  );
}

function LogoutNavItem() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={logout}
      className="flex flex-col items-center gap-0.5 px-5 py-1"
    >
      <svg
        className="h-6 w-6 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
        />
      </svg>
      <span className="text-[10px] font-medium text-zinc-400">Sair</span>
    </button>
  );
}

function RootLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Top bar — desktop only */}
      <header className="hidden border-b border-zinc-200 bg-white md:block">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <NavLink to="/" className="text-base font-bold text-zinc-900">
            Megatron
          </NavLink>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-700'
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/nova-compra"
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-700'
              }
            >
              Nova compra
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="text-zinc-400 hover:text-zinc-600"
              title={user?.name}
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 md:pb-10">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
