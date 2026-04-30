const Navbar = ({ userName, isSidebarOpen, onToggleSidebar }) => {
  return (
    <nav className="sticky top-0 z-30 h-16 w-full border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4">
        <button
          type="button"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-100 text-orange-900 transition-colors hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <div className="flex min-w-0 shrink-0 flex-row items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg"></div>
          <span className="truncate text-xl font-serif font-bold text-orange-900">LitBound</span>
        </div>

        <div className="ml-4 hidden min-w-0 flex-1 flex-row items-center justify-center gap-8 lg:flex xl:gap-12">
          <a href="#" className="text-gray-600 hover:text-orange-600 font-medium">Collections</a>
          <a href="#" className="text-gray-600 hover:text-orange-600 font-medium">Best Sellers</a>
          <a href="#" className="text-gray-600 hover:text-orange-600 font-medium">Gift Cards</a>
          <a href="#" className="text-gray-600 hover:text-orange-600 font-medium">Community</a>
        </div>

        <div className="ml-auto flex shrink-0 flex-row items-center gap-3 sm:gap-6">
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-2 py-2 sm:gap-3 sm:px-4">
            <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs text-orange-800 font-bold">
              {userName ? userName[0] : 'A'}
            </div>
            <span className="hidden max-w-[100px] truncate text-sm font-bold text-orange-900 min-[420px]:block">
              {userName || 'Guest User'}
            </span>
          </div>
          <button type="button" aria-label="Sign out" className="text-gray-400 hover:text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
