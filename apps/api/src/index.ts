import express from 'express'
import cors from 'cors'
import { trpcExpress } from '@foundation-trpc/trpc-server'
import { auth, toNodeHandler } from '@foundation-trpc/auth'

const app = express()
app.use(
  cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.all('/api/auth/*any', toNodeHandler(auth))

app.use(express.json())

app.use('/trpc', trpcExpress)

app.get('/', (req, res) => {
  res.send('Hello world')
  console.log('hello from root.')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
