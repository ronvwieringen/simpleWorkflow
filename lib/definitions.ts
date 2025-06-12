// lib/definitions.ts

import { Node, Edge } from 'reactflow';

// 1. Form Definitions

export interface FormFieldDefinition {
  instanceId: string; // Unique ID for this specific field instance on a form canvas
  id: string;         // ID of the original field type from the palette (e.g., 'type-single-line')
  name: string;       // Display name of the field type (e.g., "Single-line text")
  type: string;       // Technical type identifier (e.g., 'text', 'textarea', 'select')
  icon?: any;         // Icon representation (might be complex, consider how to serialize if needed for API)
  label: string;      // The actual question/label for this field instance
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select, checkbox-group, radio-group
}

export interface FormDefinition {
  id: string; // Unique ID for the saved form
  name: string;
  fields: FormFieldDefinition[];
  createdAt: string;
  version: number;
}

// 2. Workflow Definitions

// Data contained within a React Flow node for a workflow
export interface WorkflowNodeData {
  label: string; // Stores the editable step name
  displayLabel?: string | JSX.Element; // What's actually rendered on the node (can be JSX)
  icon?: any;    // Icon representation (might be complex for serialization)
  typeKey: 'start' | 'task' | 'end';
  assigneeType?: 'user' | 'role' | null;
  assignee?: string | null;
  linkedFormId?: string | null;
  linkedFormName?: string | null; // For display purposes, might not be saved if fetched on load
  defaultStepName?: string; // Fallback step name
}

// Re-exporting React Flow's Node and Edge types for clarity if needed,
// but typically you'd use Node<WorkflowNodeData> directly.
// export type WorkflowNodeRFN = Node<WorkflowNodeData>;
// export type WorkflowEdgeRFN = Edge;

export interface WorkflowTemplate {
  id: string; // Unique ID for the saved workflow template
  name: string;
  nodes: Node<WorkflowNodeData>[]; // Using React Flow's Node type, with our specific data structure
  edges: Edge[];                 // Using React Flow's Edge type
  createdAt: string;
  version: number;
}


// 3. Mock API Interaction Points (Conceptual)

// == Forms API ==
// async function getFormDefinition(formId: string): Promise<FormDefinition | null> { /* ... */ return null; }
// async function saveFormDefinition(formDef: FormDefinition): Promise<FormDefinition> { /* ... */ return formDef; }
// async function getAllFormDefinitions(): Promise<FormDefinition[]> { /* ... */ return []; }
// async function deleteFormDefinition(formId: string): Promise<void> { /* ... */ }

// == Workflow Templates API ==
// async function getWorkflowTemplate(templateId: string): Promise<WorkflowTemplate | null> { /* ... */ return null; }
// async function saveWorkflowTemplate(template: WorkflowTemplate): Promise<WorkflowTemplate> { /* ... */ return template; }
// async function getAllWorkflowTemplates(): Promise<WorkflowTemplate[]> { /* ... */ return []; }
// async function deleteWorkflowTemplate(templateId: string): Promise<void> { /* ... */ }
