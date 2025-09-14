import SignOutButton from "@/app/auth/signout-button"
import { User } from "@/app/types/entities/user"
import {Avatar,AvatarFallback,AvatarImage} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu,DropdownMenuContent,DropdownMenuGroup,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function UserNav({ user, locale }: { user: User, locale: string }) {
  const t = useTranslations('HomePage');

  return (
    <>
      <ThemeToggle />
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/03.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">user?.userName</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {t('avatar_profile')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t('avatar_billing')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t('avatar_settings')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
           <SignOutButton locale={locale} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
    
  )
}