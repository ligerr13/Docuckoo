'use client'

import { useState } from "react";
import RegisterForm from "./register-form";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import('./login-form'), { ssr: false });

export default function AuthForm() {
    const t = useTranslations('AuthComponent');
    const [mode, setMode] = useState<"login" | "register">("login");
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative overflow-hidden">

            {mode === "login" && (
                <LoginForm 
                onSwitch={() => setMode("register")}
                onClose={() => setIsOpen(false)}
                />
            )}

            {mode === "register" && (
                <RegisterForm 
                onSwitch={() => setMode("login")}
                onClose={() => setIsOpen(false)}
                />
            )}

            </div>
        </div>
    );
}
