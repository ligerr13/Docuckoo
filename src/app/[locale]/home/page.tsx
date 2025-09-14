import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { HomePageContent } from "./welcome-component";
import ApiService from "../../services/apiService";

export default async function Home() {
    const locale = await getLocale();
    const apiService: ApiService = new ApiService();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect(`/${locale}`);
    }

    let user;
    
    try {
        const res = await apiService.FetchAuth("/api/user/me");
        user = res.data;
    } catch (err) {
        console.error("Fetch failed:", err);
        redirect(`/${locale}`);
    }
    
    return <HomePageContent user={user} locale={locale} />;
}