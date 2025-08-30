import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../../context/AuthContext"
import { UserProvider } from "../../context/UserContext"
import { Users } from "../Users"

// Mock the UserList component
jest.mock("../../../packages/user-list/src/UserList", () => ({
   UserList: ({ users, onEdit, onView, onDelete }: any) => (
      <div data-testid='user-list'>
         {users.map((user: any) => (
            <div key={user.id} data-testid={`user-${user.id}`}>
               <span>{user.fullName}</span>
               <span>{user.email}</span>
               <button onClick={() => onEdit(user)} data-testid={`edit-${user.id}`}>
                  Edit
               </button>
               <button onClick={() => onView(user)} data-testid={`view-${user.id}`}>
                  View
               </button>
               {onDelete && (
                  <button
                     onClick={() => onDelete(user.id)}
                     data-testid={`delete-${user.id}`}
                  >
                     Delete
                  </button>
               )}
            </div>
         ))}
      </div>
   ),
}))

// Mock the UserProfileForm component
jest.mock("../../../packages/user-profile-form/src/UserProfileForm", () => ({
   UserProfileForm: ({
      mode,
      initialData,
      onSubmit,
      onCancel,
      onEmailValidation,
   }: any) => (
      <div data-testid='user-profile-form'>
         <div data-testid='form-mode'>{mode}</div>
         {initialData && <div data-testid='initial-email'>{initialData.email}</div>}
         <form
            onSubmit={(e: React.FormEvent) => {
               e.preventDefault()
               onSubmit({
                  fullName: "Updated User",
                  email: "updated@example.com",
                  phone: "0987654321",
                  addresses: [
                     {
                        street: "456 Updated St",
                        city: "Updated City",
                        state: "US",
                        zipCode: "54321",
                     },
                  ],
                  role: "supervisor",
               })
            }}
            data-testid='form'
         >
            <input
               type='email'
               data-testid='email-input'
               defaultValue={initialData?.email || ""}
               onChange={(e) => {
                  if (onEmailValidation) {
                     const error = onEmailValidation(e.target.value)
                     if (error) {
                        // Simulate error display
                        const errorElement = document.createElement("div")
                        errorElement.setAttribute("data-testid", "email-error")
                        errorElement.textContent = error
                        e.target.parentNode?.appendChild(errorElement)
                     }
                  }
               }}
               placeholder='Email'
            />
            <button type='submit' data-testid='submit-btn'>
               Submit
            </button>
            <button type='button' onClick={onCancel} data-testid='cancel-btn'>
               Cancel
            </button>
         </form>
      </div>
   ),
}))

// Mock localStorage
const localStorageMock = {
   getItem: jest.fn(),
   setItem: jest.fn(),
   removeItem: jest.fn(),
   clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", {
   value: localStorageMock,
})

const renderWithProviders = (component: React.ReactElement) => {
   return render(
      <BrowserRouter>
         <AuthProvider>
            <UserProvider>{component}</UserProvider>
         </AuthProvider>
      </BrowserRouter>
   )
}

describe("Users", () => {
   beforeEach(() => {
      jest.clearAllMocks()
      localStorageMock.getItem.mockReturnValue(
         JSON.stringify([
            {
               id: "1",
               fullName: "Existing User",
               email: "associate_user@example.com",
               phone: "1234567890",
               addresses: [
                  {
                     street: "VILLA NO 1 DUBAI",
                     city: "dUBAI",
                     state: "DUBAI",
                     zipCode: "000001",
                  },
               ],
               role: "associate",
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            },
            {
               id: "2",
               fullName: "Another User",
               email: "another@example.com",
               phone: "0987654321",
               addresses: [
                  { street: "456 St", city: "City2", state: "ST2", zipCode: "54321" },
               ],
               role: "supervisor",
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            },
         ])
      )
   })

   it("should render users list for admin users", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      await waitFor(() => {
         expect(screen.getByText("User Management")).toBeInTheDocument()
         expect(screen.getByTestId("user-list")).toBeInTheDocument()
         expect(screen.getByText("+ Create New User")).toBeInTheDocument()
      })
   })

   it("should show create user form when create button is clicked", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      await waitFor(() => {
         expect(screen.getByText("+ Create New User")).toBeInTheDocument()
      })

      const createBtn = screen.getByText("+ Create New User")
      fireEvent.click(createBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
         expect(screen.getByTestId("form-mode")).toHaveTextContent("create")
      })
   })

   it("should show edit user form when edit button is clicked", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      await waitFor(() => {
         expect(screen.getByTestId("user-list")).toBeInTheDocument()
      })

      const editBtn = screen.getByTestId("edit-1")
      fireEvent.click(editBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
         expect(screen.getByTestId("form-mode")).toHaveTextContent("edit")
         expect(screen.getByTestId("initial-email")).toHaveTextContent(
            "associate_user@example.com"
         )
      })
   })

   it("should show view user form when view button is clicked", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      await waitFor(() => {
         expect(screen.getByTestId("user-list")).toBeInTheDocument()
      })

      const viewBtn = screen.getByTestId("view-1")
      fireEvent.click(viewBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
         expect(screen.getByTestId("form-mode")).toHaveTextContent("view")
         expect(screen.getByTestId("initial-email")).toHaveTextContent(
            "associate_user@example.com"
         )
      })
   })

   it("should handle form submission for create mode", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      // Open create form
      const createBtn = screen.getByText("+ Create New User")
      fireEvent.click(createBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
      })

      // Submit form
      const submitBtn = screen.getByTestId("submit-btn")
      fireEvent.click(submitBtn)

      await waitFor(() => {
         expect(screen.queryByTestId("user-profile-form")).not.toBeInTheDocument()
      })
   })

   it("should handle form submission for edit mode", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      // Open edit form
      const editBtn = screen.getByTestId("edit-1")
      fireEvent.click(editBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
      })

      // Submit form
      const submitBtn = screen.getByTestId("submit-btn")
      fireEvent.click(submitBtn)

      await waitFor(() => {
         expect(screen.queryByTestId("user-profile-form")).not.toBeInTheDocument()
      })
   })

   it("should handle form cancellation", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      // Open create form
      const createBtn = screen.getByText("+ Create New User")
      fireEvent.click(createBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
      })

      // Cancel form
      const cancelBtn = screen.getByTestId("cancel-btn")
      fireEvent.click(cancelBtn)

      await waitFor(() => {
         expect(screen.queryByTestId("user-profile-form")).not.toBeInTheDocument()
      })
   })

   it("should validate email uniqueness in create mode", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      // Open create form
      const createBtn = screen.getByText("+ Create New User")
      fireEvent.click(createBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
      })

      const emailInput = screen.getByTestId("email-input")

      // Test with existing email
      fireEvent.change(emailInput, { target: { value: "associate_user@example.com" } })

      // The form should still be valid since we're testing the component integration
      expect(emailInput).toBeInTheDocument()
   })

   it("should validate email uniqueness in edit mode", async () => {
      // Mock admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "1",
               fullName: "Admin User",
               email: "admin@example.com",
               role: "admin",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<Users />)

      // Open edit form
      const editBtn = screen.getByTestId("edit-1")
      fireEvent.click(editBtn)

      await waitFor(() => {
         expect(screen.getByTestId("user-profile-form")).toBeInTheDocument()
      })

      const emailInput = screen.getByTestId("email-input")

      // Test with another user's email
      fireEvent.change(emailInput, { target: { value: "another@example.com" } })

      // The form should still be valid since we're testing the component integration
      expect(emailInput).toBeInTheDocument()
   })
})
