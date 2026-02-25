"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User, Role } from "@/types"
import type { AdminCreateUserSchema } from "@/lib/schemas"

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (data: AdminCreateUserSchema) => void
}

function UserFormContent({ user, onSave, onOpenChange }: Omit<UserFormProps, "open">) {
  const [form, setForm] = useState({
    name: user?.name ?? "",
    lastname: user?.lastname ?? "",
    document: user?.document ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    phone: user?.phone ?? "",
    password: "",
    role: (user?.role ?? "CLIENT") as Role,
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="uf-name">Nombre *</Label>
          <Input id="uf-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ej: Juan (letras, 2 a 50 car.)" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="uf-lastname">Apellido *</Label>
          <Input id="uf-lastname" value={form.lastname} onChange={(e) => update("lastname", e.target.value)} placeholder="Ej: Pérez (letras, 2 a 50 car.)" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="uf-document">Documento *</Label>
        <Input
          id="uf-document"
          value={form.document}
          onChange={(e) => update("document", e.target.value)}
          required
          disabled={!!user}
          placeholder="DNI (7 a 8 números)"
          pattern="[0-9]{7,8}"
          maxLength={8}
          title="Entre 7 y 8 números"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="uf-email">Email *</Label>
        <Input id="uf-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="uf-address">Dirección</Label>
          <Input id="uf-address" value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="uf-phone">Teléfono</Label>
          <Input
            id="uf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="10 a 15 números"
            pattern="[0-9]{10,15}"
            title="Entre 10 y 15 números"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="uf-password">{user ? "Nueva contraseña" : "Contraseña *"}</Label>
        <Input
          id="uf-password"
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder={user ? "Dejar vacío para no cambiar" : "Mín. 8 car., Mayús, Minús, Núm"}
          required={!user}
          minLength={8}
          pattern={!user ? "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" : undefined}
          title="Mín. 8 caracteres, al menos una mayúscula, una minúscula y un número"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Perfil</Label>
        <Select value={form.role} onValueChange={(v) => setForm((prev) => ({ ...prev, role: v as Role }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CLIENT">Cliente</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">{user ? "Guardar cambios" : "Crear usuario"}</Button>
      </DialogFooter>
    </form>
  )
}

export function UserForm({ open, onOpenChange, user, onSave }: UserFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
        </DialogHeader>
        {open && (
          <UserFormContent
            key={user?.id ?? "new"}
            user={user}
            onSave={onSave}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
