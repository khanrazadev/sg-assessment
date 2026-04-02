'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RefreshCw, Search, Download, ChevronDown, Filter,
  X, Check, ArrowUpRight, GitCommit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextInput } from '@/components/ui/text-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GithubIcon } from './vcs-icons';
import { SecretCell } from './secret-cell';
import { useVcsFilter } from '@/hooks/use-vcs-filter';
import { findingsData, statusColors } from '@/data/vcs';
import { Category } from '@/types/vcs';

const ALL_CATEGORIES: Category[] = ['Critical', 'High', 'Medium', 'Low'];

// Number of filled bars per severity (3 bars total, like a signal indicator)
const SEVERITY_BARS: Record<Category, number> = {
  Critical: 3,
  High: 2,
  Medium: 1,
  Low: 0,
};

const SEVERITY_BG: Record<Category, string> = {
  Critical: 'bg-[#9f1239]',
  High:     'bg-[#dc2626]',
  Medium:   'bg-[#c2410c]',
  Low:      'bg-[#b45309]',
};

// 3 rising bars — filled bars are white, unfilled are white/25
function SeverityBars({ filled }: { filled: number }) {
  const bars = [4, 7, 10]; // heights in px, rising left to right
  return (
    <span className="inline-flex items-end gap-[2px] mr-0.5">
      {bars.map((h, i) => (
        <span
          key={i}
          style={{ height: h, width: 2 }}
          className={`rounded-[1px] ${i < filled ? 'bg-white' : 'bg-white/25'}`}
        />
      ))}
    </span>
  );
}

const ACTION_BUTTONS = [
  { label: 'Auto fix',      dot: 'bg-pink-500' },
  { label: 'Create ticket', dot: 'bg-green-500' },
  { label: 'Rotate',        dot: 'bg-blue-500' },
  { label: 'Move to vault', dot: 'bg-yellow-500' },
  { label: 'Ignore',        dot: 'bg-gray-400' },
];

export function VcsTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filteredData, searchQuery, setSearchQuery,
    sortKey, setSortKey, filterCategories, toggleCategory, clearFilters,
  } = useVcsFilter(findingsData);

  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length === filteredData.length && filteredData.length > 0
        ? []
        : filteredData.map((f) => f.id)
    );
  };

  const toggleOne = (id: number) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <div className="flex flex-col w-full max-w-[1500px] mx-auto min-w-0" style={{ height: 'calc(100vh - 128px)' }}>
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 flex items-center">
              <span className="truncate">Findings for VCS</span>
              <Button variant="outline" size="icon" className="h-6 w-6 ml-2 text-gray-500 border-gray-200 rounded text-gray-400 hover:text-gray-900 shrink-0">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">{filteredData.length} findings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort dropdown */}
          <div className="relative">
            <Button
              onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
              variant={sortKey !== 'none' ? 'secondary' : 'outline'}
              className="h-8 px-3 text-[12px] font-medium text-gray-700 bg-white border-gray-200 rounded-[4px] shadow-sm"
            >
              <ChevronDown className="mr-1.5 h-3.5 w-3.5 text-gray-500" /> Sort data
            </Button>
            {isSortOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50 text-[13px] text-gray-700">
                {(['none', 'category', 'occurrences'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSortKey(key); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${sortKey === key && 'bg-gray-50'}`}
                  >
                    {key === 'none' ? 'Default' : key === 'category' ? 'By Severity' : 'By Occurrences'}
                    {sortKey === key && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <Button
              onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
              variant={filterCategories.length > 0 ? 'secondary' : 'outline'}
              className="h-8 px-3 text-[12px] font-medium text-gray-700 bg-white border-gray-200 rounded-[4px] shadow-sm"
            >
              <Filter className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
              {filterCategories.length > 0 ? `Filter (${filterCategories.length})` : 'Filter'}
            </Button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 text-[13px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</div>
                {ALL_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded-[4px] cursor-pointer text-gray-700">
                    <Checkbox
                      checked={filterCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className="ml-2.5">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => { clearFilters(); setSelectedIds([]); setIsSortOpen(false); setIsFilterOpen(false); }}
            variant="ghost"
            className="h-8 px-3 text-[12px] font-medium text-gray-600 hover:text-gray-900 rounded-[4px]"
          >
            <X className="mr-1.5 h-3.5 w-3.5 text-gray-500" /> Clear filter
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-2 border-b border-gray-200 bg-white gap-2">
          <div className="w-full sm:w-[260px] shrink-0">
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a finding..."
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-8 border-transparent shadow-none bg-transparent focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 w-full sm:w-auto">
            {ACTION_BUTTONS.map(({ label, dot }) => (
              <Button key={label} variant="outline" className="h-7 px-2.5 text-[11px] font-medium bg-white text-gray-700 rounded border-gray-200">
                <span className={`w-2 h-2 rounded-[2px] mr-1.5 ${dot}`} />
                {label}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-7 w-7 bg-white text-gray-600 shrink-0 ml-1 rounded">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Data Table Wrapper */}
        <div className="flex-1 overflow-auto relative">
          <Table className="border-collapse">
            <TableHeader className="sticky top-0 z-20 bg-white">
            <TableRow>
              <TableHead className="w-12 text-center pl-4 bg-[#f8fafc]">
                <Checkbox
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Category</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Detector type</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Git provider</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Secret</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Occurrences</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Blast radius</TableHead>
              <TableHead className="text-gray-500 font-normal text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-center pl-4 w-12 bg-white">
                  <Checkbox checked={selectedIds.includes(row.id)} onChange={() => toggleOne(row.id)} />
                </TableCell>

                <TableCell className="w-[100px]">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[11px] text-white h-[22px] font-normal tracking-wide ${SEVERITY_BG[row.category]}`}>
                    <SeverityBars filled={SEVERITY_BARS[row.category]} />
                    {row.category}
                  </span>
                </TableCell>

                <TableCell className="w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="w-[30px] h-[30px] rounded-[4px] border border-gray-200 bg-[#fafafa] flex items-center justify-center shrink-0">
                      {row.detector.icon}
                    </div>
                    <span className="text-[14px] text-gray-800 tracking-tight">{row.detector.name}</span>
                  </div>
                </TableCell>

                <TableCell className="w-[120px]">
                  {row.provider === 'github'
                    ? <GithubIcon className="w-[18px] h-[18px] text-gray-900" />
                    : <GitCommit className="w-[18px] h-[18px] text-orange-500" />}
                </TableCell>

                <TableCell className="w-[180px]">
                  <SecretCell secret={row.secret} />
                </TableCell>

                <TableCell className="w-[110px]">
                  <div className="flex items-center justify-between text-xs text-gray-600 border border-gray-200 rounded-[4px] px-2 py-0.5 w-10">
                    {row.occurrences} <ArrowUpRight className="w-2.5 h-2.5 text-gray-400" />
                  </div>
                </TableCell>

                <TableCell className="w-[130px]">
                  <Link href={`/blast-radius?id=${row.id}`} className="flex items-center justify-between text-xs text-gray-600 border border-gray-200 rounded-[4px] px-2 py-1 w-20 hover:bg-gray-50">
                    Insights <ArrowUpRight className="w-2.5 h-2.5 text-gray-400" />
                  </Link>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 flex-nowrap w-full">
                    {row.status.map((s) => {
                      const style = statusColors[s] || '';
                      const [bg, text, , dotClass] = style.split(' ');
                      return (
                        <div key={s} className={`flex items-center shrink-0 whitespace-nowrap text-[10px] font-normal px-2 py-[3px] rounded-[3px] border-none ${bg} ${text}`}>
                          <span className={`w-1.5 h-1.5 rounded-[1px] mr-1.5 ${dotClass?.replace('dot-', 'bg-')}`} />
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
