// BASED ON THE ROLES ALL PERMISSIONS ARE DEFINED HERE
export type Role = "admin" | "supervisor" | "associate"

// ADDRESS AND USER INTERFACES
export interface Address {
   id: string
   street: string
   city: string
   state: string
   zipCode: string
}

export interface User {
   id: string
   fullName: string
   email: string
   phone: string
   addresses: Address[]
   role: Role
   createdAt: string
   updatedAt: string
   isActive?: boolean
}

// FORM DATA INTERFACES
export interface UserFormData {
   fullName: string
   email: string
   phone: string
   addresses: Omit<Address, "id">[]
   role?: Role
}

// AUTHENTICATION CONTEXT INTERFACES
export interface LoginCredentials {
   username: string
   password: string
}

export interface AuthContextType {
   user: User | null
   login: (credentials: LoginCredentials) => Promise<boolean>
   logout: () => void
   isAuthenticated: boolean
}

// USER CONTEXT INTERFACES AND PERMISSIONS
export interface Permission {
   canAdd: boolean
   canEdit: boolean
   canView: boolean
}

export const ROLE_PERMISSIONS: Record<Role, Permission> = {
   admin: {
      canAdd: true,
      canEdit: true,
      canView: true,
   },
   supervisor: {
      canAdd: false,
      canEdit: true,
      canView: true,
   },
   associate: {
      canAdd: false,
      canEdit: false,
      canView: true,
   },
}
