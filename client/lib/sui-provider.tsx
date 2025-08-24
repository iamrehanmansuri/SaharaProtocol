import { WalletProvider } from '@suiet/wallet-kit';

interface SuiProviderProps {
  children: React.ReactNode;
}

export function SuiProvider({ children }: SuiProviderProps) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}
