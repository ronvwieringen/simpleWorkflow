import {
  Bell,
  Plus,
  Search,
  ChevronDown,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Dashboard() {
  const myTasks = [
    {
      id: "WF-2024-001",
      title: "Security Access Request",
      requester: "John Smith",
      step: "Security Approval",
      dueDate: "Today",
      priority: "high",
      type: "Security Request",
      progress: 60,
      avatar: "JS",
    },
    {
      id: "WF-2024-003",
      title: "Equipment Purchase Request",
      requester: "Marketing Team",
      step: "Budget Approval",
      dueDate: "Tomorrow",
      priority: "medium",
      type: "Purchase Request",
      progress: 40,
      avatar: "MT",
    },
    {
      id: "WF-2024-007",
      title: "Annual Leave Request",
      requester: "Sarah Johnson",
      step: "Manager Review",
      dueDate: "Dec 15",
      priority: "low",
      type: "Leave Request",
      progress: 25,
      avatar: "SJ",
    },
  ]

  const myRequests = [
    {
      id: "WF-2024-012",
      title: "Office Supplies Procurement",
      status: "In Progress",
      currentStep: "Procurement Review",
      assignee: "Mike Chen",
      submitted: "Dec 10, 2024",
      progress: 75,
    },
    {
      id: "WF-2024-008",
      title: "Software License Renewal",
      status: "Completed",
      currentStep: "Completed",
      assignee: "System",
      submitted: "Dec 8, 2024",
      progress: 100,
    },
    {
      id: "WF-2024-005",
      title: "Conference Attendance Authorization",
      status: "In Progress",
      currentStep: "Budget Approval",
      assignee: "Finance Team",
      submitted: "Dec 5, 2024",
      progress: 50,
    },
  ]

  const availableWorkflows = [
    { name: "Equipment Purchase Request", icon: "💻", category: "Procurement" },
    { name: "Leave Request", icon: "🏖️", category: "HR" },
    { name: "Security Access Request", icon: "🔐", category: "Security" },
    { name: "Software License Request", icon: "📄", category: "IT" },
    { name: "Travel Authorization", icon: "✈️", category: "Travel" },
    { name: "Expense Reimbursement", icon: "💳", category: "Finance" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-transparent">W</span>
                  </div>
                  <h1 className="text-xl font-semibold text-slate-900">WorkFlow Pro</h1>
                </div>
              </div>
              <nav className="hidden md:ml-10 md:flex md:space-x-1">
                <a
                  href="#"
                  className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Workflows
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Analytics
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Administration
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search workflows, requests..."
                  className="pl-10 w-80 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-slate-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-slate-900">John Doe</p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Good morning, John</h2>
              <p className="text-slate-600">You have 3 tasks requiring attention and 2 requests awaiting updates.</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>December 11, 2024</span>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending Tasks</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />2 due today
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Active Requests</p>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <ArrowRight className="h-3 w-3 mr-1" />3 in progress
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    This month
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Avg. Completion</p>
                  <p className="text-2xl font-bold text-slate-900">4.2d</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    15% faster
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* My Tasks */}
          <div className="xl:col-span-3">
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Tasks Requiring Action</CardTitle>
                    <CardDescription className="text-slate-600">
                      Items assigned to you, prioritized by due date
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
                    {myTasks.length} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-medium text-slate-700">Request</TableHead>
                      <TableHead className="font-medium text-slate-700">Requester</TableHead>
                      <TableHead className="font-medium text-slate-700">Current Step</TableHead>
                      <TableHead className="font-medium text-slate-700">Priority</TableHead>
                      <TableHead className="font-medium text-slate-700">Due Date</TableHead>
                      <TableHead className="font-medium text-slate-700">Progress</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{task.title}</p>
                            <p className="text-sm text-slate-500">{task.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                {task.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-700">{task.requester}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-700">{task.step}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-medium ${task.dueDate === "Today" ? "text-red-600" : "text-slate-700"}`}
                          >
                            {task.dueDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={task.progress} className="w-16 h-2" />
                            <span className="text-xs text-slate-500">{task.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                <CardDescription className="text-slate-600">Start a new workflow process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-grey-700 hover:to-white-800 text-white shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel className="text-slate-700">Choose Workflow Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableWorkflows.map((workflow) => (
                      <DropdownMenuItem key={workflow.name} className="flex items-center space-x-3 py-3 asChild">
                        <Link href="/new-request">
                          <span className="text-lg">{workflow.icon}</span>
                          <div>
                            <p className="font-medium text-slate-900">{workflow.name}</p>
                            <p className="text-xs text-slate-500">{workflow.category}</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-slate-700 border-slate-200">
                    <FileText className="h-4 w-4 mr-1" />
                    Templates
                  </Button>
                  <Button variant="outline" size="sm" className="text-slate-700 border-slate-200">
                    <User className="h-4 w-4 mr-1" />
                    Delegates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Requests Summary */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">My Requests</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    View All
                  </Button>
                </div>
                <CardDescription className="text-slate-600">Recent requests you've submitted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900 text-sm mb-1">{request.title}</h5>
                        <p className="text-xs text-slate-500">{request.id}</p>
                      </div>
                      <Badge className={`text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{request.currentStep}</span>
                        <span className="text-slate-500">{request.progress}%</span>
                      </div>
                      <Progress value={request.progress} className="h-1.5" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Assigned to {request.assignee}</span>
                        <span>{request.submitted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
