'use client';

import { useState } from 'react';
import { ArrowUpRight, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useLocale } from 'next-intl';


import { Card } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GitHubIcon } from "@/components/icons/githubIcon";

import { useTranslations } from 'next-intl';
import isEmail from 'validator/lib/isEmail';
import AuthService from '../services/authService';
import { useRouter } from 'next/navigation';
import { AxiosResponse } from 'axios';


interface LoginFormProps {
  onSwitch: () => void;
  onClose: () => void;
}

export default function LoginForm({ onClose, onSwitch }: LoginFormProps) {
  const t = useTranslations('AuthComponent');
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState<{[key: string]: boolean}>({});

  const [isSigningIn, setIsSigningIn] = useState(false);

  const authService: AuthService = new AuthService();

  const validate = () => {
      const newErrors: { [key: string]: boolean } = {};

      if (!email.trim() || !isEmail(email)) newErrors.email = true;
      if (!pass.trim()) newErrors.pass = true;

      setErrorFields(newErrors);

      const hasError = Object.keys(newErrors).length > 0;

      if (hasError) {
          if (newErrors.email && Object.keys(newErrors).length === 1) {
              setError(t('valid_email_required'));
          } else {
              setError(t('all_fields_required'));
          }
      } else {
          setError(null);
      }

      return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    if (!validate()){
      setIsSigningIn(false);
      return;
    } 

    try {
        const success: AxiosResponse = await authService.signinUser({
          userEmail: email,
          userPassword: pass 
        });
        
        if (success.status === 200){
          router.push(`/${locale}/home`);
        }
        
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setError("Login failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const clearError = (field: string, value: string) => {
    if (value.trim() !== '' && errorFields[field]) {
      setErrorFields(prev => ({ ...prev, [field]: false }));
      if (Object.values({ ...errorFields, [field]: false }).every(v => !v)) {
        setError(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300">
      <Card className="overflow-hidden p-0 w-full max-w-[30rem] rounded-xl shadow-lg transform transition-transform duration-300 scale-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">{t('welcome')}</h1>
            <p className="text-muted-foreground">{t('enter_credentials')}</p>
          </div>

          {/* Global error */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm h-10 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="text"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email', e.target.value);
                }}
                className={`h-12 ${errorFields.email ? 'border-red-500' : ''}`}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder={t('password_placeholder')}
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    clearError('pass', e.target.value);
                  }}
                  className={`h-12 pr-10 ${errorFields.pass ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">{t('remember_me')}</Label>
              </div>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                {t('forgot_password')}
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 flex items-center justify-center gap-2" 
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('signing_in')}
                </>
              ) : (
                t('sign_in')
              )}
            </Button>
          </form>

          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-muted-foreground">{t('or_continue')}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <GitHubIcon className="mr-2 h-4 w-4" />
              {t('github')}
            </Button>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {t('google')}
            </Button>
          </div>

          <div className="flex items-center justify-center text-m">
            <p>{t('dont_have_account')}</p>
            <Button
              variant="link"
              type="button"
              className="text-blue-500 font-medium flex items-center cursor-pointer"
              onClick={onSwitch}
            >
              <span className="text-m">{t('sign_up')}</span>
              <ArrowUpRight className="inline-block align-bottom h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
