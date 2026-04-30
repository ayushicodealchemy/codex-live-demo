const Sidebar = ({ userName, isOpen, onClose }) => {
  const links = [
    { name: 'My Books', icon: '📚' },
    { name: 'Browse', icon: '🔍' },
    { name: 'Wishlist', icon: '❤️' },
    { name: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Dismiss sidebar"
          onClick={onClose}
          className="fixed inset-0 top-16 z-20 bg-gray-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-20 flex h-[calc(100vh-64px)] w-72 max-w-[85vw] flex-col overflow-y-auto bg-orange-900 p-6 shadow-xl transition-transform duration-300 ease-out lg:sticky lg:z-10 lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0 max-lg:visible' : '-translate-x-full max-lg:invisible'
        }`}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-orange-400 p-0.5">
            <div className="w-full h-full bg-orange-700 rounded-full flex items-center justify-center text-white font-bold">
              {userName ? userName[0] : 'A'}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-orange-300 uppercase tracking-wider font-bold">Reader Profile</p>
            <p className="truncate text-sm font-medium text-white">{userName || 'Aarav Sharma'}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.name}
              href="#"
              onClick={onClose}
              className="group flex items-center gap-4 rounded-xl px-4 py-3 font-medium text-orange-100 transition-all hover:bg-orange-800"
            >
              <span className="text-lg transition-transform group-hover:scale-110">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-orange-800">
          <div className="bg-orange-800/50 p-4 rounded-2xl border border-orange-700/50">
            <p className="text-xs text-orange-300 font-medium mb-2">Reading Goal</p>
            <div className="w-full bg-orange-900 rounded-full h-2 mb-2">
              <div className="bg-orange-400 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-orange-200 text-right">12/15 books read</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
