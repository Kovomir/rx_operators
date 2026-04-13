import { useCallback, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"

import { supabase } from "@/lib/supabase"

export function useAuthSession() {
  const isSupabaseConfigured = Boolean(supabase)
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      return
    }
    const client = supabase

    let mounted = true
    const setSessionState = (session: Session | null) => {
      setIsAuthenticated(Boolean(session?.user))
      setUserEmail(session?.user.email ?? null)
    }

    const loadSession = async () => {
      const { data } = await client.auth.getSession()

      if (!mounted) {
        return
      }

      setSessionState(data.session)
      setIsAuthLoading(false)
    }

    void loadSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSessionState(session)
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
    isAuthenticated,
    userEmail,
    signOut,
  }
}
