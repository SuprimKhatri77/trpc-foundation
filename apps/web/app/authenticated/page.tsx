export const dynamic = 'force-dynamic'

import Authenticated from '@/components/authenticated'
import { trpc } from '@foundation-trpc/trpc-client'
import { redirect } from 'next/navigation'

export default async function Page() {
  let result = null

  try {
    console.log('entered the try block')
    result = await trpc.auth.getUserSession.query()
    console.log('result in authenticated/page.tsx: ', result)
  } catch (err) {
    console.log('error: ', err)
    redirect('/login')
  }

  console.log('resolved without an error in authenticated page: ', result)
  if (!result.success || !result.session) redirect('/login')
  console.log('looks like the user has session')
  const { session } = result
  return <Authenticated name={session.user.name} />
}
