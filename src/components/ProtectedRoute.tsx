import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ROLE_PERMISSIONS } from "../types"
import "./ProtectedRoute.css"

interface ProtectedRouteProps {
   children: React.ReactNode
   requiredRole?: "admin" | "supervisor" | "associate"
   requiredPermission?: "canAdd" | "canEdit" | "canView"
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
   children,
   requiredRole,
   requiredPermission,
}) => {
   const { user, isAuthenticated } = useAuth()
   const location = useLocation()

   const [isLoading, setIsLoading] = React.useState(true)

   React.useEffect(() => {
      const timer = setTimeout(() => {
         setIsLoading(false)
      }, 100)
      return () => clearTimeout(timer)
   }, [])

   if (isLoading) {
      return <div className='protected-route-loading'>Loading authentication...</div>
   }

   if (!isAuthenticated) {
      return <Navigate to='/login' state={{ from: location }} replace />
   }

   if (!user) {
      return <Navigate to='/login' replace />
   }

   if (requiredRole && user.role !== requiredRole) {
      if (user.role === "admin") {
         return <>{children}</>
      }

      if (user.role === "supervisor" && requiredRole === "associate") {
         return <>{children}</>
      }

      return <Navigate to='/forbidden' replace />
   }

   if (requiredPermission) {
      const userPermissions = ROLE_PERMISSIONS[user.role]
      if (!userPermissions[requiredPermission]) {
         return <Navigate to='/forbidden' replace />
      }
   }

   return <>{children}</>
}
