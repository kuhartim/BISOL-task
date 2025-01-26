import JotaiProvider from "./components/JotaiProvider/JotaiProvider";
import ReactHelmetProvider from "./components/ReactHelmetProvider/ReactHelmetProvider";
import ReactQueryProvider from "./components/ReactQueryProvider/ReactQueryProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <JotaiProvider>
      <ReactQueryProvider>
        <ReactHelmetProvider>{children}</ReactHelmetProvider>
      </ReactQueryProvider>
    </JotaiProvider>
  );
};

export default AppProviders;
