import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('you-token')?.value

    if (currentUser && !request.nextUrl.pathname.startsWith('/profile')) {
        return Response.redirect(new URL('/profile', request.url))
    }

    if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/profile', '/login'],
}