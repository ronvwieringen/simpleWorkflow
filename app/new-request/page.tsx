"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, X, Calendar, CheckCircle, AlertCircle, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewRequest() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [date, setDate] = useState<Date>()

  const workflowTypes = [
    {
      id: "equipment-purchase",
      name: "Equipment Purchase Request",
      description: "Request new equipment, hardware, or software for your department",
      icon: "💻",
      category: "Procurement",
      estimatedTime: "3-5 business days",
      approvers: ["Department Manager", "Procurement Team", "Finance"],
    },
    {
      id: "leave-request",
      name: "Leave Request",
      description: "Submit vacation, sick leave, or personal time off requests",
      icon: "🏖️",
      category: "HR",
      estimatedTime: "1-2 business days",
      approvers: ["Direct Manager", "HR Team"],
    },
    {
      id: "security-access",
      name: "Security Access Request",
      description: "Request access to systems, buildings, or restricted areas",
      icon: "🔐",
      category: "Security",
      estimatedTime: "2-3 business days",
      approvers: ["Security Team", "System Administrator"],
    },
    {
      id: "software-license",
      name: "Software License Request",
      description: "Request new software licenses or renewals for business tools",
      icon: "📄",
      category: "IT",
      estimatedTime: "3-4 business days",
      approvers: ["IT Manager", "Finance Team"],
    },
    {
      id: "travel-authorization",
      name: "Travel Authorization",
      description: "Request approval for business travel and related expenses",
      icon: "✈️",
      category: "Travel",
      estimatedTime: "2-4 business days",
      approvers: ["Manager", "Finance", "Travel Coordinator"],
    },
    {
      id: "expense-reimbursement",
      name: "Expense Reimbursement",
      description: "Submit receipts and request reimbursement for business expenses",
      icon: "💳",
      category: "Finance",
      estimatedTime: "5-7 business days",
      approvers: ["Manager", "Finance Team", "Accounting"],
    },
  ]

  // Sample form fields based on selected workflow
  const getFormFields = (workflowId: string) => {
    const formConfigs = {
      "equipment-purchase": [
        {
          id: "item-description",
          type: "text",
          label: "Item Description",
          required: true,
          placeholder: "Describe the equipment you need",
        },
        {
          id: "justification",
          type: "textarea",
          label: "Business Justification",
          required: true,
          placeholder: "Explain why this equipment is needed",
        },
        {
          id: "estimated-cost",
          type: "text",
          label: "Estimated Cost",
          required: true,
          placeholder: "$0.00",
        },
        {
          id: "urgency",
          type: "select",
          label: "Urgency Level",
          required: true,
          options: ["Low", "Medium", "High", "Critical"],
        },
        {
          id: "preferred-vendor",
          type: "text",
          label: "Preferred Vendor (Optional)",
          required: false,
          placeholder: "Enter vendor name if you have a preference",
        },
        {
          id: "attachments",
          type: "file",
          label: "Supporting Documents",
          required: false,
          accept: ".pdf,.doc,.docx,.xls,.xlsx",
        },
      ],
      "leave-request": [
        {
          id: "leave-type",
          type: "radio",
          label: "Leave Type",
          required: true,
          options: ["Vacation", "Sick Leave", "Personal Time", "Bereavement", "Other"],
        },
        {
          id: "start-date",
          type: "date",
          label: "Start Date",
          required: true,
        },
        {
          id: "end-date",
          type: "date",
          label: "End Date",
          required: true,
        },
        {
          id: "reason",
          type: "textarea",
          label: "Reason (Optional)",
          required: false,
          placeholder: "Provide additional details if needed",
        },
        {
          id: "coverage-arrangements",
          type: "textarea",
          label: "Coverage Arrangements",
          required: true,
          placeholder: "Describe how your responsibilities will be covered",
        },
      ],
      "security-access": [
        {
          id: "access-type",
          type: "checkbox",
          label: "Access Type Required",
          required: true,
          options: ["Building Access", "System Access", "Network Drive", "Database Access", "Admin Rights"],
        },
        {
          id: "systems",
          type: "text",
          label: "Specific Systems/Areas",
          required: true,
          placeholder: "List specific systems or areas you need access to",
        },
        {
          id: "business-justification",
          type: "textarea",
          label: "Business Justification",
          required: true,
          placeholder: "Explain why this access is required for your role",
        },
        {
          id: "duration",
          type: "select",
          label: "Access Duration",
          required: true,
          options: ["Permanent", "Temporary (30 days)", "Temporary (90 days)", "Project-based"],
        },
        {
          id: "manager-approval",
          type: "checkbox",
          label: "Confirmations",
          required: true,
          options: ["I have discussed this request with my direct manager"],
        },
      ],
    }
    return formConfigs[workflowId as keyof typeof formConfigs] || []
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting request:", { selectedWorkflow, formData, uploadedFiles })
    // Redirect to success page or dashboard
  }

  const renderFormField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px]"
            />
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id]}
              onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            >
              <SelectTrigger className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={formData[field.id]}
              onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            >
              {field.options.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`} className="text-sm text-slate-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "checkbox":
        return (
          <div key={field.id} className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={(formData[field.id] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const current = formData[field.id] || []
                      const updated = checked ? [...current, option] : current.filter((item: string) => item !== option)
                      setFormData({ ...formData, [field.id]: updated })
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="text-sm text-slate-700">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-slate-200",
                    !formData[field.id] && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData[field.id] ? format(new Date(formData[field.id]), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData[field.id] ? new Date(formData[field.id]) : undefined}
                  onSelect={(date) => setFormData({ ...formData, [field.id]: date?.toISOString() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "file":
        return (
          <div key={field.id} className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-2">Drop files here or click to browse</p>
              <p className="text-xs text-slate-500">Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
              <input
                type="file"
                multiple
                accept={field.accept}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">New Request</h1>
                <p className="text-sm text-slate-600">Create a new workflow request</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                <span className={currentStep === 1 ? "text-slate-900 font-medium" : ""}>Select</span>
                <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                <span className={currentStep === 2 ? "text-slate-900 font-medium" : ""}>Details</span>
                <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                <span className={currentStep === 3 ? "text-slate-900 font-medium" : ""}>Review</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Step 1: Select Workflow */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Request Type</h2>
              <p className="text-slate-600">Select the type of request you'd like to submit</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowTypes.map((workflow) => (
                <Card
                  key={workflow.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedWorkflow === workflow.id
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-slate-200 bg-white/80 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{workflow.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                          {selectedWorkflow === workflow.id && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{workflow.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              {workflow.category}
                            </Badge>
                            <span className="text-slate-500">{workflow.estimatedTime}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            <span className="font-medium">Approvers:</span> {workflow.approvers.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedWorkflow}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Form */}
        {currentStep === 2 && selectedWorkflow && (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Details</h2>
              <p className="text-slate-600">
                Fill out the form below for your {workflowTypes.find((w) => w.id === selectedWorkflow)?.name}
              </p>
            </div>

            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <form className="space-y-6">
                  {getFormFields(selectedWorkflow).map((field) => (
                    <div key={field.id}>{renderFormField(field)}</div>
                  ))}
                </form>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                Review Request
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {currentStep === 3 && selectedWorkflow && (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Request</h2>
              <p className="text-slate-600">Please review your information before submitting</p>
            </div>

            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{workflowTypes.find((w) => w.id === selectedWorkflow)?.icon}</span>
                  <span>{workflowTypes.find((w) => w.id === selectedWorkflow)?.name}</span>
                </CardTitle>
                <CardDescription>
                  Estimated processing time: {workflowTypes.find((w) => w.id === selectedWorkflow)?.estimatedTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getFormFields(selectedWorkflow).map((field) => (
                  <div key={field.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <Label className="text-sm font-medium text-slate-700">{field.label}</Label>
                    <div className="mt-1 text-sm text-slate-900">
                      {field.type === "file" ? (
                        uploadedFiles.length > 0 ? (
                          <div className="space-y-1">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Paperclip className="h-4 w-4 text-slate-500" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">No files uploaded</span>
                        )
                      ) : field.type === "checkbox" ? (
                        (formData[field.id] || []).join(", ") || "None selected"
                      ) : field.type === "date" ? (
                        formData[field.id] ? (
                          format(new Date(formData[field.id]), "PPP")
                        ) : (
                          "Not selected"
                        )
                      ) : (
                        formData[field.id] || "Not provided"
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-1">What happens next?</h4>
                    <p className="text-sm text-emerald-800">
                      Your request will be automatically routed to{" "}
                      {workflowTypes.find((w) => w.id === selectedWorkflow)?.approvers[0]} for initial review. You'll
                      receive email notifications as your request progresses through each approval step.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                Submit Request
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
