'use client'

import Link from "next/link"
import { User } from "@/app/types/entities/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ArrowUpRight, SquareArrowOutUpRight } from "lucide-react"

export function UserModifiedByDetails({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-[max-content] pr-3 items-center border rounded-full">
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-7 w-7">
                {/* <AvatarImage src={user.avatarUrl ?? "/avatars/03.png"} alt={user.userName} /> */}
                <AvatarFallback>🐉</AvatarFallback>
            </Avatar>
            </Button>
            <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                {/* {user.userName} */}
                James Smith
            </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="py-5 px-5" align="end" forceMount>
        <Link href='#' className="group flex flex-col space-y-1">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                        {/* {user.userName} */}
                        James Smith
                    </p>
                    <p className="text-xs text-muted-foreground leading-none group-hover:text-primary transition-colors">
                        {/* {user.email} */}
                        james@docuckoo.com
                    </p>
                </div>
                <SquareArrowOutUpRight className="h-4 w-4 ml-5 text-muted-foreground group-hover:text-primary transition-transform duration-200 transform group-hover:translate-x-1" />
            </div>
        </Link>


      </DropdownMenuContent>
    </DropdownMenu>
  )
}
