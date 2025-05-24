"use client"

import { useState, useEffect, useRef } from "react"
import { Edit, Lock, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define interface for user data from API
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Separate modal states for create and edit
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Separate form data for create and edit
  const [createFormData, setCreateFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  })
  
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  })
  
  // Separate current user state for edit
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Separate form errors for create and edit
  const [createFormError, setCreateFormError] = useState<string | null>(null)
  const [editFormError, setEditFormError] = useState<string | null>(null)
  
  // Separate submission states
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  // Delete user states
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Reusable function to fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

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
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role)
    }

    setFilteredUsers(filtered)
  }

  // Format the created_at date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      
      // Check if today
      const today = new Date()
      if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
      
      // Check if yesterday
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
      
      // Otherwise return formatted date
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (e) {
      return dateString || 'Unknown'
    }
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

  // Create modal handlers
  const handleAddNewUser = () => {
    setCreateFormData({
      username: '',
      email: '',
      role: 'user',
      password: '',
    })
    setCreateFormError(null)
    setIsCreateModalOpen(true)
  }
  
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCreateRoleChange = (value: string) => {
    setCreateFormData(prev => ({
      ...prev,
      role: value
    }))
  }
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateFormError(null)
    setIsCreateSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setCreateFormError("Authentication token not found. Please log in again.")
        return
      }
      
      // Create new user via POST
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createFormData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setIsCreateModalOpen(false)
        fetchUsers() // Refresh user list
      } else {
        throw new Error(data.message || 'Operation failed')
      }
    } catch (err) {
      console.error(`Error creating user:`, err)
      setCreateFormError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsCreateSubmitting(false)
    }
  }

  // Edit modal handlers
  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // Empty password means it won't be updated
    })
    setEditFormError(null)
    setIsEditModalOpen(true)
  }
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleEditRoleChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      role: value
    }))
  }
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditFormError(null)
    setIsEditSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setEditFormError("Authentication token not found. Please log in again.")
        return
      }
      
      if (!currentUser) {
        setEditFormError("No user selected for editing.")
        return
      }
      
      // Update existing user via PUT
      const updateData: Record<string, string> = {
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role,
      }
      
      // Only include password if provided
      if (editFormData.password) {
        updateData.password = editFormData.password
      }
      
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setIsEditModalOpen(false)
        setTimeout(() => {
          setCurrentUser(null)
          setEditFormData({
            username: '',
            email: '',
            role: 'user',
            password: '',
          })
          setEditFormError(null)
          document.body.style.pointerEvents = ''
        }, 500)
        fetchUsers() // Refresh user list
      } else {
        throw new Error(data.message || 'Operation failed')
      }
    } catch (err) {
      console.error(`Error updating user:`, err)
      setEditFormError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  // Delete user handlers
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setDeleteError(null)
    setIsDeleteAlertOpen(true)
  }
  
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setDeleteError("Authentication token not found. Please log in again.");
        return;
      }
      
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsDeleteAlertOpen(false);
        fetchUsers(); // Refresh user list
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(`Error deleting user:`, err);
      setDeleteError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  // Add this ref to track component mount status
  const isMountedRef = useRef(true);
  
  // Add this effect to handle component unmounting
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Add this effect to forcefully clean up any lingering modal effects
  useEffect(() => {
    if (!isEditModalOpen) {
      // Force reset body styles that might be left by the Dialog
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
      
      // Find and remove any backdrop elements that might be left
      const backdrop = document.querySelector('[data-dialog-backdrop]');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }, [isEditModalOpen]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-md text-gray-500 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <PrimaryButton size="large" aria-label="Add new user" onClick={handleAddNewUser}>
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
            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <table className="w-full" aria-label="Users table">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Username</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 hidden md:table-cell text-xs sm:text-sm">
                      Email
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Role</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 hidden lg:table-cell text-xs sm:text-sm">
                      Creation Date
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <div className="font-medium text-xs sm:text-sm">{user.username}</div>
                          <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell text-xs sm:text-sm">{user.email}</td>
                        <td className="py-2 px-3 text-xs sm:text-sm">{getRoleBadge(user.role)}</td>
                        <td className="py-2 px-3 hidden lg:table-cell text-xs sm:text-sm">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700"
                                aria-label={`Actions for ${user.username}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600"
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )))
                  : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
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

      {/* Create User Modal */}
      <Dialog 
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isCreateSubmitting) {
            setIsCreateModalOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              {createFormError && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {createFormError}
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-username" className="text-right">
                  Username
                </Label>
                <Input
                  id="create-username"
                  name="username"
                  value={createFormData.username}
                  onChange={handleCreateInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="create-email"
                  name="email"
                  type="email"
                  value={createFormData.email}
                  onChange={handleCreateInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-password" className="text-right">
                  Password
                </Label>
                <Input
                  id="create-password"
                  name="password"
                  type="password"
                  value={createFormData.password}
                  onChange={handleCreateInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-role" className="text-right">
                  Role
                </Label>
                <Select 
                  value={createFormData.role} 
                  onValueChange={handleCreateRoleChange}
                >
                  <SelectTrigger id="create-role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Basic User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <OutlineButton 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreateSubmitting}
              >
                Cancel
              </OutlineButton>
              <PrimaryButton type="submit" disabled={isCreateSubmitting}>
                {isCreateSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog 
        open={isEditModalOpen}
        onOpenChange={(open) => {
          // Only allow state changes if not submitting
          if (!isEditSubmitting) {
            setIsEditModalOpen(open);
            
            // If closing the modal, reset state after a short delay
            if (!open) {
              setTimeout(() => {
                setCurrentUser(null);
                setEditFormData({
                  username: '',
                  email: '',
                  role: 'user',
                  password: '',
                });
                setEditFormError(null);
                document.body.style.pointerEvents = '';
              }, 500);
            }
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            // Prevent interaction while submitting
            if (isEditSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {editFormError && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {editFormError}
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  Username
                </Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Password
                </Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                  placeholder="(leave empty to keep current)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={handleEditRoleChange}
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Basic User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <OutlineButton 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isEditSubmitting) {
                    setIsEditModalOpen(false);
                  }
                }}
                disabled={isEditSubmitting}
              >
                Cancel
              </OutlineButton>
              <PrimaryButton type="submit" disabled={isEditSubmitting}>
                {isEditSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteAlertOpen(open);
            if (!open) {
              setTimeout(() => {
                setUserToDelete(null);
                document.body.style.pointerEvents = '';
              }, 500);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <strong> {userToDelete?.username}</strong> from the system.
              {deleteError && (
                <div className="mt-2 text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {deleteError}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteUser();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
