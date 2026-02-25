"use client"

import { useState, useEffect, useTransition } from "react"
import { UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { toast } from "sonner"
import { getUserProfile, updateUserInfo, changeUserPassword } from "@/actions/user-actions"

type UserProfile = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [infoForm, setInfoForm] = useState({
    name: "",
    lastname: "",
    document: "",
    email: "",
    address: "",
    phone: "",
  })
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [isInfoPending, startInfoTransition] = useTransition()
  const [isPassPending, startPassTransition] = useTransition()
  const [confirmInfoOpen, setConfirmInfoOpen] = useState(false)
  const [confirmPassOpen, setConfirmPassOpen] = useState(false)

  useEffect(() => {
    getUserProfile().then((data) => {
      if (data) {
        setProfile(data)
        setInfoForm({
          name: data.name,
          lastname: data.lastname,
          document: data.document,
          email: data.email,
          address: data.address || "",
          phone: data.phone || "",
        })
      }
    })
  }, [])

  function updateInfo(field: string, value: string) {
    setInfoForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleInfoSave(e: React.FormEvent) {
    e.preventDefault()
    setConfirmInfoOpen(true)
  }

  function confirmInfoSave() {
    setConfirmInfoOpen(false)
    startInfoTransition(async () => {
      const result = await updateUserInfo({
        name: infoForm.name,
        lastname: infoForm.lastname,
        email: infoForm.email,
        address: infoForm.address,
        phone: infoForm.phone,
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Datos actualizados correctamente")
      }
    })
  }

  function handlePassSave(e: React.FormEvent) {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmNewPassword) {
      toast.error("Las contraseñas nuevas no coinciden")
      return
    }
    setConfirmPassOpen(true)
  }

  function confirmPassSave() {
    setConfirmPassOpen(false)
    startPassTransition(async () => {
      const result = await changeUserPassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
        confirmNewPassword: passForm.confirmNewPassword,
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Contraseña actualizada correctamente")
        setPassForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
      }
    })
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 pb-12">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-12">
      <BreadcrumbNav items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta" }]} />

      <div className="mt-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <UserCircle className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Cuenta</h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Personal info form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInfoSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={infoForm.name} onChange={(e) => updateInfo("name", e.target.value)} placeholder="Solo letras (2 a 50 car.)" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input id="lastname" value={infoForm.lastname} onChange={(e) => updateInfo("lastname", e.target.value)} placeholder="Solo letras (2 a 50 car.)" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="document">Documento</Label>
              <Input id="document" value={infoForm.document} disabled className="opacity-70" />
              <span className="text-xs text-muted-foreground">El documento no puede modificarse</span>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={infoForm.email} onChange={(e) => updateInfo("email", e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={infoForm.address} onChange={(e) => updateInfo("address", e.target.value)} placeholder="Mínimo 5 caracteres" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={infoForm.phone} onChange={(e) => updateInfo("phone", e.target.value)} placeholder="10 a 15 números" />
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <Button type="submit" className="font-semibold" disabled={isInfoPending}>
                {isInfoPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={confirmInfoOpen} onOpenChange={setConfirmInfoOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambios</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que querés guardar los cambios en tu cuenta?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmInfoSave}>Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmPassOpen} onOpenChange={setConfirmPassOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que querés actualizar tu contraseña?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPassSave}>Actualizar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password change form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePassSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mín. 8 car., Mayús, Minús, Núm"
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmNewPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={passForm.confirmNewPassword}
                  onChange={(e) => setPassForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button type="submit" variant="outline" className="font-semibold" disabled={isPassPending}>
                {isPassPending ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
