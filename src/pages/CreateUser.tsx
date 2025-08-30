import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useUsers } from "../context/UserContext"
import { UserProfileForm } from "../../packages/user-profile-form/src/UserProfileForm"
import { UserFormData } from "../types"
import "./CreateUser.css"

export const CreateUser: React.FC = () => {
   const { user: currentUser } = useAuth()
   const { addUser, checkEmailExists } = useUsers()
   const navigate = useNavigate()

   if (!currentUser) {
      return <div>Loading...</div>
   }

   // Check if user has permission to create users
   if (currentUser.role !== "admin") {
      return (
         <div className='forbidden-page'>
            <h1>403 - Forbidden</h1>
            <p>You don't have permission to access this page.</p>
            <button onClick={() => navigate("/dashboard")} className='back-btn'>
               Back to Dashboard
            </button>
         </div>
      )
   }

   const handleSubmit = (userData: UserFormData) => {
      addUser(userData)
      navigate("/users")
   }

   const handleCancel = () => {
      navigate("/users")
   }

   const handleEmailValidation = (email: string): string | undefined => {
      if (checkEmailExists(email)) {
         return "Email already exists. Please use a different email address."
      }
      return undefined
   }

   return (
      <div className='create-user-page'>
         <div className='create-user-header'>
            <h1>Create New User</h1>
            <p>Fill in the form below to create a new user profile</p>
         </div>

         <div className='create-user-content'>
            <UserProfileForm
               mode='create'
               onSubmit={handleSubmit}
               onCancel={handleCancel}
               showRoleSelector={true}
               onEmailValidation={handleEmailValidation}
            />
         </div>
      </div>
   )
}
