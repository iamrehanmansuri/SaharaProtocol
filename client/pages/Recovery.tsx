import { RecoveryWorkflow } from '@/components/recovery/RecoveryWorkflow';
import { WalletConnection, WalletStatus, useCurrentAccount } from '@/components/wallet/WalletConnection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recovery() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-soul-purple/5 to-soul-gold/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg soul-gradient">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold soul-gradient-text">SoulCraft</h1>
                  <p className="text-xs text-muted-foreground">Social Recovery Wallet</p>
                </div>
              </div>
            </div>
            <WalletStatus />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!currentAccount ? (
          <div className="max-w-md mx-auto">
            <WalletConnection />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <RecoveryWorkflow />
          </div>
        )}
      </main>
    </div>
  );
}
