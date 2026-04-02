import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CustomNodeData } from '@/types/blast-radius';

export const FlowNode = memo(({ data }: { data: CustomNodeData }) => {
  const getBorderColor = () => {
    switch (data.score) {
      case 'Critical': return 'border-status-critical';
      case 'High': return 'border-status-high';
      case 'Medium': return 'border-status-medium';
      default: return 'border-gray-200';
    }
  };

  const getDotColor = () => {
    switch (data.type) {
      case 'service': return 'bg-purple-600';
      case 'auth': return 'bg-blue-500';
      case 'scope': return 'bg-teal-500';
      case 'permission': return 'bg-orange-500';
      case 'user': return 'bg-pink-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`shadow-md rounded-md bg-white border-l-4 ${getBorderColor()} min-w-[200px] border-y border-r`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#CBD5E1', border: 'none', width: 6, height: 6 }} 
      />
      <div className="p-3">
        <div className="flex justify-between items-center mb-1 border-b border-gray-50 pb-2">
            <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${getDotColor()}`} />
               <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                 {data.type || 'Node'}
               </span>
            </div>
            {data.score && (
               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  data.score === 'Critical' ? 'bg-status-criticalBg text-status-critical' : 
                  data.score === 'High' ? 'bg-status-highBg text-status-high' : 
                  data.score === 'Medium' ? 'bg-status-mediumBg text-status-medium' : 
                  'bg-gray-100 text-gray-500'
               }`}>
                  {data.score}
               </span>
            )}
        </div>
        
        <div className="flex flex-col pt-1">
           <span className="font-semibold text-gray-900 text-sm">{data.label}</span>
           {data.sublabel && <span className="text-xs text-gray-500 truncate mt-0.5">{data.sublabel}</span>}
        </div>
        
        {data.details && data.details.length > 0 && (
           <div className="mt-3 pt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-[60px] overflow-y-auto">
              {data.details.map((d, i) => (
                 <div key={i} className="mb-1 last:mb-0 break-words">• {d}</div>
              ))}
           </div>
        )}
      </div>
      <Handle 
         type="source" 
         position={Position.Right} 
         style={{ background: '#CBD5E1', border: 'none', width: 6, height: 6 }} 
      />
    </div>
  );
});

FlowNode.displayName = 'FlowNode';
