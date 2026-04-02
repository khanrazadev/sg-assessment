import { Finding } from '@/types/vcs';
import { PostmanIcon, GCPIcon } from '@/features/vcs/components/vcs-icons';

// Icons embedded in data because they are tightly coupled to the detector identity.
// A future API would return an icon key that maps to a component.
export const findingsData: Finding[] = [
  { id: 1, category: 'Critical', detector: { name: 'Groq', icon: <span className="text-[14px] font-sans font-medium text-gray-900 leading-none pb-[1px]">g</span> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Ticket created', 'Rotated', 'Moved to vault'] },
  { id: 2, category: 'Critical', detector: { name: 'Postman', icon: <PostmanIcon className="w-4 h-4" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Ticket created', 'Rotated', 'Moved to vault'] },
  { id: 3, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Rotated', 'Moved to vault'] },
  { id: 4, category: 'High', detector: { name: 'GCPapplication..', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Ticket created', 'Rotated', 'Moved to vault'] },
  { id: 5, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Ticket created', 'Rotated'] },
  { id: 6, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Ticket created'] },
  { id: 7, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed'] },
  { id: 8, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Auto fixed', 'Moved to vault'] },
  { id: 9, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Ticket created'] },
  { id: 10, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Ticket created', 'Rotated', 'Moved to vault'] },
  { id: 11, category: 'High', detector: { name: 'GCP', icon: <GCPIcon className="w-[18px] h-[18px]" /> }, provider: 'github', secret: '12345678', occurrences: 5, status: ['Ticket created', 'Rotated', 'Moved to vault'] },
];

// Maps each status label to its Tailwind color classes
export const statusColors: Record<string, string> = {
  'Auto fixed':    'bg-pink-50 text-pink-600 border-pink-100 dot-pink-500',
  'Ticket created':'bg-green-50 text-green-600 border-green-100 dot-green-500',
  'Rotated':       'bg-blue-50 text-blue-600 border-blue-100 dot-blue-500',
  'Moved to vault':'bg-yellow-50 text-yellow-600 border-yellow-100 dot-yellow-500',
  'Ignore':        'bg-gray-50 text-gray-600 border-gray-100 dot-gray-500',
};
