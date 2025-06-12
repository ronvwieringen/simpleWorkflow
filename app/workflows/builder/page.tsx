import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  PlayCircle,
  UserCheck,
  StopCircle,
  Save,
  Link2,
} from 'lucide-react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node, // React Flow's Node type
  Edge,   // React Flow's Edge type
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowTemplate, WorkflowNodeData, FormDefinition as ImportedFormDefinition } from '@/lib/definitions'; // Import canonical definitions
import { generateId } from '@/lib/utils'; // Import centralized generateId

// Palette Node Type Definition - This is specific to the palette UI
interface PaletteNodeType {
  id: string;
  name: string;
  icon: JSX.Element;
  typeKey: 'start' | 'task' | 'end';
  defaultStepName: string;
}

const initialPaletteNodeTypes: PaletteNodeType[] = [
  { id: 'type-start', name: 'Start Node', icon: <PlayCircle className="h-5 w-5 mr-2" />, typeKey: 'start', defaultStepName: 'Start Workflow' },
  { id: 'type-task', name: 'Task Node', icon: <UserCheck className="h-5 w-5 mr-2" />, typeKey: 'task', defaultStepName: 'New Task' },
  { id: 'type-end', name: 'End Node', icon: <StopCircle className="h-5 w-5 mr-2" />, typeKey: 'end', defaultStepName: 'End Workflow' },
];

const WorkflowBuilderPage = () => {
  // Note: useNodesState<WorkflowNodeData> means the .data property of each Node will be WorkflowNodeData
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [savedForms, setSavedForms] = useState<ImportedFormDefinition[]>([]); // Use imported FormDefinition

  useEffect(() => {
    try {
      const formsString = localStorage.getItem('savedForms');
      if (formsString) {
        const formsData = JSON.parse(formsString) as ImportedFormDefinition[];
        setSavedForms(formsData.filter(form => form.id && form.name));
      }
    } catch (error) {
      console.error("Failed to load or parse forms from localStorage:", error);
      setSavedForms([]);
    }
  }, []);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      if (!sourceNode || !targetNode) return;
      if (targetNode.data.typeKey === 'start') {
        alert("Cannot connect to a Start Node."); return;
      }
      if (sourceNode.data.typeKey === 'end') {
        alert("Cannot connect from an End Node."); return;
      }
      if (params.source === params.target) {
        alert("Cannot connect a node to itself."); return;
      }
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
    },
    [nodes, setEdges]
  );

  const handleAddNode = (nodeType: PaletteNodeType) => {
    if (nodeType.typeKey === 'start' && nodes.some(node => node.data.typeKey === 'start')) {
      alert('Only one Start Node is allowed per workflow.'); return;
    }
    if (nodeType.typeKey === 'end' && nodes.some(node => node.data.typeKey === 'end')) {
      alert('Only one End Node is allowed per workflow.'); return;
    }
    const newNodeId = generateId('node');
    const newNodeReactFlowNode: Node<WorkflowNodeData> = { // Use React Flow's Node type with our data structure
      id: newNodeId,
      type: 'default', // Using default React Flow node type
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 20 },
      data: { // This must match WorkflowNodeData from lib/definitions.ts
        label: nodeType.defaultStepName,
        displayLabel: nodeType.defaultStepName,
        icon: nodeType.icon, // Icon is part of WorkflowNodeData for UI purposes
        typeKey: nodeType.typeKey,
        assigneeType: null,
        assignee: null,
        linkedFormId: null,
        linkedFormName: null,
        defaultStepName: nodeType.defaultStepName,
      },
    };
    setNodes((nds) => nds.concat(newNodeReactFlowNode));
    setSelectedNodeId(newNodeId);
  };

  const handleNodePropertyChange = (nodeId: string, propertyName: keyof WorkflowNodeData, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const newData: WorkflowNodeData = { ...node.data, [propertyName]: value };
          if (propertyName === 'linkedFormId') {
            const form = savedForms.find(f => f.id === value);
            newData.linkedFormName = form ? form.name : null;
          }
          if (propertyName === 'label' || propertyName === 'linkedFormId') {
            let displayLabel = newData.label;
            if (newData.typeKey === 'start' && newData.linkedFormName) {
              displayLabel = `${newData.label} (Form: ${newData.linkedFormName})`;
            }
            newData.displayLabel = displayLabel;
          }
          return { ...node, data: newData };
        }
        return node;
      })
    );
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) { alert('Please enter a workflow template name.'); return; }
    if (nodes.length === 0) { alert('Cannot save an empty workflow.'); return; }
    if (!nodes.some(n => n.data.typeKey === 'start')) { alert('A workflow must have a Start Node.'); return; }
    if (!nodes.some(n => n.data.typeKey === 'end')) { alert('A workflow must have an End Node.'); return; }

    const nodesToSave = nodes.map(node => {
      // Ensure data saved matches WorkflowNodeData, excluding transient UI elements if necessary
      const { icon, displayLabel, ...restOfData } = node.data; // Exclude icon and displayLabel from saved data
      return {
        ...node, // Includes id, position, type (React Flow properties)
        data: { // This should strictly match what WorkflowNodeData expects for persistence
            ...restOfData,
            label: typeof restOfData.label === 'string' ? restOfData.label : restOfData.defaultStepName || 'Unnamed Step',
            // icon is not saved, typeKey, linkedFormId, etc., are part of restOfData
        }
      };
    });

    const workflowDefinition: WorkflowTemplate = { // Use imported WorkflowTemplate
      id: generateId('wftpl'),
      name: workflowName.trim(),
      nodes: nodesToSave, // These are React Flow Node<WorkflowNodeData>[]
      edges: edges,       // These are React Flow Edge[]
      createdAt: new Date().toISOString(),
      version: 1,
    };

    try {
      const existingWorkflowsString = localStorage.getItem('savedWorkflowTemplates');
      const savedWorkflowsList: WorkflowTemplate[] = existingWorkflowsString ? JSON.parse(existingWorkflowsString) : [];
      savedWorkflowsList.push(workflowDefinition);
      localStorage.setItem('savedWorkflowTemplates', JSON.stringify(savedWorkflowsList));
      alert(`Workflow Template "${workflowDefinition.name}" saved successfully!`);
      setWorkflowName(''); setNodes([]); setEdges([]); setSelectedNodeId(null);
    } catch (error) {
      console.error("Error saving workflow template:", error);
      alert("Failed to save workflow template.");
    }
  };

  const currentSelectedNode = nodes.find(node => node.id === selectedNodeId);
  const selectedFormName = currentSelectedNode?.data.typeKey === 'start' && currentSelectedNode.data.linkedFormId
    ? savedForms.find(f => f.id === currentSelectedNode.data.linkedFormId)?.name
    : null;

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNodeId(node.id);
  }, []);

  const reactFlowNodes = nodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      label: (
        <div className="flex items-center text-sm">
          {React.cloneElement(n.data.icon, { className: "mr-1 h-4 w-4" })}
          <span className="truncate max-w-[120px]">{n.data.displayLabel}</span>
        </div>
      ),
    },
  }));

  return (
      <div className="p-4 md:p-8 h-screen flex flex-col">
        <Card className="flex-grow flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div><CardTitle>Visual Workflow Builder</CardTitle><CardDescription>Design and build workflow templates.</CardDescription></div>
            <Button onClick={handleSaveWorkflow}><Save className="h-4 w-4 mr-2" />Save Workflow Template</Button>
          </CardHeader>
          <CardContent className="flex-grow flex p-0"><div className="flex flex-1 h-full">
              <div className="w-64 p-4 border-r bg-slate-50/50 space-y-2">
                <h3 className="text-lg font-semibold mb-2 text-slate-800">Node Types</h3>
                {initialPaletteNodeTypes.map((nodeType) => (
                  <Button key={nodeType.id} variant="outline" className="w-full justify-start" onClick={() => handleAddNode(nodeType)}>
                    {nodeType.icon}{nodeType.name}
                  </Button>
                ))}
              </div>
              <div className="flex-1 h-full"><ReactFlow
                  nodes={reactFlowNodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                  onConnect={onConnect} onNodeClick={onNodeClick} fitView>
                  <Controls /><Background />
              </ReactFlow></div>
              <div className="w-80 p-4 border-l bg-slate-50/50 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Node Properties</h3>
                {currentSelectedNode ? ( // currentSelectedNode is Node<WorkflowNodeData>
                  <div className="space-y-4">
                    <div><Label>Node Type:</Label><p className="text-sm bg-slate-100 p-2 rounded-md mt-1">
                        {initialPaletteNodeTypes.find(nt => nt.typeKey === currentSelectedNode.data.typeKey)?.name || 'Unknown'}
                    </p></div>
                    <div><Label htmlFor="propStepName">Step Name</Label><Input id="propStepName" type="text"
                        value={currentSelectedNode.data.label as string} // data.label is the editable step name string
                        onChange={(e) => handleNodePropertyChange(currentSelectedNode.id, 'label', e.target.value)}
                        className="mt-1 bg-white" />
                    </div>
                    {currentSelectedNode.data.typeKey === 'start' && (<div>
                        <Label htmlFor="propLinkedForm">Linked Form</Label>
                        <Select value={currentSelectedNode.data.linkedFormId || ''}
                          onValueChange={(value) => handleNodePropertyChange(currentSelectedNode.id, 'linkedFormId', value === 'none' ? null : value)}>
                          <SelectTrigger className="mt-1 bg-white"><SelectValue placeholder="Select a form..." /></SelectTrigger>
                          <SelectContent><SelectItem value="none">None</SelectItem>
                            {savedForms.map(form => (<SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        {selectedFormName && (<p className="text-xs text-slate-600 mt-1">Selected: <span className="font-medium">{selectedFormName}</span></p>)}
                        {savedForms.length === 0 && <p className="text-xs text-slate-500 mt-1">No forms found.</p>}
                    </div>)}
                    {currentSelectedNode.data.typeKey === 'task' && (<><div>
                        <Label htmlFor="propAssigneeType">Assignee Type</Label>
                        <Select value={currentSelectedNode.data.assigneeType || ''}
                          onValueChange={(value) => handleNodePropertyChange(currentSelectedNode.id, 'assigneeType', value === 'none' ? null : value as 'user' | 'role')}>
                          <SelectTrigger className="mt-1 bg-white"><SelectValue placeholder="Select type..." /></SelectTrigger>
                          <SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="user">User</SelectItem><SelectItem value="role">Role</SelectItem></SelectContent>
                        </Select></div>
                        <div><Label htmlFor="propAssignee">Assignee</Label><Input id="propAssignee" type="text" placeholder="User ID or Role Name"
                            value={currentSelectedNode.data.assignee || ''}
                            onChange={(e) => handleNodePropertyChange(currentSelectedNode.id, 'assignee', e.target.value)}
                            className="mt-1 bg-white" disabled={!currentSelectedNode.data.assigneeType} />
                        </div></>
                    )}
                  </div>
                ) : (<div className="text-center text-sm text-slate-500 mt-4 p-4 border rounded-md bg-white">Select a node to edit.</div>)}
              </div>
            </div></CardContent>
        </Card>
      </div>
  );
};

export default WorkflowBuilderPage;
