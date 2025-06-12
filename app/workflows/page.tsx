import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface WorkflowModel { // Interface name can remain as it's not directly user-facing
  id: string;
  name: string;
  description: string;
  category: string;
  version: number;
  lastModified: string;
}

const initialWorkflowTemplates: WorkflowModel[] = [ // Variable name updated for clarity
  {
    id: 'wf-001',
    name: 'Employee Onboarding',
    description: 'Standard process for onboarding new hires, including IT setup, HR paperwork, and initial training.',
    category: 'HR',
    version: 2,
    lastModified: '2024-10-15',
  },
  {
    id: 'wf-002',
    name: 'Purchase Requisition',
    description: 'Process for requesting and approving purchases over $500, including budget checks and vendor selection.',
    category: 'Finance',
    version: 1,
    lastModified: '2024-11-01',
  },
  {
    id: 'wf-003',
    name: 'Software Development Bug Lifecycle',
    description: 'Defines the stages a bug goes through from reporting to resolution and verification.',
    category: 'IT',
    version: 3,
    lastModified: '2024-09-20',
  },
  {
    id: 'wf-004',
    name: 'Marketing Campaign Approval',
    description: 'Workflow for planning, reviewing, and launching new marketing campaigns.',
    category: 'Marketing',
    version: 1,
    lastModified: '2024-11-05',
  },
];

const WorkflowsPage = () => {
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowModel[]>(initialWorkflowTemplates); // State variable name updated
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowModel | null>(null); // Keep internal name
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null);

  // State for Create New Workflow Template Dialog
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [newWorkflowCategory, setNewWorkflowCategory] = useState('');
  const [newWorkflowVersion, setNewWorkflowVersion] = useState(1);

  // State for Edit Workflow Template Dialog
  const [editWorkflowName, setEditWorkflowName] = useState('');
  const [editWorkflowDescription, setEditWorkflowDescription] = useState('');
  const [editWorkflowCategory, setEditWorkflowCategory] = useState('');
  const [editWorkflowVersion, setEditWorkflowVersion] = useState(1);

  const handleSaveNewWorkflowTemplate = () => {
    if (!newWorkflowName || !newWorkflowCategory) {
      alert('Please fill in at least Name and Category for the new workflow template.');
      return;
    }
    const newTemplate: WorkflowModel = { // Internal variable can be newTemplate
      id: `wf-tpl-${Date.now()}`, // Prefix changed for template
      name: newWorkflowName,
      description: newWorkflowDescription,
      category: newWorkflowCategory,
      version: newWorkflowVersion,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setWorkflowTemplates([newTemplate, ...workflowTemplates]);
    setIsCreateDialogOpen(false);
    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setNewWorkflowCategory('');
    setNewWorkflowVersion(1);
  };

  const handleOpenEditDialog = (template: WorkflowModel) => { // Parameter name updated
    setEditingWorkflow(template);
    setEditWorkflowName(template.name);
    setEditWorkflowDescription(template.description);
    setEditWorkflowCategory(template.category);
    setEditWorkflowVersion(template.version);
    setIsEditDialogOpen(true);
  };

  const handleUpdateWorkflowTemplate = () => {
    if (!editingWorkflow || !editWorkflowName || !editWorkflowCategory) {
      alert('Please fill in at least Name and Category for the workflow template.');
      return;
    }
    const updatedTemplate: WorkflowModel = { // Internal variable can be updatedTemplate
      ...editingWorkflow,
      name: editWorkflowName,
      description: editWorkflowDescription,
      category: editWorkflowCategory,
      version: editWorkflowVersion,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setWorkflowTemplates(
      workflowTemplates.map((tpl) => // map variable updated
        tpl.id === editingWorkflow.id ? updatedTemplate : tpl
      )
    );
    setIsEditDialogOpen(false);
    setEditingWorkflow(null);
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingWorkflow(null);
    }
  };

  const handleDeleteWorkflowTemplate = () => {
    if (deletingWorkflowId) {
      setWorkflowTemplates(
        workflowTemplates.filter((tpl) => tpl.id !== deletingWorkflowId) // filter variable updated
      );
      setDeletingWorkflowId(null);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>
              Manage and define your organization's workflow templates.
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Workflow Template</DialogTitle>
                <DialogDescription>
                  Fill in the details below to define a new workflow template.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newName" className="text-right">Name</Label>
                  <Input id="newName" value={newWorkflowName} onChange={(e) => setNewWorkflowName(e.target.value)} className="col-span-3" placeholder="e.g., Employee Onboarding" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newDescription" className="text-right">Description</Label>
                  <Textarea id="newDescription" value={newWorkflowDescription} onChange={(e) => setNewWorkflowDescription(e.target.value)} className="col-span-3" placeholder="Describe the purpose and steps of this workflow template." />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newCategory" className="text-right">Category</Label>
                  <Select value={newWorkflowCategory} onValueChange={setNewWorkflowCategory}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newVersion" className="text-right">Version</Label>
                  <Input id="newVersion" type="number" value={newWorkflowVersion} onChange={(e) => setNewWorkflowVersion(parseFloat(e.target.value) || 1)} className="col-span-3" min="1" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleSaveNewWorkflowTemplate}>Save Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowTemplates.map((template) => ( // map variable updated
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>{template.version}</TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell className="space-x-2">
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(template)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setDeletingWorkflowId(template.id)}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Workflow Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Workflow Template</DialogTitle>
            <DialogDescription>
              Update the details of your workflow template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">Name</Label>
              <Input id="editName" value={editWorkflowName} onChange={(e) => setEditWorkflowName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDescription" className="text-right">Description</Label>
              <Textarea id="editDescription" value={editWorkflowDescription} onChange={(e) => setEditWorkflowDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCategory" className="text-right">Category</Label>
              <Select value={editWorkflowCategory} onValueChange={setEditWorkflowCategory}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editVersion" className="text-right">Version</Label>
              <Input id="editVersion" type="number" value={editWorkflowVersion} onChange={(e) => setEditWorkflowVersion(parseFloat(e.target.value) || 1)} className="col-span-3" min="1" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleUpdateWorkflowTemplate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingWorkflowId} onOpenChange={(open) => !open && setDeletingWorkflowId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              workflow template. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingWorkflowId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkflowTemplate}>
              Yes, delete template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkflowsPage;
