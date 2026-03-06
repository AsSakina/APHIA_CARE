"use client"

import { useTransition } from "react"
import Link from "next/link"
import { logout } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings, Loader2 } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface UserMenuProps {
  user: UserType
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
  const fullName = `${user.first_name} ${user.last_name}`

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56" 
        align="end" 
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.username && <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
