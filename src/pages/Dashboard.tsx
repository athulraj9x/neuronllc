import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useUsers } from "../context/UserContext"
import { ROLE_PERMISSIONS } from "../types"
import "./Dashboard.css"
import { Link } from "react-router-dom"

interface SystemStats {
   totalUsers: number
   activeUsers: number
   newUsersThisMonth: number
   systemStatus: string
}

interface ActivityItem {
   id: string
   type: "user_created" | "user_updated" | "user_logged_in" | "user_deleted"
   title: string
   description: string
   icon: string
   timestamp: number
   userId?: string
   userName?: string
}

export const Dashboard: React.FC = () => {
   const { user } = useAuth()
   const { users } = useUsers()
   const [systemStats, setSystemStats] = useState<SystemStats>({
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      systemStatus: "Healthy",
   })
   const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])

   useEffect(() => {
      localStorage.removeItem("dashboard_system_stats")
      loadDashboardData()
   }, [users])

   const loadDashboardData = () => {
      updateSystemStats()

      const storedActivities = localStorage.getItem("dashboard_recent_activities")
      if (storedActivities) {
         setRecentActivities(JSON.parse(storedActivities))
      } else {
         initializeDefaultActivities()
      }
   }

   const updateSystemStats = () => {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const totalUsers = Array.isArray(users) ? users.length : 0
      const activeUsers = Array.isArray(users)
         ? users.filter((u) => u.isActive !== false).length
         : 0
      const newUsersThisMonth = Array.isArray(users)
         ? users.filter((u) => {
              const userDate = new Date(u.createdAt || Date.now())
              return (
                 userDate.getMonth() === currentMonth &&
                 userDate.getFullYear() === currentYear
              )
           }).length
         : 0

      console.log("Dashboard Stats Calculation:", {
         usersArray: users,
         totalUsers,
         activeUsers,
         newUsersThisMonth,
         currentMonth,
         currentYear,
      })

      const newStats: SystemStats = {
         totalUsers,
         activeUsers,
         newUsersThisMonth,
         systemStatus: "Healthy",
      }

      setSystemStats(newStats)
      localStorage.setItem("dashboard_system_stats", JSON.stringify(newStats))
   }

   const initializeDefaultActivities = () => {
      const defaultActivities: ActivityItem[] = [
         {
            id: "1",
            type: "user_logged_in",
            title: "System initialized",
            description: "Dashboard system started",
            icon: "",
            timestamp: Date.now() - 1000 * 60 * 60 * 2,
         },
      ]

      setRecentActivities(defaultActivities)
      localStorage.setItem(
         "dashboard_recent_activities",
         JSON.stringify(defaultActivities)
      )
   }

   if (!user) {
      return <div>Loading...</div>
   }

   const permissions = ROLE_PERMISSIONS[user.role]

   const getWelcomeMessage = () => {
      switch (user.role) {
         case "admin":
            return "Welcome, Administrator! You have full access to all system features."
         case "supervisor":
            return "Welcome, Supervisor! You can view and edit user profiles."
         case "associate":
            return "Welcome, Associate! You can view user profiles and manage your own profile."
         default:
            return "Welcome to the User Management System!"
      }
   }

   const getQuickActions = () => {
      const actions: Array<{
         title: string
         description: string
         icon: string
         link: string
      }> = []

      if (permissions.canAdd) {
         actions.push({
            title: "Create New User",
            description: "Add a new user to the system",
            icon: "",
            link: "/create-user",
         })
      }

      if (permissions.canView) {
         actions.push({
            title: "View Users",
            description: "Browse and manage user profiles",
            icon: "",
            link: "/users",
         })
      }

      if (user.role === "associate") {
         actions.push({
            title: "My Profile",
            description: "View and edit your profile information",
            icon: "",
            link: "/my-profile",
         })
      }

      return actions
   }

   const formatTimestamp = (timestamp: number) => {
      const now = Date.now()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 1) return "Just now"
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`

      return new Date(timestamp).toLocaleDateString()
   }

   const quickActions = getQuickActions()

   return (
      <div className='dashboard'>
         <div className='dashboard-header'>
            <h1>Dashboard</h1>
            <div className='user-info'>
               <span className='user-role'>{user.role}</span>
               <span className='user-name'>{user.fullName}</span>
            </div>
         </div>

         <div className='welcome-section'>
            <div className='welcome-card'>
               <h2>Hello, {user.fullName}! </h2>
               <p>{getWelcomeMessage()}</p>
            </div>
         </div>

         <div className='dashboard-content'>
            <div className='stats-section'>
               <h3>System Overview</h3>
               <div className='stats-grid'>
                  <div className='stat-card'>
                     <div className='stat-icon'></div>
                     <div className='stat-content'>
                        <div className='stat-number'>{systemStats.totalUsers}</div>
                        <div className='stat-label'>Total Users</div>
                     </div>
                  </div>

                  <div className='stat-card'>
                     <div className='stat-icon'></div>
                     <div className='stat-content'>
                        <div className='stat-number'>{systemStats.activeUsers}</div>
                        <div className='stat-label'>Active Users</div>
                     </div>
                  </div>

                  <div className='stat-card'>
                     <div className='stat-icon'></div>
                     <div className='stat-content'>
                        <div className='stat-number'>{systemStats.newUsersThisMonth}</div>
                        <div className='stat-label'>New This Month</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className='quick-actions-section'>
               <h3>Quick Actions</h3>
               <div className='actions-grid'>
                  {quickActions.map((action, index) => (
                     <div key={index} className='action-card'>
                        <Link to={action?.link || ""}>
                           <div className='action-icon'>{action?.icon}</div>
                           <div className='action-content'>
                              <h4>{action?.title}</h4>
                              <p>{action?.description}</p>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            </div>

            <div className='recent-activity-section'>
               <h3>Recent Activity</h3>
               <div className='activity-list'>
                  {recentActivities.length > 0 ? (
                     recentActivities.map((activity) => (
                        <div key={activity.id} className='activity-item'>
                           <div className='activity-icon'>{activity.icon}</div>
                           <div className='activity-content'>
                              <div className='activity-title'>{activity.title}</div>
                              <div className='activity-time'>
                                 {formatTimestamp(activity.timestamp)}
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className='no-activity'>
                        <p>No recent activity</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
