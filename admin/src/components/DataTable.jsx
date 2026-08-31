import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function DataTable({ columns, data, onEdit, onDelete, onRestore, pageSize = 10 }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = data.filter(row => 
    columns.some(col => 
      String(row[col.key]).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th key={col.key} className="text-left p-3 text-sm font-semibold text-gray-600">{col.label}</th>
              ))}
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">No records found</td></tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row._id || i} className="border-t hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="p-3 text-sm">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                  ))}
                  <td className="p-3">
                    <div className="flex gap-2">
                      {onEdit && <button onClick={() => onEdit(row)} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors">Edit</button>}
                      {onDelete && !row.isDeleted && <button onClick={() => onDelete(row)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors">Delete</button>}
                      {onRestore && row.isDeleted && <button onClick={() => onRestore(row)} className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm transition-colors">Restore</button>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm font-medium">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
