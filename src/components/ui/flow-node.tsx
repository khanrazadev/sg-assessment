import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Plus, Minus } from 'lucide-react';
import { CustomNodeData } from '@/types/blast-radius';

// ---------------------------------------------------------------------------
// Level → left-border accent color
// ---------------------------------------------------------------------------
const LEVEL_BORDER: Record<number, string> = {
  1: 'border-l-blue-500',
  2: 'border-l-purple-600',
  3: 'border-l-teal-500',
  4: 'border-l-orange-400',
};

// ---------------------------------------------------------------------------
// Type → dot color
// ---------------------------------------------------------------------------
const TYPE_DOT: Record<string, string> = {
  service:    'bg-purple-600',
  auth:       'bg-blue-500',
  scope:      'bg-teal-500',
  permission: 'bg-orange-400',
  user:       'bg-pink-500',
  workspace:  'bg-sky-500',
  role:       'bg-violet-500',
  org:        'bg-indigo-500',
};

// ---------------------------------------------------------------------------
// Score → badge styles
// ---------------------------------------------------------------------------
const SCORE_BADGE: Record<string, string> = {
  Critical: 'bg-status-criticalBg text-status-critical',
  High:     'bg-status-highBg     text-status-high',
  Medium:   'bg-status-mediumBg   text-status-medium',
  Low:      'bg-gray-100          text-gray-500',
};

// ---------------------------------------------------------------------------
// FlowNode
// ---------------------------------------------------------------------------

export const FlowNode = memo(({ data }: { data: CustomNodeData }) => {
  const level      = data.level ?? 2;
  const dotColor   = TYPE_DOT[data.type ?? ''] ?? 'bg-gray-400';
  const borderColor = LEVEL_BORDER[level] ?? 'border-l-gray-300';
  const scoreStyle  = SCORE_BADGE[data.score ?? ''] ?? '';

  const isExpanded  = data.isExpanded ?? false;
  const hasChildren = data.hasChildren ?? false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggle && data.id) {
      data.onToggle(data.id);
    }
  };

  return (
    <div
      className={[
        'shadow-md rounded-md bg-white border-y border-r border-l-4',
        borderColor,
        'min-w-[210px] max-w-[280px] transition-all duration-200',
        isExpanded ? 'ring-2 ring-offset-1 ring-purple-300 shadow-purple-100' : '',
      ].join(' ')}
    >
      {/* Target handle — left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#CBD5E1', border: 'none', width: 6, height: 6 }}
      />

      <div className="p-3">
        {/* ── Header row ─────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
          {/* Type badge */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {data.type || 'Node'}
            </span>
          </div>

          {/* Right side: score badge + expand/collapse button */}
          <div className="flex items-center gap-1.5">
            {data.score && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${scoreStyle}`}>
                {data.score}
              </span>
            )}

            {hasChildren && (
              <button
                onClick={handleToggle}
                title={isExpanded ? 'Collapse children' : 'Expand children'}
                className={[
                  'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                  'border transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-purple-400',
                  isExpanded
                    ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600',
                ].join(' ')}
              >
                {isExpanded ? (
                  <Minus className="w-2.5 h-2.5" />
                ) : (
                  <Plus className="w-2.5 h-2.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm leading-tight break-words">
            {data.label}
          </span>
          {data.sublabel && (
            <span className="text-xs text-gray-400 mt-0.5 leading-tight break-words">
              {data.sublabel}
            </span>
          )}
        </div>

        {/* ── Detail list (only when expanded) ───────────────── */}
        {isExpanded && data.details && data.details.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-0.5 max-h-[72px] overflow-y-auto">
            {data.details.map((d, i) => (
              <div key={i} className="flex items-start gap-1 break-all">
                <span className="text-gray-300 select-none mt-0.5">•</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Collapse hint ───────────────────────────────────── */}
        {!isExpanded && hasChildren && (
          <div className="mt-2 pt-1.5 border-t border-gray-50">
            <span className="text-[10px] text-gray-400 italic">
              Click + to expand children
            </span>
          </div>
        )}
      </div>

      {/* Source handle — right */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#CBD5E1', border: 'none', width: 6, height: 6 }}
      />
    </div>
  );
});

FlowNode.displayName = 'FlowNode';
