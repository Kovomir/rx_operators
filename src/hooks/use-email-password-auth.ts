import { useCallback, useState } from "react"

import { supabase } from "@/lib/supabase"

type AuthMode = "login" | "register"
type AuthValues = {
  email: string
  password: string
}

export function useEmailPasswordAuth() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const switchMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode)
    setMessage(null)
    setError(null)
  }, [])

  const submit = useCallback(
    async ({ email, password }: AuthValues) => {
      if (!supabase) {
        setError("Supabase is not configured.")
        return
      }

      if (isSubmitting) {
        return
      }

      setIsSubmitting(true)
      setMessage(null)
      setError(null)

      const trimmedEmail = email.trim()

      if (!trimmedEmail || !password) {
        setError("Email and password are required.")
        setIsSubmitting(false)
        return
      }

      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        })

        if (signUpError) {
          setError(signUpError.message)
        } else {
          setMessage(
            "Registration successful. Check your email to confirm your account."
          )
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })

        if (signInError) {
          setError(signInError.message)
        } else {
          setMessage("Logged in successfully.")
        }
      }

      setIsSubmitting(false)
    },
    [isSubmitting, mode]
  )

  return {
    mode,
    setMode: switchMode,
    isSubmitting,
    message,
    error,
    submit,
  }
}
