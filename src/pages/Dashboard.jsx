import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const location = useLocation();
  const userName = location.state?.userName || 'Aarav Sharma';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://images.unsplash.com/photo-1543004218-ee1411046231?auto=format&fit=crop&q=80&w=200' },
    { id: 3, title: '1984', author: 'George Orwell', cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200' },
    { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=200' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />
      
      <div className="flex flex-1 flex-row">
        <Sidebar
          userName={userName}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 sm:mb-12">
              <h2 className="mb-2 text-2xl font-serif font-bold text-gray-900 sm:text-3xl">Welcome Back, {userName}!</h2>
              <p className="text-gray-600 italic">"A room without books is like a body without a soul." — Cicero</p>
            </header>

            <section className="mb-8 sm:mb-12">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-800">Currently Reading</h3>
                <button type="button" className="shrink-0 text-sm font-bold text-orange-600 hover:underline">View All</button>
              </div>
              
              <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {mockBooks.map(book => (
                  <div key={book.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <img src={book.cover} alt={book.title} className="mb-4 h-48 w-full rounded-xl object-cover" />
                    <h4 className="font-bold text-gray-900 truncate">{book.title}</h4>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-col gap-6 rounded-3xl bg-orange-600 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                <div className="min-w-0">
                  <h3 className="mb-4 text-2xl font-serif font-bold sm:text-3xl">Summer Reading Challenge</h3>
                  <p className="text-orange-100 mb-6 max-w-md">Join 10,000+ readers and discover your next favorite book this summer. Earn badges and rewards!</p>
                  <button type="button" className="rounded-xl bg-white px-6 py-3 font-bold text-orange-600 transition-colors hover:bg-orange-50 sm:px-8">
                    Join Now
                  </button>
                </div>
                <div className="self-end text-5xl opacity-20 sm:text-6xl lg:self-auto">🌞📚</div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
