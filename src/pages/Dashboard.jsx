import { useCallback, useEffect, useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import Shell from '../components/Shell';
import {
  activateSubscription,
  addToCart,
  checkoutCart,
  deleteBook,
  emptyBook,
  getDashboardData,
  saveBook,
  saveProgress,
  saveReview,
  toggleWishlist,
  updateCartItem
} from '../utils/bookstoreApi';

const Dashboard = ({ session }) => {
  const userId = session.user.id;
  const [activeTab, setActiveTab] = useState('Store');
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState('');
  const [reviewBook, setReviewBook] = useState(null);
  const [bookDraft, setBookDraft] = useState(emptyBook);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: '' });

  const load = useCallback(async () => {
    setData(await getDashboardData(userId));
  }, [userId]);

  useEffect(() => {
    let isActive = true;
    getDashboardData(userId)
      .then((nextData) => {
        if (isActive) setData(nextData);
      })
      .catch((error) => {
        if (isActive) setNotice(error.message);
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const wishlistIds = useMemo(() => new Set((data?.wishlist || []).map((item) => item.book_id)), [data]);
  const cartCount = (data?.cart || []).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = (data?.cart || []).reduce((sum, item) => sum + Number(item.books.price) * item.quantity, 0);

  const run = async (action, message) => {
    setNotice('');
    try {
      await action();
      await load();
      if (message) setNotice(message);
    } catch (error) {
      setNotice(error.message);
    }
  };

  if (!data) {
    return <div className="grid min-h-screen place-items-center bg-stone-50">Loading bookstore...</div>;
  }

  const canEdit = (book) => book.created_by === userId || data.profile?.role === 'admin';

  return (
    <Shell activeTab={activeTab} cartCount={cartCount} onTabChange={setActiveTab} profile={data.profile}>
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <Hero subscription={data.subscription} onSubscribe={() => run(() => activateSubscription(userId), 'Reader Plus activated.')} />
        {notice && <p className="rounded-md bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}

        {activeTab === 'Store' && (
          <section className="space-y-6">
            <SectionTitle title="Bookstore" subtitle="Buy hardcopies, save favourites, review books, and start reading from your library." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  inWishlist={wishlistIds.has(book.id)}
                  onAddCart={() => run(() => addToCart(userId, book.id), 'Added to cart.')}
                  onReview={() => setReviewBook(book)}
                  onToggleWishlist={() => run(() => toggleWishlist(userId, book.id, wishlistIds.has(book.id)))}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Library' && (
          <Library books={data.books} progress={data.progress} onProgress={(book, value) => run(() => saveProgress(userId, book.id, value))} />
        )}

        {activeTab === 'Wishlist' && (
          <List title="Wishlist" empty="No saved books yet." count={data.wishlist.length}>
            {data.wishlist.map((item) => <LineBook key={item.id} book={item.books} action="Move to cart" onAction={() => run(() => addToCart(userId, item.book_id))} />)}
          </List>
        )}

        {activeTab === 'Cart' && (
          <Cart items={data.cart} total={cartTotal} onQty={(item, qty) => run(() => updateCartItem(item.id, qty))} onCheckout={() => run(() => checkoutCart(userId, data.cart), 'Demo payment complete. Order created.')} />
        )}

        {activeTab === 'Reviews' && (
          <List title="Reviews" empty="No reviews yet." count={data.reviews.length}>
            {data.reviews.map((review) => {
              const book = data.books.find((item) => item.id === review.book_id);
              return <p key={review.id} className="rounded-lg border border-stone-200 bg-white p-4"><b>{book?.title || 'Book'}</b> - {review.rating}/5<br />{review.comment}</p>;
            })}
          </List>
        )}

        {activeTab === 'Orders' && <Orders orders={data.orders} />}

        {activeTab === 'Manage' && (
          <Manage books={data.books} canEdit={canEdit} draft={bookDraft} onDraft={setBookDraft} onDelete={(book) => run(() => deleteBook(book.id), 'Book deleted.')} onSave={(event) => {
            event.preventDefault();
            run(() => saveBook(bookDraft, userId), 'Book saved.');
            setBookDraft(emptyBook);
          }} />
        )}

        {reviewBook && (
          <ReviewModal book={reviewBook} draft={reviewDraft} onDraft={setReviewDraft} onClose={() => setReviewBook(null)} onSubmit={(event) => {
            event.preventDefault();
            run(() => saveReview(userId, reviewBook.id, reviewDraft.rating, reviewDraft.comment), 'Review saved.');
            setReviewBook(null);
            setReviewDraft({ rating: 5, comment: '' });
          }} />
        )}
      </main>
    </Shell>
  );
};

const Hero = ({ onSubscribe, subscription }) => (
  <section className="grid gap-6 rounded-lg bg-emerald-950 p-6 text-white md:grid-cols-[1fr_auto] md:p-8">
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">LitBound marketplace</p>
      <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold md:text-5xl">Buy books, build a reading shelf, and continue reading in one workspace.</h1>
      <p className="mt-4 max-w-2xl text-emerald-100">Cart, wishlist, reviews, reading progress, seller tools, and subscription access are connected to Supabase.</p>
    </div>
    <button type="button" onClick={onSubscribe} className="h-fit rounded-md bg-white px-5 py-3 font-black text-emerald-950">
      {subscription?.plan === 'reader_plus' ? 'Reader Plus Active' : 'Activate Reader Plus'}
    </button>
  </section>
);

const SectionTitle = ({ subtitle, title }) => (
  <div><h2 className="font-serif text-3xl font-bold text-stone-950">{title}</h2><p className="mt-1 text-stone-600">{subtitle}</p></div>
);

const List = ({ children, count, empty, title }) => (
  <section className="space-y-4">
    <SectionTitle title={title} subtitle="Your saved bookstore activity." />
    <div className="space-y-3">{children}</div>
    {!count && <p className="rounded-lg bg-white p-5 text-stone-600">{empty}</p>}
  </section>
);

const LineBook = ({ action, book, onAction }) => (
  <article className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:flex-row sm:items-center">
    <img src={book.cover_url} alt={book.title} className="h-24 w-20 rounded-md object-cover" />
    <div className="mr-auto"><h3 className="font-bold">{book.title}</h3><p className="text-sm text-stone-600">{book.author}</p><p className="font-bold">Rs. {Number(book.price).toFixed(0)}</p></div>
    <button type="button" onClick={onAction} className="rounded-md bg-emerald-900 px-4 py-2 font-bold text-white">{action}</button>
  </article>
);

const Library = ({ books, onProgress, progress }) => (
  <List title="Reading library" empty="No books available." count={books.length}>
    {books.map((book) => {
      const item = progress.find((entry) => entry.book_id === book.id);
      return <LineBook key={book.id} book={book} action={`Progress ${item?.progress || 0}%`} onAction={() => onProgress(book, Math.min((item?.progress || 0) + 10, 100))} />;
    })}
  </List>
);

const Cart = ({ items, onCheckout, onQty, total }) => (
  <List title="Cart" empty="Your cart is empty." count={items.length}>
    {items.map((item) => <LineBook key={item.id} book={item.books} action={`Qty ${item.quantity}`} onAction={() => onQty(item, item.quantity + 1)} />)}
    {items.length > 0 && <div className="rounded-lg bg-white p-5 text-right"><p className="text-xl font-black">Total: Rs. {total.toFixed(0)}</p><button type="button" onClick={onCheckout} className="mt-3 rounded-md bg-emerald-900 px-5 py-3 font-bold text-white">Pay demo checkout</button></div>}
  </List>
);

const Orders = ({ orders }) => (
  <List title="Orders" empty="No orders placed yet." count={orders.length}>
    {orders.map((order) => <p key={order.id} className="rounded-lg border border-stone-200 bg-white p-4"><b>Order {order.id.slice(0, 8)}</b><br />{order.status} - Rs. {Number(order.total).toFixed(0)}</p>)}
  </List>
);

const Manage = ({ books, canEdit, draft, onDelete, onDraft, onSave }) => (
  <section className="space-y-5">
    <SectionTitle title="Manage books" subtitle="Add books to the marketplace. You can update or delete books you created; admins can manage all books." />
    <BookForm book={draft} onCancel={() => onDraft(emptyBook)} onChange={onDraft} onSubmit={onSave} />
    <div className="grid gap-3">
      {books.map((book) => <div key={book.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4"><b className="mr-auto">{book.title}</b><button type="button" onClick={() => onDraft(book)} disabled={!canEdit(book)} className="rounded-md border px-3 py-2 disabled:opacity-40">Edit</button><button type="button" onClick={() => onDelete(book)} disabled={!canEdit(book)} className="rounded-md border border-red-200 px-3 py-2 text-red-700 disabled:opacity-40">Delete</button></div>)}
    </div>
  </section>
);

const ReviewModal = ({ book, draft, onClose, onDraft, onSubmit }) => (
  <div className="fixed inset-0 z-30 grid place-items-center bg-stone-950/50 p-4">
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg bg-white p-6">
      <h2 className="text-xl font-bold">Review {book.title}</h2>
      <input type="number" min="1" max="5" value={draft.rating} onChange={(e) => onDraft({ ...draft, rating: e.target.value })} className="w-full rounded-md border px-3 py-2" />
      <textarea value={draft.comment} onChange={(e) => onDraft({ ...draft, comment: e.target.value })} className="min-h-28 w-full rounded-md border px-3 py-2" placeholder="Write your review" required />
      <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Cancel</button><button type="submit" className="rounded-md bg-emerald-900 px-4 py-2 font-bold text-white">Save</button></div>
    </form>
  </div>
);

export default Dashboard;
