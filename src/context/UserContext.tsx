import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User, UserFormData } from "../types"

interface UserContextType {
   users: User[]
   addUser: (userData: UserFormData) => void
   updateUser: (id: string, userData: UserFormData) => void
   deleteUser: (id: string) => void
   getUserById: (id: string) => User | undefined
   checkEmailExists: (email: string, excludeUserId?: string) => boolean
   addDashboardActivity: (activity: {
      type: "user_created" | "user_updated" | "user_deleted"
      title: string
      description: string
      icon: string
      userId?: string
      userName?: string
   }) => void
   updateDashboardStats: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUsers = () => {
   const context = useContext(UserContext)
   if (context === undefined) {
      throw new Error("useUsers must be used within a UserProvider")
   }
   return context
}

interface UserProviderProps {
   children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
   const [users, setUsers] = useState<User[]>([])

   useEffect(() => {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
         try {
            setUsers(JSON.parse(storedUsers))
         } catch (error) {
            console.error("Error parsing stored users:", error)
            localStorage.removeItem("users")
         }
      } else {
         const initialUsers: User[] = [
            {
               id: "1",
               fullName: "associate user",
               email: "associate_user@example.com",
               phone: "+971 9999999999",
               addresses: [
                  {
                     id: "1",
                     street: "VILLA NO 1 DUBAI",
                     city: "dUBAI",
                     state: "DUBAI",
                     zipCode: "000001",
                  },
               ],
               role: "associate",
               createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
               updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
               id: "2",
               fullName: "supervisor user2",
               email: "supervisor_user2@example.com",
               phone: "+971 9999999998",
               addresses: [
                  {
                     id: "2",
                     street: "VILLA NO 2 DUBAI",
                     city: "dUBAI",
                     state: "DUBAI",
                     zipCode: "000001",
                  },
               ],
               role: "supervisor",
               createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
               updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
         ]
         setUsers(initialUsers)
         localStorage.setItem("users", JSON.stringify(initialUsers))
      }
   }, [])

   const saveUsersToStorage = (newUsers: User[]) => {
      localStorage.setItem("users", JSON.stringify(newUsers))
   }

   const addUser = (userData: UserFormData) => {
      const newUser: User = {
         ...userData,
         id: Date.now().toString(),
         role: userData.role || "associate",
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         addresses: userData.addresses.map((addr, index) => ({
            ...addr,
            id: `${Date.now()}-${index}`,
         })),
      }

      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      saveUsersToStorage(updatedUsers)

      addDashboardActivity({
         type: "user_created",
         title: "New user created",
         description: `User ${newUser.fullName} was added to the system`,
         icon: "",
         userId: newUser.id,
         userName: newUser.fullName,
      })
      updateDashboardStats()
   }

   const updateUser = (id: string, userData: UserFormData) => {
      const updatedUsers = users.map((user) => {
         if (user.id === id) {
            return {
               ...user,
               ...userData,
               updatedAt: new Date().toISOString(),
               addresses: userData.addresses.map((addr, index) => ({
                  ...addr,
                  id: (addr as any).id || `${Date.now()}-${index}`,
               })),
            }
         }
         return user
      })

      setUsers(updatedUsers)
      saveUsersToStorage(updatedUsers)
      const updatedUser = updatedUsers.find((u) => u.id === id)
      if (updatedUser) {
         addDashboardActivity({
            type: "user_updated",
            title: "User profile updated",
            description: `Profile for ${updatedUser.fullName} was modified`,
            icon: "",
            userId: updatedUser.id,
            userName: updatedUser.fullName,
         })
         updateDashboardStats()
      }
   }

   const deleteUser = (id: string) => {
      const userToDelete = users.find((user) => user.id === id)
      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)
      saveUsersToStorage(updatedUsers)

      if (userToDelete) {
         addDashboardActivity({
            type: "user_deleted",
            title: "User deleted",
            description: `User ${userToDelete.fullName} was removed from the system`,
            icon: "",
            userId: userToDelete.id,
            userName: userToDelete.fullName,
         })
         updateDashboardStats()
      }
   }

   const getUserById = (id: string) => {
      return users.find((user) => user.id === id)
   }

   const checkEmailExists = (email: string, excludeUserId?: string) => {
      return users.some(
         (user) =>
            user.email.toLowerCase() === email.toLowerCase() && user.id !== excludeUserId
      )
   }

   const addDashboardActivity = (activity: {
      type: "user_created" | "user_updated" | "user_deleted"
      title: string
      description: string
      icon: string
      userId?: string
      userName?: string
   }) => {
      const storedActivities = localStorage.getItem("dashboard_recent_activities")
      const currentActivities = storedActivities ? JSON.parse(storedActivities) : []

      const newActivity = {
         ...activity,
         id: Date.now().toString(),
         timestamp: Date.now(),
      }

      const updatedActivities = [newActivity, ...currentActivities.slice(0, 9)] // Keep only last 10
      localStorage.setItem(
         "dashboard_recent_activities",
         JSON.stringify(updatedActivities)
      )
   }

   const updateDashboardStats = () => {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const totalUsers = users.length
      const activeUsers = users.filter((u) => u.isActive !== false).length
      const newUsersThisMonth = users.filter((u) => {
         const userDate = new Date(u.createdAt)
         return (
            userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear
         )
      }).length

      const newStats = {
         totalUsers,
         activeUsers,
         newUsersThisMonth,
         systemStatus: "Healthy",
      }

      localStorage.setItem("dashboard_system_stats", JSON.stringify(newStats))
   }

   const value: UserContextType = {
      users,
      addUser,
      updateUser,
      deleteUser,
      getUserById,
      checkEmailExists,
      addDashboardActivity,
      updateDashboardStats,
   }

   return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
