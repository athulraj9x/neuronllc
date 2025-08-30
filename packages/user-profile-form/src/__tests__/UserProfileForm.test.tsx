import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { UserProfileForm } from "../UserProfileForm"
import { UserFormData } from "../types"

// Mock data (Dubai context)
const mockUserData: UserFormData = {
   fullName: "Ahmed Al Mansoori",
   email: "ahmed@dubai.com",
   phone: "0501234567",
   addresses: [
      {
         street: "Sheikh Zayed Road",
         city: "Dubai",
         state: "Dubai",
         zipCode: "00000",
      },
   ],
   role: "associate",
}

describe("UserProfileForm (Dubai Context)", () => {
   beforeEach(() => {
      jest.clearAllMocks()
   })

   describe("Rendering", () => {
      it("should render in create mode", () => {
         render(
            <UserProfileForm mode='create' onSubmit={jest.fn()} onCancel={jest.fn()} />
         )

         expect(screen.getByText("Create New User")).toBeInTheDocument()
         expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
         expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
         expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      })

      it("should render in edit mode with initial data", () => {
         render(
            <UserProfileForm
               mode='edit'
               initialData={mockUserData}
               onSubmit={jest.fn()}
               onCancel={jest.fn()}
            />
         )

         expect(screen.getByText("Edit User")).toBeInTheDocument()
         expect(screen.getByDisplayValue("Ahmed Al Mansoori")).toBeInTheDocument()
         expect(screen.getByDisplayValue("ahmed@dubai.com")).toBeInTheDocument()
         expect(screen.getByDisplayValue("0501234567")).toBeInTheDocument()
      })

      it("should render in view mode (read-only)", () => {
         render(
            <UserProfileForm
               mode='view'
               initialData={mockUserData}
               onSubmit={jest.fn()}
               onCancel={jest.fn()}
            />
         )

         expect(screen.getByText("View User")).toBeInTheDocument()
         expect(screen.getByDisplayValue("Ahmed Al Mansoori")).toBeDisabled()
         expect(screen.getByDisplayValue("ahmed@dubai.com")).toBeDisabled()
         expect(screen.getByDisplayValue("0501234567")).toBeDisabled()
      })
   })

   describe("Form Validation", () => {
      it("should show validation errors for empty required fields", async () => {
         const user = userEvent.setup()
         const onSubmit = jest.fn()

         render(
            <UserProfileForm mode='create' onSubmit={onSubmit} onCancel={jest.fn()} />
         )

         const submitButton = screen.getByRole("button", { name: /create user/i })
         await user.click(submitButton)

         await waitFor(() => {
            expect(screen.getByText("Full name is required")).toBeInTheDocument()
            expect(screen.getByText("Email is required")).toBeInTheDocument()
            expect(screen.getByText("Phone number is required")).toBeInTheDocument()
         })

         expect(onSubmit).not.toHaveBeenCalled()
      })
   })

   describe("Form Submission", () => {
      it("should call onSubmit with Dubai user data when valid", async () => {
         const user = userEvent.setup()
         const onSubmit = jest.fn()

         render(
            <UserProfileForm mode='create' onSubmit={onSubmit} onCancel={jest.fn()} />
         )

         // Fill required fields
         await user.type(screen.getByLabelText(/full name/i), "Fatima Al Rashid")
         await user.type(screen.getByLabelText(/email/i), "fatima@dubai.com")
         await user.type(screen.getByLabelText(/phone/i), "0559876543")

         // Address fields
         await user.type(screen.getByLabelText(/street/i), "Downtown Boulevard")
         await user.type(screen.getByLabelText(/city/i), "Dubai")
         await user.type(screen.getByLabelText(/state/i), "Dubai")
         await user.type(screen.getByLabelText(/zip code/i), "00000")

         const submitButton = screen.getByRole("button", { name: /create user/i })
         await user.click(submitButton)

         expect(onSubmit).toHaveBeenCalledWith({
            fullName: "Fatima Al Rashid",
            email: "fatima@dubai.com",
            phone: "0559876543",
            addresses: [
               {
                  street: "Downtown Boulevard",
                  city: "Dubai",
                  state: "Dubai",
                  zipCode: "00000",
               },
            ],
            role: "associate",
         })
      })
   })
})
