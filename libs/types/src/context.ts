import type { Request, Response } from 'express'
import type { DATABASE } from '@foundation-trpc/db'
import type { AUTH } from '@foundation-trpc/auth'

export interface AppContext {
  req: Request
  res: Response
  db: DATABASE
  auth: AUTH
  userId: string | undefined
}

export type ProtectedContext = AppContext & {
  userId: string
}

export type Context = AppContext
