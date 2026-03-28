import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'

export default function CreateUser() {
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return
    getToken().then(token => {
      fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      })
    })
  }, [isSignedIn, user])

  return null
}