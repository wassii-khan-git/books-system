import React, { useEffect, useState } from 'react'
import { UserTypes } from '@/pages/(auth)/login'

const useAuth = () => {
  // is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  // user data
  const [userData, setUserData] = useState<UserTypes | null>(null)

  useEffect(() => {
    const getSessions = async () => {
      try {
        const session = await window.api.getSession()
        console.log('session--', session)
        if (session.isAuthenticated && session.user) {
          setIsLoggedIn(session.isAuthenticated)
          setUserData(session.user)
        }
      } catch (error) {
        console.log('Error--', error)
      }
    }
    getSessions()
  }, [])

  return {
    isLoggedIn,
    user: userData
  }
}

export default useAuth
