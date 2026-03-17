import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from 'src/auth/context/AuthProvider';
import { queryClient } from 'src/lib/react-query';

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
