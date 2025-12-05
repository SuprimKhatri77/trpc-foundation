import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex gap-4 items-center">
        <Button asChild variant="outline">
          <Link href="/signup">Signup</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}
