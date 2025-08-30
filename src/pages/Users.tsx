import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useUsers } from "../context/UserContext"
import { UserList } from "../../packages/user-list/src/UserList"
import { UserProfileForm } from "../../packages/user-profile-form/src/UserProfileForm"
import { User, UserFormData } from "../types"
import "./Users.css"

export const Users: React.FC = () => {
   const { user: currentUser } = useAuth()
   const { users, addUser, updateUser, deleteUser, checkEmailExists } = useUsers()

   const [showForm, setShowForm] = useState(false)
   const [editingUser, setEditingUser] = useState<User | null>(null)
   const [viewingUser, setViewingUser] = useState<User | null>(null)
   const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create")

   if (!currentUser) {
      return <div>Loading...</div>
   }

   const handleCreateUser = () => {
      setFormMode("create")
      setEditingUser(null)
      setShowForm(true)
   }

   const handleEditUser = (user: User) => {
      setFormMode("edit")
      setEditingUser(user)
      setShowForm(true)
   }

   const handleViewUser = (user: User) => {
      setFormMode("view")
      setViewingUser(user)
      setShowForm(true)
   }

   const handleDeleteUser = (userId: string) => {
      if (
         window.confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
         )
      ) {
         deleteUser(userId)
      }
   }

   const handleFormSubmit = (userData: UserFormData) => {
      if (formMode === "create") {
         addUser(userData)
      } else if (formMode === "edit" && editingUser) {
         updateUser(editingUser.id, userData)
      }
      setShowForm(false)
      setEditingUser(null)
   }

   const handleFormCancel = () => {
      setShowForm(false)
      setEditingUser(null)
      setViewingUser(null)
   }

   const handleEmailValidation = (email: string): string | undefined => {
      if (formMode === "create") {
         if (checkEmailExists(email)) {
            return "Email already exists. Please use a different email address."
         }
      } else if (formMode === "edit" && editingUser) {
         if (checkEmailExists(email, editingUser.id)) {
            return "Email already exists. Please use a different email address."
         }
      }
      return undefined
   }

   const getInitialData = (): UserFormData | undefined => {
      if (formMode === "edit" && editingUser) {
         return {
            fullName: editingUser.fullName,
            email: editingUser.email,
            phone: editingUser.phone,
            addresses: editingUser.addresses,
            role: editingUser.role,
         }
      }
      if (formMode === "view" && viewingUser) {
         return {
            fullName: viewingUser.fullName,
            email: viewingUser.email,
            phone: viewingUser.phone,
            addresses: viewingUser.addresses,
            role: viewingUser.role,
         }
      }
      return undefined
   }

   return (
      <div className='users-page'>
         <div className='users-header'>
            <h1>User Management</h1>
            {currentUser.role === "admin" && (
               <button onClick={handleCreateUser} className='create-user-btn'>
                  + Create New User
               </button>
            )}
         </div>

         <div className='users-content'>
            <UserList
               users={users}
               role={currentUser.role}
               onEdit={handleEditUser}
               onView={handleViewUser}
               onDelete={currentUser.role === "admin" ? handleDeleteUser : undefined}
            />
         </div>

         {showForm && (
            <div className='modal-overlay'>
               <div className='modal-content'>
                  <UserProfileForm
                     mode={formMode}
                     initialData={getInitialData()}
                     onSubmit={handleFormSubmit}
                     onCancel={handleFormCancel}
                     showRoleSelector={formMode === "edit" || formMode === "create"}
                     onEmailValidation={handleEmailValidation}
                  />
               </div>
            </div>
         )}
      </div>
   )
}
