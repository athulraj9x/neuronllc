import React from "react"
import { render, act } from "@testing-library/react"
import { UserProvider, useUsers } from "../UserContext"
import { UserFormData } from "../../types"

// Test component to access context
const TestComponent = () => {
   const { users, addUser, updateUser, checkEmailExists } = useUsers()
   return (
      <div>
         <div data-testid='user-count'>{users.length}</div>
         <button
            onClick={() =>
               addUser({
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
            }
            data-testid='add-user'
         >
            Add User
         </button>
         <button
            onClick={() =>
               updateUser("1", {
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
            }
            data-testid='update-user'
         >
            Update User
         </button>
         <div data-testid='email-exists'>
            {checkEmailExists("test@example.com").toString()}
         </div>
         <div data-testid='email-exists-exclude'>
            {checkEmailExists("test@example.com", "1").toString()}
         </div>
      </div>
   )
}

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

describe("UserContext", () => {
   beforeEach(() => {
      jest.clearAllMocks()
      localStorageMock.getItem.mockReturnValue(null)
   })

   it("should initialize with default users when localStorage is empty", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      expect(getByTestId("user-count")).toHaveTextContent("2")
   })

   it("should add a new user successfully", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      act(() => {
         getByTestId("add-user").click()
      })

      expect(getByTestId("user-count")).toHaveTextContent("3")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("users", expect.any(String))
   })

   it("should update an existing user successfully", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      act(() => {
         getByTestId("update-user").click()
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith("users", expect.any(String))
   })

   it("should check if email exists correctly", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      // After adding a user with test@example.com
      act(() => {
         getByTestId("add-user").click()
      })

      expect(getByTestId("email-exists")).toHaveTextContent("true")
   })

   it("should exclude current user when checking email existence for updates", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      // After adding a user with test@example.com
      act(() => {
         getByTestId("add-user").click()
      })

      expect(getByTestId("email-exists-exclude")).toHaveTextContent("true")
   })

   it("should handle localStorage errors gracefully", () => {
      const { getByTestId } = render(
         <UserProvider>
            <TestComponent />
         </UserProvider>
      )

      expect(getByTestId("user-count")).toHaveTextContent("2")
   })
})
