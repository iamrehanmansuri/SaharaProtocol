import { WalletConnection, WalletStatus, useCurrentAccount } from '@/components/wallet/WalletConnection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, RefreshCw, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-soul-purple/5 to-soul-gold/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg soul-gradient">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold soul-gradient-text">SoulCraft</h1>
                <p className="text-xs text-muted-foreground">Social Recovery Wallet</p>
              </div>
            </div>
            <WalletStatus />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!currentAccount ? (
          // Landing/Welcome Section
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Craft Your Digital{' '}
                <span className="soul-gradient-text">Soul</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Never lose access to your crypto again. SoulCraft uses trusted friends and family 
                as guardians to help you recover your wallet when you need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure by Design
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Social Recovery
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Never Lose Access
                </Badge>
              </div>
            </div>

            <div className="mb-12">
              <WalletConnection />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="glass-card">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-soul-purple/10 w-fit mb-2">
                    <Shield className="h-6 w-6 text-soul-purple" />
                  </div>
                  <CardTitle>Secure Recovery</CardTitle>
                  <CardDescription>
                    Your wallet is protected by cryptographic smart contracts on the Sui blockchain.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-guardian-green/10 w-fit mb-2">
                    <Users className="h-6 w-6 text-guardian-green" />
                  </div>
                  <CardTitle>Trusted Guardians</CardTitle>
                  <CardDescription>
                    Add friends and family as guardians who can help you recover your wallet.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-recovery-orange/10 w-fit mb-2">
                    <RefreshCw className="h-6 w-6 text-recovery-orange" />
                  </div>
                  <CardTitle>Easy Recovery</CardTitle>
                  <CardDescription>
                    Recover your wallet with guardian approval - no more lost private keys.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : (
          // Dashboard Section (when wallet is connected)
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to SoulCraft</h1>
              <p className="text-muted-foreground">
                Manage your social recovery wallet and guardians
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Wallet Status Card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-soul-purple" />
                    Wallet Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <Badge variant="secondary">Sui Devnet</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-500/10 text-green-600 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guardians Card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-guardian-green" />
                    Guardians
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        No guardians added yet
                      </p>
                      <Link to="/guardians">
                        <Button size="sm" className="soul-gradient text-white">
                          Add Guardian
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-recovery-orange" />
                    Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8">
                      <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        No recovery in progress
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        Initiate Recovery
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Set up your social recovery wallet to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/guardians">
                    <Button className="soul-gradient text-white h-auto p-4 flex-col items-start w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">Add Guardians</span>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </div>
                      <p className="text-sm opacity-90 text-left">
                        Add trusted friends and family as guardians for your wallet
                      </p>
                    </Button>
                  </Link>

                  <Link to="/recovery">
                    <Button variant="outline" className="h-auto p-4 flex-col items-start border-soul-purple/20 hover:bg-soul-purple/5 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="h-5 w-5" />
                        <span className="font-medium">Test Recovery</span>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Test the recovery process to ensure it works properly
                      </p>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              SoulCraft - Social Recovery Wallet on Sui Blockchain
            </p>
            <p className="mt-2">
              Built for hackathon demo • Never lose access to your crypto again
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
