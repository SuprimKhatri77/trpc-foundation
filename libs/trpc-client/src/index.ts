import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@foundation-trpc/trpc-server'
import type { createTRPCProxyClient as CreateTRPCProxyClient } from '@trpc/client'
import { cookies } from 'next/headers'

export const trpc: ReturnType<typeof CreateTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        async headers() {
          const cookieStore = await cookies()
          const cookieString = cookieStore
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join('; ')

          console.log('cookies being sent:', cookieString)

          return {
            cookie: cookieString,
          }
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
            cache: 'no-store',
          })
        },
      }),
    ],
  })

export { trpcClient } from './client'
export { Provider } from './Provider'
