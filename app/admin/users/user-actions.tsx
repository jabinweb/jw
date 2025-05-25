"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import type { User } from "./columns"

interface UserActionsProps {
  user: User
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter()
  const [openAlert, setOpenAlert] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    action: () => {},
  })
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  })
  const [userData, setUserData] = useState(user)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleRoleChange = (value: string) => {
    setEditFormData(prev => ({ ...prev, role: value as "admin" | "user" }));
  }

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) throw new Error("Failed to update user");
      
      const updatedUser = await response.json();
      
      // Update local state without requiring a page refresh
      setUserData(prev => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }));

      toast({
        title: "User Updated",
        description: "The user information has been updated successfully."
      });
      
      setOpenEditDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user information",
        variant: "destructive"
      });
    }
  }

  const handleAction = async (action: string) => {
    switch (action) {
      case "edit":
        // Refresh form data with current user data to ensure it's up to date
        setEditFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        setOpenEditDialog(true);
        break;
        
      case "changeRole":
        const newRole = userData.role === "admin" ? "user" : "admin";
        setAlertConfig({
          title: `Change Role: ${userData.name}`,
          description: `Are you sure you want to change this user's role from ${userData.role} to ${newRole}?`,
          action: async () => {
            try {
              const response = await fetch(`/api/users/${user.id}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  role: newRole,
                }),
              });

              if (!response.ok) throw new Error("Failed to update role");
              const updatedUser = await response.json();
              
              // Update local state
              setUserData(prev => ({
                ...prev,
                role: updatedUser.role
              }));

              toast({
                title: "Role Updated",
                description: `User role has been changed to ${newRole}`,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
              });
            }
          },
        });
        setOpenAlert(true);
        break;

      case "toggleStatus":
        const newStatus = !userData.isActive;
        setAlertConfig({
          title: userData.isActive ? "Deactivate User" : "Activate User",
          description: `Are you sure you want to ${
            userData.isActive ? "deactivate" : "activate"
          } this user?`,
          action: async () => {
            try {
              const response = await fetch(
                `/api/users/${user.id}/status`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isActive: newStatus }),
                }
              );

              if (!response.ok) throw new Error("Failed to update status");
              const updatedUser = await response.json();
              
              // Update local state
              setUserData(prev => ({
                ...prev,
                isActive: updatedUser.isActive
              }));

              toast({
                title: newStatus ? "User Activated" : "User Deactivated",
                description: `The user has been ${
                  newStatus ? "activated" : "deactivated"
                }`,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update user status",
                variant: "destructive",
              });
            }
          },
        });
        setOpenAlert(true);
        break;
        
      case "resetPassword":
        setAlertConfig({
          title: "Reset Password",
          description:
            "This will send a password reset email to the user. Continue?",
          action: async () => {
            try {
              const response = await fetch(
                `/api/users/${user.id}/reset-password`,
                {
                  method: "POST",
                }
              )

              if (!response.ok) throw new Error("Failed to reset password")

              toast({
                title: "Password Reset Email Sent",
                description: `A password reset link has been sent to ${user.email}`,
              })
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to send password reset email",
                variant: "destructive",
              })
            }
          },
        })
        setOpenAlert(true)
        break;
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleAction("edit")}>
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("changeRole")}>
            {userData.role === "admin" ? "Remove Admin Role" : "Make Admin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("resetPassword")}>
            Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction("toggleStatus")}
            className={userData.isActive ? "text-red-600" : "text-green-600"}
          >
            {userData.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={editFormData.name} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={editFormData.email} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={editFormData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alertConfig.action()
                setOpenAlert(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
