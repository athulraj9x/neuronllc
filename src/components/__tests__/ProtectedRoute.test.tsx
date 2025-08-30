import React from "react"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "../ProtectedRoute"

// Mock the useAuth hook
jest.mock("../../context/AuthContext", () => ({
   useAuth: () => ({
      user: null,
      isAuthenticated: false,
   }),
}))

const renderWithRouter = (component: React.ReactElement) => {
   return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("ProtectedRoute", () => {
   it("renders loading state initially", () => {
      renderWithRouter(
         <ProtectedRoute>
            <div>Protected Content</div>
         </ProtectedRoute>
      )

      expect(screen.getByText("Loading authentication...")).toBeInTheDocument()
   })
})
