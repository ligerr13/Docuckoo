import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken");

    if (!token) {
        const locale = req.nextUrl.pathname.split('/')[1];
        if (req.nextUrl.pathname.startsWith(`/${locale}/home`)) {
            return NextResponse.redirect(new URL(`/${locale}/`, req.url));
        }
    }
    
    return handleI18nRouting(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};