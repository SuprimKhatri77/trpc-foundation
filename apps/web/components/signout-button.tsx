'use client'

import { Button } from './ui/button'
import { trpcClient } from '@foundation-trpc/trpc-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from './ui/spinner'

const SignoutButton = () => {
  const router = useRouter()
  const { mutate, isPending, reset } = trpcClient.auth.signout.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message)
        reset()
        return
      }

      toast.success(result.message)
      router.push('/')
      reset()
    },
    onError: () => {
      toast.error('Something went wrong.')
      reset()
    },
  })
  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? <Spinner /> : 'Logout'}
    </Button>
  )
}

export default SignoutButton
