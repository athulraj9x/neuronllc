import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User, LoginCredentials, AuthContextType, Role } from "../types"


const DEMO_USERS: Record<string, User> = {
   admin: {
      id: "1",
      fullName: "Admin User",
      email: "admin@example.com",
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
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   },
   supervisor: {
      id: "2",
      fullName: "Supervisor User",
      email: "supervisor@example.com",
      phone: "+971 9999999999",
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   },
   associate: {
      id: "3",
      fullName: "Associate User",
      email: "associate@example.com",
      phone: "+971 9999999999",
      addresses: [
         {
            id: "3",
            street: "VILLA NO 3 DUBAI",
            city: "dUBAI",
            state: "DUBAI",
            zipCode: "000001",
         },
      ],
      role: "associate",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider")
   }
   return context
}

interface AuthProviderProps {
   children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const storedUser = localStorage.getItem("user")
      console.log(
         "AuthContext: Attempting to restore user from localStorage:",
         storedUser
      )

      if (storedUser) {
         try {
            const parsedUser = JSON.parse(storedUser)
            console.log("AuthContext: Successfully parsed user:", parsedUser)

            if (
               parsedUser &&
               parsedUser.id &&
               parsedUser.fullName &&
               parsedUser.email &&
               parsedUser.role &&
               parsedUser.addresses &&
               Array.isArray(parsedUser.addresses)
            ) {
               if (validateStoredUser(parsedUser)) {
                  setUser(parsedUser)
                  console.log("AuthContext: User restored successfully:", parsedUser)
               } else {
                  console.error(
                     "AuthContext: Stored user is no longer valid:",
                     parsedUser
                  )
                  localStorage.removeItem("user")
               }
            } else {
               console.error("AuthContext: Stored user data is incomplete:", parsedUser)
               localStorage.removeItem("user")
            }
         } catch (error) {
            console.error("AuthContext: Error parsing stored user:", error)
            localStorage.removeItem("user")
         }
      } else {
         console.log("AuthContext: No stored user found")
      }

      setIsLoading(false)
   }, [])

   const login = async (credentials: LoginCredentials): Promise<boolean> => {
      const { username, password } = credentials
      console.log("AuthContext: Login attempt for username:", username)

      if (username in DEMO_USERS) {
         const user = DEMO_USERS[username]
         console.log("AuthContext: Login successful for user:", user)

         setUser(user)
         localStorage.setItem("user", JSON.stringify(user))
         console.log("AuthContext: User stored in localStorage")

         const storedActivities = localStorage.getItem("dashboard_recent_activities")
         const currentActivities = storedActivities ? JSON.parse(storedActivities) : []

         const newActivity = {
            id: Date.now().toString(),
            type: "user_logged_in",
            title: "User logged in",
            description: `${user.fullName} logged into the system`,
            icon: "",
            timestamp: Date.now(),
            userId: user.id,
            userName: user.fullName,
         }

         const updatedActivities = [newActivity, ...currentActivities.slice(0, 9)] // Keep only last 10
         localStorage.setItem(
            "dashboard_recent_activities",
            JSON.stringify(updatedActivities)
         )

         return true
      }

      console.log("AuthContext: Login failed - username not found:", username)
      return false
   }

   const logout = () => {
      console.log("AuthContext: Logging out user:", user)
      setUser(null)
      localStorage.removeItem("user")
      console.log("AuthContext: User removed from localStorage")
   }

   const validateStoredUser = (storedUser: User): boolean => {
      const validUser = Object.values(DEMO_USERS).find((u) => u.id === storedUser.id)
      if (validUser) {
         const updatedUser = { ...validUser, ...storedUser }
         localStorage.setItem("user", JSON.stringify(updatedUser))
         return true
      }
      return false
   }

   const value: AuthContextType = {
      user,
      login,
      logout,
      isAuthenticated: !!user,
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
