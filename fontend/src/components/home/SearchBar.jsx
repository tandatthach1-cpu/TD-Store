/**
 * Simple search bar component.
 * Calls `onSearch` with the current query whenever the input changes.
 * Styling follows Tailwind utilities used in the rest of the project.
 */
export default function SearchBar({ query, onSearch }) {
  return (
    <div className="mb-6 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={query}
        onChange={e => onSearch(e.target.value)}
        className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
