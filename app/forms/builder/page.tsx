import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  AlignLeft,
  ChevronDownSquare,
  CheckSquare,
  RadioTower,
  CalendarDays,
  Paperclip,
  Save,
  GripVertical,
} from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { FormDefinition, FormFieldDefinition } from '@/lib/definitions'; // Import canonical definitions
import { generateId } from '@/lib/utils'; // Import centralized generateId

// This interface is for palette items. It's slightly different from FormFieldDefinition
// as it's a template for creating fields.
interface PaletteFieldType {
  id: string; // ID for the draggable item in palette
  name: string; // Name displayed in palette
  icon: JSX.Element;
  type: string; // Technical type (e.g., 'text', 'textarea')
  defaultLabel: string; // Default label for a new field of this type
}

const initialPaletteFieldTypes: PaletteFieldType[] = [
  { id: 'type-single-line', name: 'Single-line text', icon: <FileText className="h-4 w-4 mr-2" />, type: 'text', defaultLabel: 'Single-line text' },
  { id: 'type-multi-line', name: 'Multi-line text area', icon: <AlignLeft className="h-4 w-4 mr-2" />, type: 'textarea', defaultLabel: 'Multi-line text area' },
  { id: 'type-dropdown', name: 'Dropdown list', icon: <ChevronDownSquare className="h-4 w-4 mr-2" />, type: 'select', defaultLabel: 'Dropdown list' },
  { id: 'type-checkboxes', name: 'Checkboxes', icon: <CheckSquare className="h-4 w-4 mr-2" />, type: 'checkbox-group', defaultLabel: 'Checkboxes' },
  { id: 'type-radio', name: 'Radio buttons', icon: <RadioTower className="h-4 w-4 mr-2" />, type: 'radio-group', defaultLabel: 'Radio buttons' },
  { id: 'type-date', name: 'Date picker', icon: <CalendarDays className="h-4 w-4 mr-2" />, type: 'date', defaultLabel: 'Date picker' },
  { id: 'type-file', name: 'File attachment', icon: <Paperclip className="h-4 w-4 mr-2" />, type: 'file', defaultLabel: 'File attachment' },
];


const FormBuilderPage = () => {
  const [canvasFields, setCanvasFields] = useState<FormFieldDefinition[]>([]); // Use FormFieldDefinition
  const [formName, setFormName] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'palette' && destination.droppableId === 'canvas') {
      const draggedFieldType = initialPaletteFieldTypes[source.index];
      const newField: FormFieldDefinition = {
        // Properties from PaletteFieldType
        id: draggedFieldType.id, // This is the type ID from palette, not instance ID
        name: draggedFieldType.name, // Name from palette (e.g. "Single-line text")
        type: draggedFieldType.type,
        icon: draggedFieldType.icon, // Keep icon for display on canvas, though not in official FormFieldDefinition for API

        // Properties specific to FormFieldDefinition
        instanceId: generateId('field'),
        label: draggedFieldType.defaultLabel, // Use defaultLabel
        required: false,
        placeholder: `Enter ${draggedFieldType.name.toLowerCase()}`,
        options: (['select', 'checkbox-group', 'radio-group'].includes(draggedFieldType.type)) ? ['Option 1', 'Option 2'] : undefined,
      };
      const newCanvasFields = Array.from(canvasFields);
      newCanvasFields.splice(destination.index, 0, newField);
      setCanvasFields(newCanvasFields);
      setSelectedFieldId(newField.instanceId);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      if (source.index === destination.index) return;
      const newCanvasFields = Array.from(canvasFields);
      const [removed] = newCanvasFields.splice(source.index, 1);
      newCanvasFields.splice(destination.index, 0, removed);
      setCanvasFields(newCanvasFields);
    }
  };

  const handleFieldPropertyChange = (fieldInstanceId: string, property: keyof FormFieldDefinition, value: any) => {
    setCanvasFields(prevFields =>
      prevFields.map(f =>
        f.instanceId === fieldInstanceId
          ? { ...f, [property]: value }
          : f
      )
    );
  };

  const handleSaveForm = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name.');
      return;
    }
    if (canvasFields.length === 0) {
      alert('Cannot save an empty form. Please add fields to the canvas.');
      return;
    }

    // Prepare fields for saving, potentially stripping temporary UI properties like 'icon' if not in FormFieldDefinition
    const fieldsToSave = canvasFields.map(field => {
      const { icon, ...rest } = field; // Exclude 'icon' if it's not part of the canonical FormFieldDefinition
      return rest as Omit<FormFieldDefinition, 'icon'>; // Ensure it matches the stripped type
    });


    const formDefinition: FormDefinition = {
      id: generateId('form'),
      name: formName.trim(),
      fields: fieldsToSave as FormFieldDefinition[], // Cast if necessary, ensure compatibility
      createdAt: new Date().toISOString(),
      version: 1,
    };

    try {
      const existingFormsString = localStorage.getItem('savedForms');
      const savedFormsList: FormDefinition[] = existingFormsString ? JSON.parse(existingFormsString) : [];
      savedFormsList.push(formDefinition);
      localStorage.setItem('savedForms', JSON.stringify(savedFormsList));
      alert(`Form "${formDefinition.name}" saved successfully!`);

      setFormName('');
      setCanvasFields([]);
      setSelectedFieldId(null);

    } catch (error) {
      console.error("Error saving form to localStorage:", error);
      alert("Failed to save form. Check console for details.");
    }
  };

  const currentSelectedField = canvasFields.find(f => f.instanceId === selectedFieldId);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 md:p-8 h-screen flex flex-col">
        <Card className="flex-grow flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle>Custom Form Builder</CardTitle>
              <CardDescription>Design and build your custom forms by dragging fields onto the canvas.</CardDescription>
            </div>
            <Button onClick={handleSaveForm}>
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex p-0">
            <div className="flex flex-1">
              {/* Left Panel: Field Palette */}
              <Droppable droppableId="palette" isDropDisabled={true}>
                {(provided: DroppableProvided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/4 p-4 border-r bg-slate-50/50">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Field Types</h3>
                    <div className="space-y-2">
                      {initialPaletteFieldTypes.map((field, index) => ( // Use initialPaletteFieldTypes
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(providedDraggable: DraggableProvided, snapshot) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              className={`p-2 border rounded-md flex items-center cursor-grab ${snapshot.isDragging ? 'bg-blue-100 shadow-lg' : 'bg-white hover:bg-slate-100'}`}
                            >
                              {field.icon}
                              <span>{field.name}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>

              {/* Center Panel: Form Canvas */}
              <Droppable droppableId="canvas">
                {(provided: DroppableProvided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-6 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white'}`}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setSelectedFieldId(null);
                    }}
                  >
                    <div className="mb-6">
                      <Label htmlFor="formName" className="text-sm font-medium text-slate-700">Form Name</Label>
                      <Input type="text" id="formName" placeholder="Enter form name or title" className="mt-1" value={formName} onChange={(e) => setFormName(e.target.value)} />
                    </div>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg min-h-[60vh] bg-slate-50 p-4 space-y-2">
                      {canvasFields.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-center text-slate-500 py-10">Drop fields here to build your form.</p>
                      )}
                      {canvasFields.map((field, index) => ( // field is FormFieldDefinition
                        <Draggable key={field.instanceId} draggableId={field.instanceId} index={index}>
                          {(providedDraggable: DraggableProvided, snapshotDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              onClick={() => setSelectedFieldId(field.instanceId)}
                              className={`p-3 border rounded-md shadow-sm flex items-center justify-between cursor-pointer ${snapshotDraggable.isDragging ? 'bg-slate-200' : 'bg-white'} ${selectedFieldId === field.instanceId ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-300'}`}
                            >
                              <div className="flex items-center flex-grow">
                                <span {...providedDraggable.dragHandleProps} className="p-1 cursor-grab mr-2">
                                  <GripVertical className="h-5 w-5 text-slate-500" />
                                </span>
                                {field.icon} {/* Icon is still used for display on canvas */}
                                <span className="ml-2 flex-grow">{field.label}</span>
                                {field.required && <span className="ml-2 text-red-500 text-xs">(Required)</span>}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>

              {/* Right Panel: Field Properties */}
              <div className="w-1/4 p-4 border-l bg-slate-50/50 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Field Properties</h3>
                {currentSelectedField ? ( // currentSelectedField is FormFieldDefinition
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Field Type:</Label>
                      {/* 'name' is from palette type, not necessarily in FormFieldDefinition if stripped for saving */}
                      <p className="text-sm text-slate-600 mt-1 bg-slate-100 p-2 rounded-md">{currentSelectedField.name}</p>
                    </div>
                    <div>
                      <Label htmlFor="fieldLabelProp" className="text-sm font-medium text-slate-700">Label</Label>
                      <Input
                        type="text"
                        id="fieldLabelProp"
                        value={currentSelectedField.label}
                        onChange={(e) => handleFieldPropertyChange(currentSelectedField.instanceId, 'label', e.target.value)}
                        className="mt-1 bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="fieldRequiredProp"
                        checked={currentSelectedField.required}
                        onCheckedChange={(checked) => handleFieldPropertyChange(currentSelectedField.instanceId, 'required', checked as boolean)}
                      />
                      <Label htmlFor="fieldRequiredProp" className="text-sm font-medium text-slate-700">Required</Label>
                    </div>

                    {(currentSelectedField.type === 'text' || currentSelectedField.type === 'textarea') && (
                      <div>
                        <Label htmlFor="fieldPlaceholderProp" className="text-sm font-medium text-slate-700">Placeholder</Label>
                        <Input
                          type="text"
                          id="fieldPlaceholderProp"
                          value={currentSelectedField.placeholder || ''}
                          onChange={(e) => handleFieldPropertyChange(currentSelectedField.instanceId, 'placeholder', e.target.value)}
                          className="mt-1 bg-white"
                        />
                      </div>
                    )}

                    {(currentSelectedField.type === 'select' || currentSelectedField.type === 'checkbox-group' || currentSelectedField.type === 'radio-group') && (
                      <div>
                        <Label htmlFor="fieldOptionsProp" className="text-sm font-medium text-slate-700">Options</Label>
                        <Textarea
                          id="fieldOptionsProp"
                          value={(currentSelectedField.options || []).join('\n')}
                          onChange={(e) => handleFieldPropertyChange(currentSelectedField.instanceId, 'options', e.target.value.split('\n'))}
                          className="mt-1 bg-white min-h-[80px]"
                          placeholder="Enter each option on a new line"
                        />
                        <p className="text-xs text-slate-500 mt-1">Enter each option on a new line.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 p-4 border border-slate-200 rounded-md bg-white text-center">
                    <p className="text-sm text-slate-500">Select a field from the canvas to edit its properties.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  );
};

export default FormBuilderPage;
