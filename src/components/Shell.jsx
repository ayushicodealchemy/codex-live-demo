import { supabase } from '../utils/supabaseClient';

const tabs = ['Store', 'Library', 'Wishlist', 'Cart', 'Reviews', 'Orders', 'Manage'];

const Shell = ({ activeTab, cartCount, children, onTabChange, profile }) => {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => onTabChange('Store')}
            className="mr-auto text-left font-serif text-2xl font-bold text-emerald-900"
          >
            LitBound
          </button>
          <nav className="order-3 flex w-full gap-2 overflow-x-auto lg:order-none lg:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  activeTab === tab ? 'bg-emerald-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab}{tab === 'Cart' && cartCount ? ` (${cartCount})` : ''}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-36 truncate text-sm font-semibold text-stone-700 sm:block">
              {profile?.full_name || 'Reader'}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Shell;
