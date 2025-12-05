import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@foundation-trpc/trpc-server'
import type { createTRPCProxyClient as CreateTRPCProxyClient } from '@trpc/client'
import { headers } from 'next/headers'

export const trpc: ReturnType<typeof CreateTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        async headers() {
          const headersList = await headers()
          return Object.fromEntries(headersList.entries())
        },
        fetch(url, options) {
          return fetch(url, { ...options, credentials: 'include' })
        },
      }),
    ],
  })

export { trpcClient } from './client'
export { Provider } from './Provider'
