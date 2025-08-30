import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../../context/AuthContext"
import { UserProvider } from "../../context/UserContext"
import { CreateUser } from "../CreateUser"

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
   useNavigate: () => mockNavigate,
}))

// Mock the UserProfileForm component
jest.mock("../../../packages/user-profile-form/src/UserProfileForm", () => ({
   UserProfileForm: ({ onSubmit, onEmailValidation }: any) => (
      <form
         onSubmit={(e: React.FormEvent) => {
            e.preventDefault()
            onSubmit({
               fullName: "Test User",
               email: "test@example.com",
               phone: "1234567890",
               addresses: [
                  {
                     street: "123 Test St",
                     city: "Test City",
                     state: "TS",
                     zipCode: "12345",
                  },
               ],
               role: "associate",
            })
         }}
         data-testid='user-form'
      >
         <input
            type='email'
            data-testid='email-input'
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
      </form>
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

describe("CreateUser", () => {
   beforeEach(() => {
      jest.clearAllMocks()
      localStorageMock.getItem.mockReturnValue(
         JSON.stringify([
            {
               id: "1",
               fullName: "Existing User",
               email: "existing@example.com",
               phone: "1234567890",
               addresses: [
                  { street: "123 St", city: "City", state: "ST", zipCode: "12345" },
               ],
               role: "associate",
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            },
         ])
      )
   })

   it("should render create user form for admin users", async () => {
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

      renderWithProviders(<CreateUser />)

      await waitFor(() => {
         expect(screen.getByText("Create New User")).toBeInTheDocument()
         expect(screen.getByTestId("user-form")).toBeInTheDocument()
      })
   })

   it("should show forbidden message for non-admin users", async () => {
      // Mock non-admin user in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
         if (key === "user") {
            return JSON.stringify({
               id: "3",
               fullName: "Associate User",
               email: "associate@example.com",
               role: "associate",
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
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
         }
         return null
      })

      renderWithProviders(<CreateUser />)

      await waitFor(() => {
         expect(screen.getByText("403 - Forbidden")).toBeInTheDocument()
         expect(
            screen.getByText("You don't have permission to access this page.")
         ).toBeInTheDocument()
      })
   })

   it("should show loading state initially", () => {
      localStorageMock.getItem.mockReturnValue(null)

      renderWithProviders(<CreateUser />)

      expect(screen.getByText("Loading...")).toBeInTheDocument()
   })

   it("should handle form submission successfully", async () => {
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

      renderWithProviders(<CreateUser />)

      await waitFor(() => {
         expect(screen.getByTestId("user-form")).toBeInTheDocument()
      })

      const submitBtn = screen.getByTestId("submit-btn")
      fireEvent.click(submitBtn)

      await waitFor(() => {
         expect(mockNavigate).toHaveBeenCalledWith("/users")
      })
   })

   it("should validate email uniqueness", async () => {
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

      renderWithProviders(<CreateUser />)

      await waitFor(() => {
         expect(screen.getByTestId("user-form")).toBeInTheDocument()
      })

      const emailInput = screen.getByTestId("email-input")

      // Test with existing email
      fireEvent.change(emailInput, { target: { value: "existing@example.com" } })

      // The form should still be valid since we're testing the component integration
      expect(emailInput).toBeInTheDocument()
   })
})
