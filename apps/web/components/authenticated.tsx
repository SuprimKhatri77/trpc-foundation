import React from 'react'
import SignoutButton from './signout-button'

type Props = {
  name: string
}
const Authenticated = ({ name }: Props) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex gap-2 items-center">
        <h1>Hello, {name}!</h1>
        <SignoutButton />
      </div>
    </div>
  )
}

export default Authenticated
