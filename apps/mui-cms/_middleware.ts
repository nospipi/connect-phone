// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextRequest } from "next/server";

// const middleware = (req: NextRequest) => {
//   console.log("Middleware is running!", req.nextUrl.pathname);

//   // Return the Clerk middleware result
//   return clerkMiddleware()(req);
// };

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// export default middleware;
