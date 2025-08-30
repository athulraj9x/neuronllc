import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { UserList } from "../UserList"
import { User } from "../types"

const mockUsers: User[] = [
   {
      id: "1",
      fullName: "Ahmed Al Mansoori",
      email: "ahmed@dubai.com",
      phone: "0501234567",
      role: "admin",
      addresses: [
         {
            id: "1",
            street: "Sheikh Zayed Road",
            city: "Dubai",
            state: "Dubai",
            zipCode: "00000",
         },
      ],
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
   },
   {
      id: "2",
      fullName: "Fatima Al Rashid",
      email: "fatima@dubai.com",
      phone: "0559876543",
      role: "supervisor",
      addresses: [
         {
            id: "2",
            street: "Downtown Boulevard",
            city: "Dubai",
            state: "Dubai",
            zipCode: "00000",
         },
      ],
      createdAt: "2025-01-02T00:00:00.000Z",
      updatedAt: "2025-01-02T00:00:00.000Z",
   },
]

const mockProps = {
   users: mockUsers,
   onEdit: jest.fn(),
   onDelete: jest.fn(),
   onView: jest.fn(),
   role: "admin" as const,
}

describe("UserList (Dubai Context)", () => {
   beforeEach(() => {
      jest.clearAllMocks()
   })

   describe("Rendering", () => {
      it("should render user list with Dubai users", () => {
         render(<UserList {...mockProps} />)

         expect(screen.getByText("Ahmed Al Mansoori")).toBeInTheDocument()
         expect(screen.getByText("ahmed@dubai.com")).toBeInTheDocument()
         expect(screen.getByText("0501234567")).toBeInTheDocument()
         expect(screen.getByText("Fatima Al Rashid")).toBeInTheDocument()
         expect(screen.getByText("fatima@dubai.com")).toBeInTheDocument()
      })

      it("should display user roles correctly", () => {
         render(<UserList {...mockProps} />)

         expect(screen.getByText("admin")).toBeInTheDocument()
         expect(screen.getByText("supervisor")).toBeInTheDocument()
      })

      it("should show address information", () => {
         render(<UserList {...mockProps} />)

         expect(screen.getAllByText("1 address")).toHaveLength(2)
      })
   })

   describe("User Interactions", () => {
      it("should call onEdit when edit button is clicked", async () => {
         const user = userEvent.setup()
         render(<UserList {...mockProps} />)

         const editButtons = screen.getAllByRole("button", { name: /✏️/i })
         await user.click(editButtons[0])

         expect(mockProps.onEdit).toHaveBeenCalledWith(mockUsers[0])
      })

      it("should call onView when view button is clicked", async () => {
         const user = userEvent.setup()
         render(<UserList {...mockProps} />)

         const viewButtons = screen.getAllByRole("button", { name: /👁️/i })
         await user.click(viewButtons[0])

         expect(mockProps.onView).toHaveBeenCalledWith(mockUsers[0])
      })

      it("should call onDelete when delete button is clicked", async () => {
         const user = userEvent.setup()
         render(<UserList {...mockProps} />)

         const deleteButtons = screen.getAllByRole("button", { name: /🗑️/i })
         await user.click(deleteButtons[0])

         expect(mockProps.onDelete).toHaveBeenCalledWith(mockUsers[0].id)
      })
   })

   describe("Permissions", () => {
      it("should show all action buttons for admin users", () => {
         render(<UserList {...mockProps} role='admin' />)

         expect(screen.getAllByRole("button", { name: /✏️/i })).toHaveLength(2)
         expect(screen.getAllByRole("button", { name: /👁️/i })).toHaveLength(2)
         expect(screen.getAllByRole("button", { name: /🗑️/i })).toHaveLength(2)
      })

      it("should hide delete buttons for non-admin users", () => {
         render(<UserList {...mockProps} role='supervisor' />)

         expect(screen.getAllByRole("button", { name: /✏️/i })).toHaveLength(2)
         expect(screen.getAllByRole("button", { name: /👁️/i })).toHaveLength(2)
         expect(screen.queryByRole("button", { name: /🗑️/i })).not.toBeInTheDocument()
      })

      it("should hide edit buttons for associate users", () => {
         render(<UserList {...mockProps} role='associate' />)

         expect(screen.queryByRole("button", { name: /✏️/i })).not.toBeInTheDocument()
         expect(screen.getAllByRole("button", { name: /👁️/i })).toHaveLength(2)
         expect(screen.queryByRole("button", { name: /🗑️/i })).not.toBeInTheDocument()
      })
   })

   describe("Empty State", () => {
      it("should display message when no users exist", () => {
         render(<UserList {...mockProps} users={[]} />)

         expect(screen.getByText(/no users found/i)).toBeInTheDocument()
      })
   })

   describe("Accessibility", () => {
      it("should have proper table structure", () => {
         render(<UserList {...mockProps} />)

         expect(screen.getByRole("table")).toBeInTheDocument()
         expect(screen.getAllByRole("rowgroup")).toHaveLength(2)
      })

      it("should have proper button accessibility", () => {
         render(<UserList {...mockProps} />)

         expect(screen.getAllByTitle("View User")).toHaveLength(2)
         expect(screen.getAllByTitle("Edit User")).toHaveLength(2)
         expect(screen.getAllByTitle("Delete User")).toHaveLength(2)
      })
   })
})
