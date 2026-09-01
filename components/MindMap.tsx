
"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
} from "reactflow";

function BrainNode({ data }: any) {
  const tone = data.level === 0 ? "core" : data.level === 1 ? "branch" : "leaf";
  return (
    <div className={`brain-node ${tone}`}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="brain-node-kicker">
        {data.level === 0 ? "CORE CONCEPT" : data.label === "Real-life example" || data.label === "Student example" ? "REAL-LIFE EXAMPLE" : data.level === 1 ? "MAJOR BRANCH" : "SUB-CONCEPT"}
      </div>
      <div className="brain-node-title">{data.label}</div>
      {data.detail && <div className="brain-node-detail">{data.detail}</div>}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { brain: BrainNode };


export function MindMap({ topic }: { topic: any }) {
  const raw = Array.isArray(topic.mindMap) ? topic.mindMap : [];
  const items = raw.length ? raw : [{ id: "root", label: topic.title }];
  const root = items.find((x: any) => !x.parent) || items[0];

  const children: Record<string, any[]> = {};
  for (const n of items) {
    if (n.parent) (children[n.parent] ||= []).push(n);
  }

  const depth = new Map<string, number>();
  depth.set(root.id, 0);
  const q = [root.id];
  while (q.length) {
    const pid = q.shift()!;
    for (const child of children[pid] || []) {
      if (!depth.has(child.id)) {
        depth.set(child.id, (depth.get(pid) || 0) + 1);
        q.push(child.id);
      }
    }
  }

  const firstLevel = children[root.id] || [];
  const nodes: Node[] = [];
  const positions = new Map<string, {x:number;y:number}>();
  positions.set(root.id, { x: 760, y: 380 });

  nodes.push({
    id: root.id,
    type: "brain",
    position: { x: 760, y: 380 },
    data: { ...root, level: 0 },
  });

  const rootRadius = 360;
  firstLevel.forEach((n: any, i: number) => {
    const angle = (-Math.PI / 2) + (i / Math.max(1, firstLevel.length)) * Math.PI * 2;
    const p = {
      x: 760 + Math.cos(angle) * rootRadius,
      y: 380 + Math.sin(angle) * rootRadius,
    };
    positions.set(n.id, p);
    nodes.push({
      id: n.id,
      type: "brain",
      position: p,
      data: { ...n, level: 1 },
    });

    const second = children[n.id] || [];
    const perp = { x: -Math.sin(angle), y: Math.cos(angle) };
    const branchBase = { x: p.x + Math.cos(angle) * 300, y: p.y + Math.sin(angle) * 300 };

    second.forEach((child: any, j: number) => {
      const offset = (j - (second.length - 1) / 2) * 125;
      const cp = {
        x: branchBase.x + perp.x * offset,
        y: branchBase.y + perp.y * offset,
      };
      positions.set(child.id, cp);
      nodes.push({
        id: child.id,
        type: "brain",
        position: cp,
        data: { ...child, level: 2 },
      });
    });
  });

  // Include any deeper nodes in a stable fallback ring instead of referencing
  // the nodes array while it is still being constructed.
  const already = new Set(nodes.map(n => n.id));
  const deeper = items.filter((n: any) => !already.has(n.id));
  deeper.forEach((n: any, i: number) => {
    const angle = (i / Math.max(1, deeper.length)) * Math.PI * 2;
    nodes.push({
      id: n.id,
      type: "brain",
      position: { x: 760 + Math.cos(angle) * 900, y: 380 + Math.sin(angle) * 900 },
      data: { ...n, level: Math.min(3, depth.get(n.id) || 2) },
    });
  });

  const edges: Edge[] = items
    .filter((n: any) => n.parent)
    .map((n: any) => ({
      id: `${n.parent}-${n.id}`,
      source: n.parent,
      target: n.id,
      type: "bezier",
      animated: true,
      style: { strokeWidth: depth.get(n.id) === 1 ? 3 : 1.7 },
    }));

  return (
    <div className="mind-map-frame">
      <div className="mind-map-toolbar">
        <div>
          <div className="eyebrow">Neural knowledge map</div>
          <div className="mind-map-heading">Start with the big idea. Follow the branches. Open the examples.</div>
        </div>
        <div className="mind-map-hint">Drag · scroll to zoom · pan · use controls</div>
      </div>
      <div className="mind-map-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          nodesDraggable
          nodesConnectable={false}
          panOnDrag
          zoomOnScroll
          zoomOnDoubleClick
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={22} size={1} />
          <Controls />
          <MiniMap nodeColor={(n: any) => n.data?.level === 0 ? "#111" : n.data?.level === 1 ? "#666" : "#c2c2ba"} pannable zoomable />
        </ReactFlow>
      </div>
    </div>
  );
}
