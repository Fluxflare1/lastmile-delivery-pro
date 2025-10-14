import React from "react";
import { WalletTransactionFilters } from "../../types/wallet";

interface Props {
  onFilterChange: (filters: WalletTransactionFilters) => void;
}

export const WalletTransactionFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<WalletTransactionFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-lg shadow-sm mb-4"
    >
      <input
        type="text"
        name="search"
        placeholder="Search description..."
        value={filters.search || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md w-40"
      />

      <select
        name="type"
        value={filters.type || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>

      <select
        name="status"
        value={filters.status || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">All Statuses</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
        <option value="reversed">Reversed</option>
      </select>

      <input
        type="date"
        name="startDate"
        value={filters.startDate || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md"
      />
      <input
        type="date"
        name="endDate"
        value={filters.endDate || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md"
      />

      <input
        type="number"
        name="minAmount"
        placeholder="Min ₦"
        value={filters.minAmount || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md w-28"
      />
      <input
        type="number"
        name="maxAmount"
        placeholder="Max ₦"
        value={filters.maxAmount || ""}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md w-28"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
      >
        Reset
      </button>
    </form>
  );
};
