import express from 'express'
import cors from 'cors'
import { trpcExpress } from '@foundation-trpc/trpc-server'
import { auth, toNodeHandler } from '@foundation-trpc/auth'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL!,
      'https://expresss-nextjs-trpc-monorepo-front.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  }),
)

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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
