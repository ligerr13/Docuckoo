'use client';

import { Button } from "@/components/ui/button";
import { AwardIcon, LogOut } from "lucide-react";
import AuthService from "@/app/services/authService";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignOutButton({ locale }: { locale: string }) {
    const userService: AuthService = new AuthService();
    const t = useTranslations('HomePage');
    

    const handleSignOut = async () => {
        try {
            await userService.signoutUser();
        } catch (error) {
            console.error(error);
        } finally {
            window.location.href = `/${locale}`;
        }
    };

    return (

<Button
  type="button"
  onClick={handleSignOut}
  className="w-full bg-transparent cursor-pointer shadow-none border-none p-0 m-0 flex justify-between items-center text-sm font-normal text-foreground hover:bg-transparent hover:text-foreground"
>
  <span>{t('avatar_sign_out')}</span>
  <LogOut className="h-2 w-2" />
</Button>



    );
}
