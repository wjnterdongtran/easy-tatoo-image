'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActionResponse } from '@/lib/types'
import { DEBUG_MODE } from '@/lib/debug'

export async function login(
  email: string,
  password: string
): Promise<ActionResponse> {
  // DEBUG MODE: Mock login (always succeeds)
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] Mock login:', email)
    revalidatePath('/', 'layout')
    redirect('/editor')
  }

  // PRODUCTION MODE: Real Supabase auth
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/editor')
}

export async function signup(
  email: string,
  password: string
): Promise<ActionResponse> {
  // DEBUG MODE: Mock signup (always succeeds, no email needed)
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] Mock signup:', email)
    return {
      success: true,
      data: {
        message: '[DEBUG MODE] Account created! You can login immediately.',
      },
    }
  }

  // PRODUCTION MODE: Real Supabase auth
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    data: {
      message: 'Check your email to confirm your account',
    },
  }
}

export async function logout(): Promise<void> {
  // DEBUG MODE: Mock logout
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] Mock logout')
    revalidatePath('/', 'layout')
    redirect('/')
    return
  }

  // PRODUCTION MODE: Real Supabase auth
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
