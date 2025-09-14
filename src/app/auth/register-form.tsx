'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Eye, EyeOff, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import CountrySelect from "@/components/ui/country";
import RegionSelect from "@/components/ui/region";
import { useState } from "react";
import { GitHubIcon } from "@/components/icons/githubIcon";
import isEmail from 'validator/lib/isEmail';
import { AxiosResponse } from "axios";
import AuthService from "../services/authService";
import { useRouter } from 'next/navigation';


interface RegisterFormProps {
  onSwitch: () => void;
  onClose: () => void;
}

export default function RegisterForm({ onClose, onSwitch }: RegisterFormProps) {
  const t = useTranslations('AuthComponent');
  const locale = useLocale();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState<{[key: string]: boolean}>({});
  const authService: AuthService = new AuthService();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!selectedCountry) newErrors.selectedCountry = true;
    if (!selectedRegion) newErrors.selectedRegion = true;
    if (!email.trim() || !isEmail(email)) newErrors.email = true;
    if (!pass.trim()) newErrors.pass = true;
    if (!confirmPass.trim() || pass !== confirmPass) newErrors.confirmPass = true;

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
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const success: AxiosResponse = await authService.signupUser({
        userName: firstName.concat(' ', lastName),
        userEmail: email,
        userPassword: pass
      });

      if (success.status === 200){
        const login: AxiosResponse = await authService.signinUser({
          userEmail: email,
          userPassword: pass 
        });

        if (login.status === 200){
          router.push(`/${locale}/home`);
        }
      }
    } catch (err) {
      console.error(err);
      setError(t('registration_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };


  const clearError = (field: string, value: string) => {
    if (value.trim() !== '' && errorFields[field]) {
      setErrorFields(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300">
      <Card className="relative overflow-hidden p-0 w-full max-w-[35rem] rounded-xl shadow-lg transform transition-transform duration-300 scale-100">
        
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
            <h1 className="text-3xl font-bold">{t('create_account_welcome')}</h1>
            <div className="flex items-center justify-center">
              <p className="text-m text-muted-foreground">{t('have_account')}</p>
              <Button
                variant="link"
                className="text-blue-500 font-medium flex items-center cursor-pointer"
                type="button"
                onClick={onSwitch}
              >
                <span className="text-m">{t('sign_in')}</span>
                <ArrowUpRight className="inline-block align-bottom h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Global error */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm h-10 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First and Last Name */}
            <div className="flex items-center justify-between space-x-5 mt-2">
              <div className="w-1/2">
                <p className={`text-xs ${errorFields.firstName ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {t('first_name')}
                </p>
                <Input
                  id="first_name"
                  type="text"
                  value={firstName}
                  placeholder={t('first_name_placeholder')}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError('firstName', e.target.value);
                  }}
                  className={`h-10  mt-2 ${errorFields.firstName ? 'border-red-600' : ''}`}
                />
              </div>
              <div className="w-1/2">
                <p className={`text-xs ${errorFields.lastName ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {t('last_name')}
                </p>
                <Input
                  id="last_name"
                  type="text"
                  value={lastName}
                  placeholder={t('last_name_placeholder')}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError('lastName', e.target.value);
                  }}
                  className={`h-10  mt-2 ${errorFields.lastName ? 'border-red-600' : ''}`}
                />
              </div>
            </div>

            {/* Country and Region */}
            <div className="mt-4 relative overflow-visible">
              <div className="flex items-center mb-2">
                <p className={`text-xs ${errorFields.selectedCountry || errorFields.selectedRegion ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {t('select_country_and_region')}
                </p>
                {/* Tooltip */}
                <div className="relative group ">
                    <div className="absolute left-0 right-0 top-1/2 justify-between translate-y-5 w-64 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 z-50">
                      {t('explain_country_and_region')}
                    </div>
                    <span className="inline-flex ml-2 items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs font-bold cursor-pointer">
                      ?
                    </span>
                  </div>
              </div>
              <div className="flex items-center justify-between h-10 ">
                <CountrySelect
                  className={`w-1/2 mr-5 ${errorFields.selectedCountry ? 'border-red-600' : ''}`}
                  onChange={(country) => {
                    setSelectedCountry(country);
                    setSelectedRegion("");
                    clearError('selectedCountry', country);
                  }}
                />
                <RegionSelect
                  className={`w-1/2 ${errorFields.selectedRegion ? 'border-red-600' : ''}`}
                  countryCode={selectedCountry}
                  value={selectedRegion}
                  onChange={(region) => {
                    setSelectedRegion(region);
                    clearError('selectedRegion', region);
                  }}
                  placeholder="Select a region"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full mt-2">
              <p className={`text-xs ${errorFields.email ? 'text-red-600' : 'text-muted-foreground'}`}>{t('enter_email')}</p>
              <Input
                id="reg_email"
                type="text"
                value={email}
                placeholder={t('email_placeholder')}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email', e.target.value);
                
                }}
                className={`h-10  mt-2 ${errorFields.email ? 'border-red-600' : ''}`}
              />
            </div>

            {/* Passwords */}
            <div className="space-y-3 mt-2">
              <div>
                <p className={`text-xs ${errorFields.pass ? 'text-red-600' : 'text-muted-foreground'}`}>{t('password')}</p>
                <div className="relative">
                  <Input
                    key={showPass ? 'show' : 'hide'}
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={pass}
                    placeholder={t('password_placeholder')}
                    onChange={(e) => {
                      setPass(e.target.value);
                      clearError('pass', e.target.value);
                    }}
                    className={`h-10  pr-10 mt-2 ${errorFields.pass ? 'border-red-600' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <p className={`text-xs ${errorFields.confirmPass ? 'text-red-600' : 'text-muted-foreground'}`}>{t('confirm_password_placeholder')}</p>
                <div className="relative">
                  <Input
                    key={showConfirmPass ? 'show' : 'hide'}
                    id="confirm_password"
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPass}
                    placeholder={t('confirm_password_placeholder')}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      clearError('confirmPass', e.target.value);
                    }}
                    className={`h-10  pr-10 mt-2 ${errorFields.confirmPass ? 'border-red-600' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                className="px-4 py-2 h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('registering') : t('continue_registration')}
              </Button>
            </div>
          </form>
           <div className="relative flex justify-center text-xs">
              <span className="px-2 text-muted-foreground">{t('or_continue')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <Button variant={"outline"} className="w-full">
                      <GitHubIcon className="mr-2 h-4 w-4" />
                      {t('github')}
                  </Button>
                  <Button variant={"outline"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                          />
                      </svg>
                      {t('google')}
                  </Button>
              </div>
        </div>
      </Card>
    </div>
  );
}
