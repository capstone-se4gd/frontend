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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-md text-gray-500 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <PrimaryButton size="large" aria-label="Add new user">
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="text-md">Add New User</span>
          </PrimaryButton>
        </div>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                aria-hidden="true"
              />
              <Input
                placeholder="Search users..."
                className="pl-10 w-full text-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search users"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <OutlineButton
                onClick={() => handleRoleFilter(null)}
                className={`text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 ${!roleFilter ? "bg-gray-100" : ""}`}
                aria-pressed={!roleFilter}
              >
                All Roles
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("admin")}
                className={`text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 ${roleFilter === "admin" ? "bg-gray-100" : ""}`}
                aria-pressed={roleFilter === "admin"}
              >
                Admins
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("manager")}
                className={`text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 ${roleFilter === "manager" ? "bg-gray-100" : ""}`}
                aria-pressed={roleFilter === "manager"}
              >
                Managers
              </OutlineButton>
              <OutlineButton
                onClick={() => handleRoleFilter("user")}
                className={`text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 ${roleFilter === "user" ? "bg-gray-100" : ""}`}
                aria-pressed={roleFilter === "user"}
              >
                Users
              </OutlineButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Users table">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 hidden md:table-cell text-xs sm:text-sm">
                    Email
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Role</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 hidden lg:table-cell text-xs sm:text-sm">
                    Last Active
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="font-medium text-xs sm:text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                      </td>
                      <td className="py-2 px-3 hidden md:table-cell text-xs sm:text-sm">{user.email}</td>
                      <td className="py-2 px-3 text-xs sm:text-sm">{getRoleBadge(user.role)}</td>
                      <td className="py-2 px-3 hidden lg:table-cell text-xs sm:text-sm">{user.lastActive}</td>
                      <td className="py-2 px-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 text-gray-500 hover:text-gray-700"
                              aria-label={`Actions for ${user.name}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs sm:text-sm">
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
                    <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-flow-col w-full">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b text-sm">
                <span>Total Users</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm">
                <span>Administrators</span>
                <span className="font-medium">{users.filter((u) => u.role === "admin").length}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm">
                <span>Managers</span>
                <span className="font-medium">{users.filter((u) => u.role === "manager").length}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm">
                <span>Basic Users</span>
                <span className="font-medium">{users.filter((u) => u.role === "user").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
