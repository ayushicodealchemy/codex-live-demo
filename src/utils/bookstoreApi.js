import { supabase } from './supabaseClient';

export const emptyBook = {
  title: '',
  author: '',
  category: 'Fiction',
  description: '',
  cover_url: '',
  price: 299,
  inventory: 10,
  read_url: '',
  featured: false
};

export const getDashboardData = async (userId) => {
  const [profile, subscription, books, cart, wishlist, orders, progress, reviews] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('subscriptions').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('books').select('*').order('featured', { ascending: false }).order('created_at'),
    supabase.from('cart_items').select('*, books(*)').eq('user_id', userId).order('created_at'),
    supabase.from('wishlist_items').select('*, books(*)').eq('user_id', userId).order('created_at'),
    supabase.from('orders').select('*, order_items(*, books(*))').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('reading_progress').select('*').eq('user_id', userId),
    supabase.from('reviews').select('*').order('created_at', { ascending: false })
  ]);

  const error = [profile, subscription, books, cart, wishlist, orders, progress, reviews].find((result) => result.error)?.error;
  if (error) throw error;

  return {
    profile: profile.data,
    subscription: subscription.data,
    books: books.data || [],
    cart: cart.data || [],
    wishlist: wishlist.data || [],
    orders: orders.data || [],
    progress: progress.data || [],
    reviews: reviews.data || []
  };
};

export const saveBook = async (book, userId) => {
  const payload = {
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description,
    cover_url: book.cover_url || null,
    price: Number(book.price),
    inventory: Number(book.inventory),
    read_url: book.read_url || null,
    featured: Boolean(book.featured),
    created_by: book.created_by || userId
  };

  if (book.id) {
    const { error } = await supabase.from('books').update(payload).eq('id', book.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('books').insert(payload);
  if (error) throw error;
};

export const deleteBook = async (bookId) => {
  const { error } = await supabase.from('books').delete().eq('id', bookId);
  if (error) throw error;
};

export const addToCart = async (userId, bookId, quantity = 1) => {
  const { error } = await supabase.from('cart_items').upsert(
    { user_id: userId, book_id: bookId, quantity },
    { onConflict: 'user_id,book_id' }
  );
  if (error) throw error;
};

export const updateCartItem = async (itemId, quantity) => {
  if (quantity < 1) {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
  if (error) throw error;
};

export const toggleWishlist = async (userId, bookId, hasItem) => {
  const query = supabase.from('wishlist_items');
  const { error } = hasItem
    ? await query.delete().eq('user_id', userId).eq('book_id', bookId)
    : await query.insert({ user_id: userId, book_id: bookId });
  if (error) throw error;
};

export const saveReview = async (userId, bookId, rating, comment) => {
  const { error } = await supabase.from('reviews').upsert(
    { user_id: userId, book_id: bookId, rating: Number(rating), comment },
    { onConflict: 'user_id,book_id' }
  );
  if (error) throw error;
};

export const saveProgress = async (userId, bookId, progress) => {
  const { error } = await supabase.from('reading_progress').upsert(
    { user_id: userId, book_id: bookId, progress: Number(progress) },
    { onConflict: 'user_id,book_id' }
  );
  if (error) throw error;
};

export const checkoutCart = async (userId, cartItems) => {
  const total = cartItems.reduce((sum, item) => sum + Number(item.books.price) * item.quantity, 0);
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: userId, status: 'paid', total, payment_method: 'demo_checkout' })
    .select()
    .single();
  if (orderError) throw orderError;

  const items = cartItems.map((item) => ({
    order_id: order.id,
    book_id: item.book_id,
    quantity: item.quantity,
    unit_price: item.books.price
  }));
  const { error: itemError } = await supabase.from('order_items').insert(items);
  if (itemError) throw itemError;

  const { error: clearError } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (clearError) throw clearError;
};

export const activateSubscription = async (userId) => {
  const renewsAt = new Date();
  renewsAt.setMonth(renewsAt.getMonth() + 1);
  const { error } = await supabase
    .from('subscriptions')
    .update({ plan: 'reader_plus', status: 'active', renews_at: renewsAt.toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
};
