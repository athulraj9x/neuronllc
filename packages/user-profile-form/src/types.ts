export interface Address {
   id?: string
   street: string
   city: string
   state: string
   zipCode: string
}

export interface UserFormData {
   fullName: string
   email: string
   phone: string
   addresses: Address[]
   role?: "admin" | "supervisor" | "associate"
}

export interface AddressErrors {
   street?: string
   city?: string
   state?: string
   zipCode?: string
}

export interface FormErrors {
   fullName?: string
   email?: string
   phone?: string
   addresses?: AddressErrors[]
   role?: string
}

export type FormMode = "create" | "edit" | "view"

export interface UserProfileFormProps {
   mode: FormMode
   initialData?: UserFormData
   onSubmit: (data: UserFormData) => void
   onCancel?: () => void
   showRoleSelector?: boolean
   onEmailValidation?: (email: string) => string | undefined
}
