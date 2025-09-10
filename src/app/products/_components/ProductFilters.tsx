"use client";

import { useState } from "react";

interface ProductFiltersProps {
  onSortChange: (sortBy: string) => void;
  onPriceFilter: (min: number, max: number) => void;
  totalProducts: number;
}

export default function ProductFilters({ onSortChange, onPriceFilter, totalProducts }: ProductFiltersProps) {
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handlePriceChange = () => {
    onPriceFilter(priceRange.min, priceRange.max);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results count and filters toggle */}
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors sm:hidden"
          >
            <i className="fa-solid fa-filter"></i>
            Filters
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-4">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 hidden sm:block">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-main"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Expandable filters for mobile */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 sm:hidden">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (EGP)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={handlePriceChange}
                  className="px-3 py-1 text-sm bg-main text-white rounded hover:bg-main/90"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden sm:block mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Price Range (EGP):
            </label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <button
              onClick={handlePriceChange}
              className="px-3 py-1 text-sm bg-main text-white rounded hover:bg-main/90"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
