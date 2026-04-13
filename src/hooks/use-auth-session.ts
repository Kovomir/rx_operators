import { useCallback, useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

export function useAuthSession() {
  const isSupabaseConfigured = Boolean(supabase)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false)
      return
    }
    const client = supabase

    let mounted = true

    const loadSession = async () => {
      const { data } = await client.auth.getSession()

      if (!mounted) {
        return
      }

      setUserEmail(data.session?.user.email ?? null)
      setIsAuthLoading(false)
    }

    void loadSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
  }, [])

  return {
    isSupabaseConfigured,
    isAuthLoading,
    userEmail,
    signOut,
  }
}
