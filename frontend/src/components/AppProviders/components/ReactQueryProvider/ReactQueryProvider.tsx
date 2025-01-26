import { QueryClientProvider } from '@tanstack/react-query'
import { globalQueryClient } from './ReactQueryProvider.constants'

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={globalQueryClient}>{children}</QueryClientProvider>
}

export default ReactQueryProvider
