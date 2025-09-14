import { getTranslations } from 'next-intl/server';
import AuthForm from '../auth/auth-form';

export default async function Init({ params }: { params: { locale: string } }) {
  // const t = await getTranslations('HomePage');

  return (
    <div>
      {/* <h1>{t('welcome')}</h1>
      <p>{t('description')}</p> */}
      <AuthForm />
    </div>
  );
}
