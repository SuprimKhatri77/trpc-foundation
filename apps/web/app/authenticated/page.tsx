export const dynamic = 'force-dynamic'

import Authenticated from '@/components/authenticated'
import { trpc } from '@foundation-trpc/trpc-client'
import { redirect } from 'next/navigation'

export default async function Page() {
  let result = null

  try {
    result = await trpc.auth.getUserSession.query()
  } catch (err) {
    console.log('error: ', err)

    redirect('/login')
  }
  if (!result || !result.success || !result.session) redirect('/login')
  const { session } = result
  return <Authenticated name={session.user.name} />
}
