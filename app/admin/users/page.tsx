"use client"

import { useState } from "react"
import { Edit, Lock, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock user data
const MOCK_USERS = [
  {
    id: "user-001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "admin",
    status: "active",
    lastActive: "Today at 10:30 AM",
  },
  {
    id: "user-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "manager",
    status: "active",
    lastActive: "Yesterday at 3:45 PM",
  },
  {
    id: "user-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "user",
    status: "active",
    lastActive: "Oct 15, 2023",
  },
  {
    id: "user-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    status: "inactive",
    lastActive: "Sep 28, 2023",
  },
  {
    id: "user-005",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "manager",
    status: "active",
    lastActive: "Today at 9:15 AM",
  },
  {
    id: "user-006",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    role: "user",
    status: "pending",
    lastActive: "Never",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [users, setUsers] = useState(MOCK_USERS)
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterUsers(query, roleFilter)
  }

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role)
    filterUsers(searchQuery, role)
  }

  const filterUsers = (query: string, role: string | null) => {
    let filtered = [...users]

    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role)
    }

    setFilteredUsers(filtered)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
      case "user":
        return <Badge className="bg-gray-100 text-gray-800">Basic User</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <PrimaryButton>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </PrimaryButton>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <OutlineButton onClick={() => handleRoleFilter(null)} className={!roleFilter ? "bg-gray-100" : ""}>
                All Roles
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("admin")}
                className={roleFilter === "admin" ? "bg-gray-100" : ""}
              >
                Admins
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("manager")}
                className={roleFilter === "manager" ? "bg-gray-100" : ""}
              >
                Managers
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("user")}
                className={roleFilter === "user" ? "bg-gray-100" : ""}
              >
                Users
              </OutlineButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Last Active</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">{user.email}</td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">{user.lastActive}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Total Users</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Administrators</span>
                <span className="font-medium">{users.filter((u) => u.role === "admin").length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Managers</span>
                <span className="font-medium">{users.filter((u) => u.role === "manager").length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Basic Users</span>
                <span className="font-medium">{users.filter((u) => u.role === "user").length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Active Users</span>
                <span className="font-medium">{users.filter((u) => u.status === "active").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 mr-3"></div>
                  <div className="flex-1">
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-gray-500">Created a new user account</div>
                    <div className="text-xs text-gray-400 mt-1">Today at 10:30 AM</div>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 mr-3"></div>
                  <div className="flex-1">
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Changed role from User to Manager</div>
                    <div className="text-xs text-gray-400 mt-1">Yesterday at 3:45 PM</div>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 mr-3"></div>
                  <div className="flex-1">
                    <div className="font-medium">Robert Wilson</div>
                    <div className="text-sm text-gray-500">Deactivated user Emily Davis</div>
                    <div className="text-xs text-gray-400 mt-1">Oct 15, 2023</div>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 mr-3"></div>
                  <div className="flex-1">
                    <div className="font-medium">System</div>
                    <div className="text-sm text-gray-500">Invited new user Jennifer Lee</div>
                    <div className="text-xs text-gray-400 mt-1">Oct 10, 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
