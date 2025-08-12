import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(
  async (auth, request) => {
    //const path = request.nextUrl.pathname
    if (!isPublicRoute(request)) {
      //console.log(`Request before protecting to ${path}`)

      await auth.protect()
    }

    const headers = new Headers(request.headers)
    headers.set("x-current-path", request.nextUrl.pathname)
    console.log("Intercepted path:", request.nextUrl.pathname)

    return NextResponse.next({
      request: {
        headers: headers, //https://github.com/vercel/next.js/issues/50659#issuecomment-2211256368
      },
    })
  },
  //{ debug: true },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
