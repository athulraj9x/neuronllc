import React, { useState, useEffect } from "react"
import {
   UserProfileFormProps,
   UserFormData,
   Address,
   FormErrors,
   AddressErrors,
} from "./types"
import "./UserProfileForm.css"

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
   mode,
   initialData,
   onSubmit,
   onCancel,
   showRoleSelector = false,
   onEmailValidation,
}) => {
   const [formData, setFormData] = useState<UserFormData>({
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      addresses: initialData?.addresses || [
         { street: "", city: "", state: "", zipCode: "" },
      ],
      role: initialData?.role || "associate",
   })

   const [errors, setErrors] = useState<FormErrors>({})

   useEffect(() => {
      if (initialData) {
         setFormData(initialData)
      }
   }, [initialData])

   const validateForm = (): boolean => {
      const newErrors: FormErrors = {}

      if (!formData.fullName.trim()) {
         newErrors.fullName = "Full name is required"
      }

      if (!formData.email.trim()) {
         newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = "Invalid email format"
      } else if (onEmailValidation) {
         const emailError = onEmailValidation(formData.email)
         if (emailError) {
            newErrors.email = emailError
         }
      }

      if (!formData.phone.trim()) {
         newErrors.phone = "Phone number is required"
      } else if (formData.phone.trim().length < 10) {
         newErrors.phone = "Phone number must be at least 10 digits"
      }

      if (showRoleSelector && (mode === "create" || mode === "edit") && !formData.role) {
         newErrors.role = "Role is required"
      }

      if (formData.addresses.length === 0) {
         newErrors.addresses = []
      } else {
         newErrors.addresses = formData.addresses.map((address, index) => {
            const addressErrors: AddressErrors = {}
            if (!address.street.trim()) {
               addressErrors.street = "Street is required"
            }
            if (!address.city.trim()) {
               addressErrors.city = "City is required"
            }
            if (!address.state.trim()) {
               addressErrors.state = "State is required"
            }
            if (!address.zipCode.trim()) {
               addressErrors.zipCode = "Zip code is required"
            }
            return addressErrors
         })
      }

      setErrors(newErrors)

      const hasErrors =
         !!newErrors.fullName ||
         !!newErrors.email ||
         !!newErrors.phone ||
         !!newErrors.role ||
         newErrors.addresses?.some((addr) => Object.keys(addr).length > 0)

      return !hasErrors
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      // Additional email validation before submission
      if (onEmailValidation && formData.email.trim()) {
         const emailError = onEmailValidation(formData.email)
         if (emailError) {
            setErrors((prev) => ({ ...prev, email: emailError }))
            return
         }
      }

      if (validateForm()) {
         onSubmit(formData)
      }
   }

   const handleInputChange = (field: keyof UserFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
         setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
   }

   const handleAddressChange = (index: number, field: keyof Address, value: string) => {
      const newAddresses = [...formData.addresses]
      newAddresses[index] = { ...newAddresses[index], [field]: value }
      setFormData((prev) => ({ ...prev, addresses: newAddresses }))

      if (errors.addresses && errors.addresses[index]) {
         const newAddressErrors = [...errors.addresses]
         newAddressErrors[index] = {}
         setErrors((prev) => ({ ...prev, addresses: newAddressErrors }))
      }
   }

   const addAddress = () => {
      setFormData((prev) => ({
         ...prev,
         addresses: [...prev.addresses, { street: "", city: "", state: "", zipCode: "" }],
      }))
   }

   const removeAddress = (index: number) => {
      if (formData.addresses.length > 1) {
         setFormData((prev) => ({
            ...prev,
            addresses: prev.addresses.filter((_, i) => i !== index),
         }))
      }
   }

   const isReadOnly = mode === "view"

   return (
      <div className='user-profile-form'>
         <h2>
            {mode === "create"
               ? "Create New User"
               : mode === "edit"
               ? "Edit User"
               : "View User"}
         </h2>

         <form onSubmit={handleSubmit}>
            <div className='form-group'>
               <label htmlFor='fullName'>Full Name *</label>
               <input
                  type='text'
                  id='fullName'
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={isReadOnly}
                  className={errors.fullName ? "error" : ""}
               />
               {errors.fullName && (
                  <span className='error-message'>{errors.fullName}</span>
               )}
            </div>

            <div className='form-group'>
               <label htmlFor='email'>Email *</label>
               <input
                  type='email'
                  id='email'
                  value={formData.email}
                  onChange={(e) => {
                     const value = e.target.value
                     setFormData((prev) => ({ ...prev, email: value }))

                     // Clear previous email error
                     if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }))
                     }

                     // Call email validation on every change
                     if (onEmailValidation && value.trim()) {
                        const emailError = onEmailValidation(value)
                        if (emailError) {
                           setErrors((prev) => ({ ...prev, email: emailError }))
                        }
                     }
                  }}
                  disabled={isReadOnly}
                  className={errors.email ? "error" : ""}
               />
               {errors.email && <span className='error-message'>{errors.email}</span>}
            </div>

            <div className='form-group'>
               <label htmlFor='phone'>Phone *</label>
               <input
                  type='tel'
                  id='phone'
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isReadOnly}
                  className={errors.phone ? "error" : ""}
               />
               {errors.phone && <span className='error-message'>{errors.phone}</span>}
            </div>

            {showRoleSelector && (mode === "create" || mode === "edit") && (
               <div className='form-group'>
                  <label htmlFor='role'>Role *</label>
                  <select
                     id='role'
                     value={formData.role || "associate"}
                     onChange={(e) => handleInputChange("role", e.target.value)}
                     disabled={isReadOnly}
                     className={errors.role ? "error" : ""}
                  >
                     <option value='associate'>Associate</option>
                     <option value='supervisor'>Supervisor</option>
                  </select>
                  {errors.role && <span className='error-message'>{errors.role}</span>}
               </div>
            )}

            <div className='form-group'>
               <label>Addresses *</label>
               {formData.addresses.map((address, index) => (
                  <div key={index} className='address-block'>
                     <div className='address-header'>
                        <h4>Address {index + 1}</h4>
                        {!isReadOnly && formData.addresses.length > 1 && (
                           <button
                              type='button'
                              onClick={() => removeAddress(index)}
                              className='remove-address-btn'
                           >
                              Remove
                           </button>
                        )}
                     </div>

                     <div className='address-fields'>
                        <div className='form-group'>
                           <label htmlFor={`street-${index}`}>Street *</label>
                           <input
                              type='text'
                              id={`street-${index}`}
                              value={address.street}
                              onChange={(e) =>
                                 handleAddressChange(index, "street", e.target.value)
                              }
                              disabled={isReadOnly}
                              className={
                                 errors.addresses && errors.addresses[index]?.street
                                    ? "error"
                                    : ""
                              }
                           />
                           {errors.addresses && errors.addresses[index]?.street && (
                              <span className='error-message'>
                                 {errors.addresses[index].street}
                              </span>
                           )}
                        </div>

                        <div className='form-group'>
                           <label htmlFor={`city-${index}`}>City *</label>
                           <input
                              type='text'
                              id={`city-${index}`}
                              value={address.city}
                              onChange={(e) =>
                                 handleAddressChange(index, "city", e.target.value)
                              }
                              disabled={isReadOnly}
                              className={
                                 errors.addresses && errors.addresses[index]?.city
                                    ? "error"
                                    : ""
                              }
                           />
                           {errors.addresses && errors.addresses[index]?.city && (
                              <span className='error-message'>
                                 {errors.addresses[index].city}
                              </span>
                           )}
                        </div>

                        <div className='form-group'>
                           <label htmlFor={`state-${index}`}>State *</label>
                           <input
                              type='text'
                              id={`state-${index}`}
                              value={address.state}
                              onChange={(e) =>
                                 handleAddressChange(index, "state", e.target.value)
                              }
                              disabled={isReadOnly}
                              className={
                                 errors.addresses && errors.addresses[index]?.state
                                    ? "error"
                                    : ""
                              }
                           />
                           {errors.addresses && errors.addresses[index]?.state && (
                              <span className='error-message'>
                                 {errors.addresses[index].state}
                              </span>
                           )}
                        </div>

                        <div className='form-group'>
                           <label htmlFor={`zipCode-${index}`}>Zip Code *</label>
                           <input
                              type='text'
                              id={`zipCode-${index}`}
                              value={address.zipCode}
                              onChange={(e) =>
                                 handleAddressChange(index, "zipCode", e.target.value)
                              }
                              disabled={isReadOnly}
                              className={
                                 errors.addresses && errors.addresses[index]?.zipCode
                                    ? "error"
                                    : ""
                              }
                           />
                           {errors.addresses && errors.addresses[index]?.zipCode && (
                              <span className='error-message'>
                                 {errors.addresses[index].zipCode}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               ))}

               {!isReadOnly && (
                  <button type='button' onClick={addAddress} className='add-address-btn'>
                     + Add Another Address
                  </button>
               )}
            </div>

            <div className='form-actions'>
               {!isReadOnly && (
                  <>
                     <button type='submit' className='submit-btn'>
                        {mode === "create" ? "Create User" : "Update User"}
                     </button>
                     {onCancel && (
                        <button type='button' onClick={onCancel} className='cancel-btn'>
                           Cancel
                        </button>
                     )}
                  </>
               )}
               {isReadOnly && onCancel && (
                  <button type='button' onClick={onCancel} className='cancel-btn'>
                     Close
                  </button>
               )}
            </div>
         </form>
      </div>
   )
}
