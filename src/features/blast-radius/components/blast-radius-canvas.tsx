'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ChevronLeft, Layers } from 'lucide-react';
import Link from 'next/link';

import { FlowNode } from '@/components/ui/flow-node';
import { Button } from '@/components/ui/button';
import { getBlastRadiusGraph, collectDescendants } from '@/lib/blast-radius';
import { mockSendgrid, mockPostman, mockOpenAI } from '@/data/blast-radius';
import { DetectorType, GraphNode } from '@/types/blast-radius';

const nodeTypes = { custom: FlowNode };

const ID_TO_DETECTOR: Record<string, DetectorType> = {
  '2': 'postman',
  '3': 'openai',
};

// ---------------------------------------------------------------------------
// Inner component (needs useSearchParams → must be inside Suspense)
// ---------------------------------------------------------------------------

function BlastRadiusCanvasInner() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') ?? '';

  const [activeDetector, setActiveDetector] = useState<DetectorType>(
    ID_TO_DETECTOR[id] ?? 'sendgrid'
  );

  // Set of expanded node IDs — root is expanded by default
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  // ------------------------------------------------------------------
  // Raw graph (all nodes + all edges, no filtering)
  // ------------------------------------------------------------------
  const rawGraph = useMemo(() => {
    if (activeDetector === 'sendgrid') return getBlastRadiusGraph('sendgrid', mockSendgrid);
    if (activeDetector === 'postman')  return getBlastRadiusGraph('postman',  mockPostman);
    if (activeDetector === 'openai')   return getBlastRadiusGraph('openai',   mockOpenAI);
    return { nodes: [], edges: [] };
  }, [activeDetector]);

  // Reset expansion when detector switches (keep root expanded)
  useEffect(() => {
    setExpandedNodes(new Set(['root']));
  }, [activeDetector]);

  useEffect(() => {
    setActiveDetector(ID_TO_DETECTOR[id] ?? 'sendgrid');
  }, [id]);

  // ------------------------------------------------------------------
  // toggleNode — expand adds id, collapse removes id + all descendants
  // ------------------------------------------------------------------
  const toggleNode = useCallback(
    (nodeId: string) => {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          // Collapse: remove this node and ALL its descendants
          next.delete(nodeId);
          const descendants = collectDescendants(nodeId, rawGraph.nodes);
          descendants.forEach((d) => next.delete(d));
        } else {
          // Expand: just add this node
          next.add(nodeId);
        }
        return next;
      });
    },
    [rawGraph.nodes]
  );

  // ------------------------------------------------------------------
  // Visible nodes — node is visible if:
  //   • it has no parentId (root)
  //   • OR its parentId is in expandedNodes
  // ------------------------------------------------------------------
  const visibleNodes = useMemo((): GraphNode[] => {
    return rawGraph.nodes
      .filter((n) => {
        const parentId = n.data.parentId;
        return !parentId || expandedNodes.has(parentId);
      })
      .map((n) => ({
        ...n,
        data: {
          ...n.data,
          isExpanded: expandedNodes.has(n.id),
          onToggle: toggleNode,
        },
      }));
  }, [rawGraph.nodes, expandedNodes, toggleNode]);

  // ------------------------------------------------------------------
  // Visible edges — both source and target must be visible
  // ------------------------------------------------------------------
  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes]
  );

  const visibleEdges = useMemo(() => {
    return rawGraph.edges
      .filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map((e) => ({
        ...e,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: '#CBD5E1',
        },
      }));
  }, [rawGraph.edges, visibleNodeIds]);

  // ------------------------------------------------------------------
  // ReactFlow state (sync when visible sets change)
  // ------------------------------------------------------------------
  const [nodes, setNodes, onNodesChange] = useNodesState(visibleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(visibleEdges);

  useEffect(() => { setNodes(visibleNodes); }, [visibleNodes, setNodes]);
  useEffect(() => { setEdges(visibleEdges); }, [visibleEdges, setEdges]);

  // ------------------------------------------------------------------
  // Quick stats
  // ------------------------------------------------------------------
  const totalNodes   = rawGraph.nodes.length;
  const visibleCount = visibleNodes.length;
  const depth        = expandedNodes.size > 1 ? (expandedNodes.size > 3 ? 4 : 3) : 2;

  return (
    <div className="flex flex-col h-full w-full">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/vcs">
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              Blast Radius Insights
            </h1>
            <p className="text-sm text-gray-500">
              Click any node to expand its children ·{' '}
              <span className="font-medium text-gray-700">
                {visibleCount} / {totalNodes} nodes visible
              </span>
            </p>
          </div>
        </div>

        {/* Detector switcher */}
        <div className="flex gap-2">
          <Button
            variant={activeDetector === 'sendgrid' ? 'primary' : 'outline'}
            onClick={() => setActiveDetector('sendgrid')}
            size="sm"
          >
            SendGrid
          </Button>
          <Button
            variant={activeDetector === 'postman' ? 'primary' : 'outline'}
            onClick={() => setActiveDetector('postman')}
            size="sm"
            className={activeDetector === 'postman' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Postman
          </Button>
          <Button
            variant={activeDetector === 'openai' ? 'primary' : 'outline'}
            onClick={() => setActiveDetector('openai')}
            size="sm"
            className={activeDetector === 'openai' ? 'bg-black hover:bg-gray-800' : ''}
          >
            OpenAI
          </Button>
        </div>
      </div>

      {/* ── Depth legend ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-3 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Layers className="w-3.5 h-3.5" />
          <span className="font-medium">Hierarchy depth:</span>
        </div>
        {[
          { level: 1, label: 'Auth Key',    color: 'bg-blue-500' },
          { level: 2, label: 'Service',     color: 'bg-purple-600' },
          { level: 3, label: 'Scope',       color: 'bg-teal-500' },
          { level: 4, label: 'Permission',  color: 'bg-orange-500' },
        ].map(({ level, label, color }) => (
          <div
            key={level}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
              depth >= level ? 'border-gray-300 bg-white shadow-sm' : 'border-dashed border-gray-200 opacity-40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-gray-600 font-medium">L{level}</span>
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Graph ──────────────────────────────────────────────────── */}
      <div className="flex-1 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#E2E8F0" gap={16} />
          <Controls className="bg-white shadow-md border-gray-200" />
          <MiniMap nodeColor="#8B5CF6" maskColor="rgba(248, 250, 252, 0.7)" />
        </ReactFlow>

        {/* Empty hint when nothing expanded yet */}
        {visibleCount <= 2 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-white/90 backdrop-blur border border-gray-200 shadow-md rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium">
              👆 Click the service node to expand scopes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export — wrapped in Suspense (required by useSearchParams / Next.js)
// ---------------------------------------------------------------------------

export function BlastRadiusCanvas() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading insights…</div>}>
      <BlastRadiusCanvasInner />
    </Suspense>
  );
}
