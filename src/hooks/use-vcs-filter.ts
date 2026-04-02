'use client';

import { useState, useMemo } from 'react';
import { Finding, Category } from '@/types/vcs';

type SortKey = 'none' | 'category' | 'occurrences';

// custom severity order (not alphabetical)
const CATEGORY_WEIGHT: Record<Category, number> = {
  Critical: 3,
  High: 2,
  Medium: 1,
  Low: 0,
};

export function useVcsFilter(data: Finding[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.detector.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.secret.toLowerCase().includes(q)
      );
    }

    if (filterCategories.length > 0) {
      result = result.filter((f) => filterCategories.includes(f.category));
    }

    if (sortKey === 'category') {
      result.sort((a, b) => (CATEGORY_WEIGHT[b.category] ?? 0) - (CATEGORY_WEIGHT[a.category] ?? 0));
    } else if (sortKey === 'occurrences') {
      result.sort((a, b) => b.occurrences - a.occurrences);
    }

    return result;
  }, [data, searchQuery, sortKey, filterCategories]);

  const toggleCategory = (cat: Category) =>
    setFilterCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const clearFilters = () => {
    setSearchQuery('');
    setSortKey('none');
    setFilterCategories([]);
  };

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    sortKey,
    setSortKey,
    filterCategories,
    toggleCategory,
    clearFilters,
  };
}
