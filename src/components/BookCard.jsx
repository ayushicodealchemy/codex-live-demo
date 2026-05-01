const BookCard = ({ book, inWishlist, onAddCart, onReview, onToggleWishlist }) => {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <img
        src={book.cover_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=500'}
        alt={book.title}
        className="h-56 w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{book.category}</p>
          <h3 className="line-clamp-1 text-lg font-bold text-stone-950">{book.title}</h3>
          <p className="text-sm text-stone-600">{book.author}</p>
        </div>
        <p className="line-clamp-3 min-h-16 text-sm text-stone-600">{book.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-stone-950">Rs. {Number(book.price).toFixed(0)}</span>
          <span className="text-xs font-semibold text-stone-500">{book.inventory} in stock</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onAddCart(book)}
            className="rounded-md bg-emerald-900 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Cart
          </button>
          <button
            type="button"
            onClick={() => onToggleWishlist(book)}
            className="rounded-md border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            {inWishlist ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => onReview(book)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
          >
            Review
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
