export const dynamic = 'force-dynamic'

import Authenticated from '@/components/authenticated'
import { trpc } from '@foundation-trpc/trpc-client'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await trpc.auth.getUserSession.query()
  if (!session) redirect('/login')

  return <Authenticated name={session.user.name} />
}
