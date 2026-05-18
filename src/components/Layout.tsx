import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Cat, ShoppingCart, Heart, User, LogOut } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  showCart?: boolean
  showFavorites?: boolean
  showAbout?: boolean
  headerCenter?: React.ReactNode
}

function Layout({
  children,
  showCart = true,
  showFavorites = true,
  showAbout = false,
  headerCenter,
}: LayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { getItemCount } = useCartStore()
  const { getCount: getFavoritesCount } = useFavoritesStore()

  const cartCount = getItemCount()
  const favoritesCount = getFavoritesCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-snow">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center">
                <Cat className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-charcoal">Socker Studio</span>
            </button>

            {/* Center content (e.g., search bar) */}
            {headerCenter && (
              <div className="flex-1 max-w-md mx-8">{headerCenter}</div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              {showCart && (
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-nordic-blue text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {showFavorites && (
                <button
                  onClick={() => navigate('/favorites')}
                  className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-ash text-white text-xs rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </button>
              )}

              {showAbout && (
                <button
                  onClick={() => navigate('/about')}
                  className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
                >
                  <Cat className="w-5 h-5" />
                </button>
              )}

              {/* User menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-sage" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                    <p className="text-xs text-slate">{user?.email}</p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate hover:text-charcoal"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
