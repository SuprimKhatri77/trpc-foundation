import express from 'express'
import cors from 'cors'
import { trpcExpress } from '@foundation-trpc/trpc-server'
import { auth, toNodeHandler } from '@foundation-trpc/auth'

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.calculators247.com',
  'https://trpc-foundation-monorepo.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Cookie',
    'x-captcha-response',
    'x-captcha-user-remote-ip',
  ],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))

app.options('/*any', cors())

app.all('/api/auth/*any', toNodeHandler(auth))
app.use(express.json())

app.use('/trpc', trpcExpress)

app.get('/', (req, res) => {
  res.send('Hello world')
  console.log('hello from root.')
})

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Error:', err)
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: err.message })
  },
)

const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})
