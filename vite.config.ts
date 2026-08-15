import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import analyzeDog from './api/analyze-dog.js'

function localApi(): Plugin {
  return {
    name: 'pawsitive-local-api',
    configureServer(server) {
      server.middlewares.use('/api/analyze-dog', async (request, response) => {
        try {
          const chunks: Buffer[] = []
          for await (const chunk of request) chunks.push(Buffer.from(chunk))
          const headers = new Headers()
          for (const [name, value] of Object.entries(request.headers)) {
            if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value)
          }
          const method = request.method ?? 'GET'
          const body = method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks)
          const apiResponse = await analyzeDog(new Request('http://localhost/api/analyze-dog', { method, headers, body }))
          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
          response.end(Buffer.from(await apiResponse.arrayBuffer()))
        } catch {
          response.statusCode = 500
          response.setHeader('content-type', 'application/json')
          response.end(JSON.stringify({ error: 'local_api_failed' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL

  return {
    plugins: [localApi(), react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }
})
