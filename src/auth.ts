/**
 * Configuración principal de NextAuth v5.
 * Implementa autenticación con Credentials (email + password).
 * Verifica credenciales contra la DB con bcrypt, inyecta id y role en el JWT.
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";


export const {
  auth,      // Función para obtener la sesión actual (usada en server actions)
  signIn,    // Función para iniciar sesión
  signOut,   // Función para cerrar sesión
  handlers: { GET, POST },  // Endpoints de la API de NextAuth
} = NextAuth({
  ...authConfig,  // Trae las reglas de acceso de auth.config.ts
  providers: [
    // Proveedor "Credentials" = login con email y contraseña (no Google, no GitHub, etc.)
    Credentials({
      // Esta función se ejecuta cuando alguien intenta hacer login
      async authorize(credentials) {
        // PASO 1: Validar que el email y la contraseña tengan formato correcto
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // PASO 2: Buscar al usuario en la DB por su email
          const user = await prisma.user.findUnique({ where: { email } });

          // Si no existe el usuario, rechazar el login
          if (!user) return null;
          // Si el usuario está desactivado (baja lógica), rechazar el login
          if (!user.active) return null;

          // PASO 3: Comparar la contraseña ingresada con la encriptada en la DB
          const passwordsMatch = await bcrypt.compare(password, user.password);
          // Si coincide, devolver el usuario (NextAuth crea el JWT automáticamente)
          if (passwordsMatch) return user;
        }

        // Si algo falló, devolver null = login rechazado
        return null;
      },
    }),
  ],
});
