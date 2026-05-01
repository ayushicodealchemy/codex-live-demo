import { emptyBook } from '../utils/bookstoreApi';

const BookForm = ({ book, onCancel, onChange, onSubmit }) => {
  const value = book || emptyBook;

  const update = (field, nextValue) => {
    onChange({ ...value, [field]: nextValue });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-2">
      <input className="rounded-md border border-stone-300 px-3 py-2" placeholder="Title" value={value.title} onChange={(e) => update('title', e.target.value)} required />
      <input className="rounded-md border border-stone-300 px-3 py-2" placeholder="Author" value={value.author} onChange={(e) => update('author', e.target.value)} required />
      <input className="rounded-md border border-stone-300 px-3 py-2" placeholder="Category" value={value.category} onChange={(e) => update('category', e.target.value)} required />
      <input className="rounded-md border border-stone-300 px-3 py-2" placeholder="Cover URL" value={value.cover_url || ''} onChange={(e) => update('cover_url', e.target.value)} />
      <input className="rounded-md border border-stone-300 px-3 py-2" placeholder="Read URL" value={value.read_url || ''} onChange={(e) => update('read_url', e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-md border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Price" value={value.price} onChange={(e) => update('price', e.target.value)} required />
        <input className="rounded-md border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Stock" value={value.inventory} onChange={(e) => update('inventory', e.target.value)} required />
      </div>
      <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-2 md:col-span-2" placeholder="Description" value={value.description} onChange={(e) => update('description', e.target.value)} required />
      <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
        <input type="checkbox" checked={Boolean(value.featured)} onChange={(e) => update('featured', e.target.checked)} />
        Feature this book
      </label>
      <div className="flex justify-end gap-2 md:col-span-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-stone-300 px-4 py-2 font-bold text-stone-700">Cancel</button>
        <button type="submit" className="rounded-md bg-emerald-900 px-4 py-2 font-bold text-white">Save Book</button>
      </div>
    </form>
  );
};

export default BookForm;
