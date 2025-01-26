import { Provider as JotaiProviderLocal } from 'jotai'
import { jotaiGlobalStore } from './JotaiProvider.constants'

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <JotaiProviderLocal store={jotaiGlobalStore}>{children}</JotaiProviderLocal>
}

export default JotaiProvider
