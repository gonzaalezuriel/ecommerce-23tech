import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      lastname: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: Role
    lastname: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role
    id: string
    lastname: string
  }
}
