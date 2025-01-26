import { HelmetProvider } from 'react-helmet-async'

const ReactHelmetProvider = ({ children }: { children: React.ReactNode }) => {
  return <HelmetProvider>{children}</HelmetProvider>
}

export default ReactHelmetProvider
