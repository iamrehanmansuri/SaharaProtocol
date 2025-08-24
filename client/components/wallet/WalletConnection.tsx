import { ConnectButton } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Shield, Users, RefreshCw } from 'lucide-react';
import { useDemoWallet } from '@/lib/demo-wallet-context';

export function WalletConnection() {
  const { 
    currentAccount, 
    isConnected, 
    isDemoMode, 
    isOwner,
    isGuardian,
    connectAsOwner, 
    connectAsGuardian, 
    disconnectDemo 
  } = useDemoWallet();

  if (isConnected) {
    return (
      <Card className="p-6 glass-card soul-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-soul-purple/10">
              <Wallet className="h-5 w-5 text-soul-purple" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDemoMode ? 'Demo Mode' : 'Wallet Connected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentAccount?.address.slice(0, 8)}...{currentAccount?.address.slice(-6)}
              </p>
              {isDemoMode && (
                <p className="text-xs text-blue-600">
                  {isOwner ? 'Owner Account' : isGuardian ? 'Guardian Account' : 'Demo Account'}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectDemo}
            className="border-soul-purple/20 hover:bg-soul-purple/5"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 glass-card text-center">
      <div className="mx-auto mb-6 p-4 rounded-full bg-soul-purple/10 w-fit">
        <Shield className="h-8 w-8 text-soul-purple" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 soul-gradient-text">
        Connect Your Wallet
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Connect your Sui wallet to start using SoulCraft's social recovery features. 
        Protect your digital assets with trusted guardians.
      </p>

      <div className="space-y-4">
        {/* Real Wallet Connection */}
        <div className="mb-6">
          <ConnectButton 
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, hsl(var(--soul-purple)) 0%, hsl(var(--soul-gold)) 100%)',
              color: 'white',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
            onConnectSuccess={(walletName) => {
              console.log('Connected to wallet:', walletName);
            }}
            onConnectError={(error) => {
              console.error('Failed to connect wallet:', error);
            }}
          >
            Connect Real Wallet
          </ConnectButton>
        </div>

        {/* Demo Mode Separator */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground bg-background px-3">
            OR FOR DEMO
          </span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Demo Mode Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={connectAsOwner}
            className="soul-gradient text-white font-medium"
          >
            Connect as Owner
          </Button>
          <Button
            onClick={connectAsGuardian}
            variant="outline"
            className="border-soul-purple/20 hover:bg-soul-purple/5"
          >
            Connect as Guardian
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-soul-purple" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-guardian-green" />
            <span>Social Recovery</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-recovery-orange" />
            <span>Never Lose Access</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function WalletStatus() {
  const { currentAccount, isConnected, isDemoMode } = useDemoWallet();
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>Wallet not connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>
        {isDemoMode ? 'Demo: ' : 'Connected: '}
        {currentAccount?.address.slice(0, 8)}...{currentAccount?.address.slice(-4)}
      </span>
    </div>
  );
}

// Hook for other components to use wallet state
export function useCurrentAccount() {
  const { currentAccount } = useDemoWallet();
  return currentAccount;
}
