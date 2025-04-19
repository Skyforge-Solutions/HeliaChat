import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="px-4 py-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-muted-foreground" size={16} />
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md text-sm bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
