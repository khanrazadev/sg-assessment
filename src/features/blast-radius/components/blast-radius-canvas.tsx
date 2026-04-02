'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState, MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { FlowNode } from '@/components/ui/flow-node';
import { Button } from '@/components/ui/button';
import { getBlastRadiusGraph } from '@/lib/blast-radius';
import { mockSendgrid, mockPostman, mockOpenAI } from '@/data/blast-radius';
import { DetectorType } from '@/types/blast-radius';

const nodeTypes = { custom: FlowNode };

// Maps row ID to detector name for URL-based preselection
const ID_TO_DETECTOR: Record<string, DetectorType> = {
  '2': 'postman',
  '3': 'openai',
};

function BlastRadiusCanvasInner() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') ?? '';

  const [activeDetector, setActiveDetector] = useState<DetectorType>(
    ID_TO_DETECTOR[id] ?? 'sendgrid'
  );

  useEffect(() => {
    setActiveDetector(ID_TO_DETECTOR[id] ?? 'sendgrid');
  }, [id]);

  const graphData = useMemo(() => {
    if (activeDetector === 'sendgrid') return getBlastRadiusGraph('sendgrid', mockSendgrid);
    if (activeDetector === 'postman')  return getBlastRadiusGraph('postman', mockPostman);
    if (activeDetector === 'openai')   return getBlastRadiusGraph('openai', mockOpenAI);
    return { nodes: [], edges: [] };
  }, [activeDetector]);

  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  useEffect(() => {
    setNodes(graphData.nodes);
    setEdges(
      graphData.edges.map((e) => ({
        ...e,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#CBD5E1' },
      }))
    );
  }, [graphData, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/vcs">
            <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Blast Radius Insights</h1>
            <p className="text-sm text-gray-500">
              Node visualization for detector:{' '}
              <span className="font-semibold text-primary uppercase">{activeDetector}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant={activeDetector === 'sendgrid' ? 'primary' : 'outline'} onClick={() => setActiveDetector('sendgrid')} size="sm">
            Sendgrid Demo
          </Button>
          <Button variant={activeDetector === 'postman' ? 'primary' : 'outline'} onClick={() => setActiveDetector('postman')} size="sm" className={activeDetector === 'postman' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
            Postman Demo
          </Button>
          <Button variant={activeDetector === 'openai' ? 'primary' : 'outline'} onClick={() => setActiveDetector('openai')} size="sm" className={activeDetector === 'openai' ? 'bg-black hover:bg-gray-800' : ''}>
            OpenAI Demo
          </Button>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="#E2E8F0" gap={16} />
          <Controls className="bg-white shadow-md border-gray-200" />
          <MiniMap nodeColor="#8B5CF6" maskColor="rgba(248, 250, 252, 0.7)" />
        </ReactFlow>
      </div>
    </div>
  );
}

export function BlastRadiusCanvas() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading insights...</div>}>
      <BlastRadiusCanvasInner />
    </Suspense>
  );
}
