import { UserFormData, FormMode, Address } from "../types"

describe("Types (Dubai Context)", () => {
   describe("UserFormData", () => {
      it("should have all required properties", () => {
         const userData: UserFormData = {
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

         expect(userData.fullName).toBe("Ahmed Al Mansoori")
         expect(userData.email).toBe("ahmed@dubai.com")
         expect(userData.phone).toBe("0501234567")
         expect(userData.addresses).toHaveLength(1)
         expect(userData.role).toBe("associate")
      })

      it("should allow all valid role values", () => {
         const roles: Array<UserFormData["role"]> = ["admin", "supervisor", "associate"]

         roles.forEach((role) => {
            const userData: UserFormData = {
               fullName: "Fatima Al Rashid",
               email: "fatima@dubai.com",
               phone: "0559876543",
               addresses: [],
               role,
            }

            expect(userData.role).toBe(role)
         })
      })
   })

   describe("FormMode", () => {
      it("should have all required values", () => {
         const modes: FormMode[] = ["create", "edit", "view"]

         expect(modes).toContain("create")
         expect(modes).toContain("edit")
         expect(modes).toContain("view")
      })
   })

   describe("Address", () => {
      it("should have all required properties", () => {
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
})
