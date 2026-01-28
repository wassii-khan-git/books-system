import React, { useEffect, useState } from 'react'

interface DebounceProps {
  value: string
  delay: number
}

const useDebounce = ({ value, delay }: DebounceProps) => {
  // debounce value
  const [debounceValue, setDebounceValue] = useState(value)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    // timer
    const timer = setTimeout(() => {
      setDebounceValue(value)
      setLoading(false)
    }, delay)
    // clear timer
    return () => {
      clearTimeout(timer)
      setLoading(false)
    }
  }, [delay, value])

  // return value
  return {
    debounceValue,
    loading
  }
}

export default useDebounce
