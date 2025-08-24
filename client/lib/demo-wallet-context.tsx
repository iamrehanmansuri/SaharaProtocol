import React, { createContext, useContext, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';

// Demo addresses for hackathon
export const DEMO_ADDRESSES = {
  owner: '0x1234567890abcdef1234567890abcdef12345678',
  guardian: '0xabcdef1234567890abcdef1234567890abcdef12'
};

interface DemoWalletContextType {
  // Current account (real or demo)
  currentAccount: { address: string } | null;
  isConnected: boolean;
  isDemoMode: boolean;
  isOwner: boolean;
  isGuardian: boolean;
  
  // Demo actions
  connectAsOwner: () => void;
  connectAsGuardian: () => void;
  disconnectDemo: () => void;
  
  // Transaction simulation
  executeTransaction: (action: string) => Promise<void>;
}

const DemoWalletContext = createContext<DemoWalletContextType | undefined>(undefined);

export function DemoWalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const [demoAccount, setDemoAccount] = useState<string | null>(null);
  const [isTransacting, setIsTransacting] = useState(false);

  // Determine current state
  const currentAccount = wallet.connected && wallet.account 
    ? { address: wallet.account.address } 
    : demoAccount 
    ? { address: demoAccount }
    : null;
    
  const isConnected = !!currentAccount;
  const isDemoMode = !!demoAccount;
  const isOwner = currentAccount?.address === DEMO_ADDRESSES.owner;
  const isGuardian = currentAccount?.address === DEMO_ADDRESSES.guardian;

  const connectAsOwner = () => {
    setDemoAccount(DEMO_ADDRESSES.owner);
  };

  const connectAsGuardian = () => {
    setDemoAccount(DEMO_ADDRESSES.guardian);
  };

  const disconnectDemo = () => {
    setDemoAccount(null);
    if (wallet.connected) {
      wallet.disconnect();
    }
  };

  const executeTransaction = async (action: string): Promise<void> => {
    if (!isConnected) {
      throw new Error('No wallet connected');
    }

    setIsTransacting(true);
    
    try {
      if (wallet.connected) {
        // Real wallet transaction would go here
        console.log(`Executing real transaction: ${action}`);
        // For demo, just simulate
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Demo mode transaction simulation
        console.log(`Demo transaction: ${action} from ${currentAccount?.address}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } finally {
      setIsTransacting(false);
    }
  };

  const value: DemoWalletContextType = {
    currentAccount,
    isConnected,
    isDemoMode,
    isOwner,
    isGuardian,
    connectAsOwner,
    connectAsGuardian,
    disconnectDemo,
    executeTransaction
  };

  return (
    <DemoWalletContext.Provider value={value}>
      {children}
    </DemoWalletContext.Provider>
  );
}

export function useDemoWallet() {
  const context = useContext(DemoWalletContext);
  if (context === undefined) {
    throw new Error('useDemoWallet must be used within a DemoWalletProvider');
  }
  return context;
}
