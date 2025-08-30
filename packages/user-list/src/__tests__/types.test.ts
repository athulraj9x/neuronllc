import { User, Address } from "../types"

describe("UserList Types", () => {
   describe("Address interface", () => {
      it("should have required properties", () => {
         const address: Address = {
            id: "1",
            street: "Sheikh Zayed Road",
            city: "Dubai",
            state: "Dubai",
            zipCode: "00000",
         }

         expect(address.id).toBe("1")
         expect(address.street).toBe("Sheikh Zayed Road")
         expect(address.city).toBe("Dubai")
         expect(address.state).toBe("Dubai")
         expect(address.zipCode).toBe("00000")
      })

      it("should allow optional id", () => {
         const address: Address = {
            street: "Downtown Boulevard",
            city: "Dubai",
            state: "Dubai",
            zipCode: "00000",
         }

         expect(address.street).toBe("Downtown Boulevard")
         expect(address.city).toBe("Dubai")
         expect(address.state).toBe("Dubai")
         expect(address.zipCode).toBe("00000")
      })
   })

   describe("User interface", () => {
      it("should have all required properties", () => {
         const user: User = {
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
         }

         expect(user.id).toBe("1")
         expect(user.fullName).toBe("Ahmed Al Mansoori")
         expect(user.email).toBe("ahmed@dubai.com")
         expect(user.phone).toBe("0501234567")
         expect(user.role).toBe("admin")
         expect(user.addresses).toHaveLength(1)
         expect(user.createdAt).toBe("2025-01-01T00:00:00.000Z")
         expect(user.updatedAt).toBe("2025-01-01T00:00:00.000Z")
      })

      it("should allow different role values", () => {
         const adminUser: User = {
            id: "1",
            fullName: "Admin User",
            email: "admin@dubai.com",
            phone: "0501234567",
            role: "admin",
            addresses: [],
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
         }

         const supervisorUser: User = {
            id: "2",
            fullName: "Supervisor User",
            email: "supervisor@dubai.com",
            phone: "0559876543",
            role: "supervisor",
            addresses: [],
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
         }

         const associateUser: User = {
            id: "3",
            fullName: "Associate User",
            email: "associate@dubai.com",
            phone: "0567890123",
            role: "associate",
            addresses: [],
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
         }

         expect(adminUser.role).toBe("admin")
         expect(supervisorUser.role).toBe("supervisor")
         expect(associateUser.role).toBe("associate")
      })
   })
})
