import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Trash2, Shield, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDemoWallet } from '@/lib/demo-wallet-context';

interface Guardian {
  id: string;
  address: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  dateAdded: string;
}

export function GuardianManager() {
  const { isConnected, isOwner, executeTransaction } = useDemoWallet();
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      id: '1',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Alice (Sister)',
      status: 'active',
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      name: 'Bob (Best Friend)',
      status: 'active',
      dateAdded: '2024-01-10'
    }
  ]);

  const [newGuardianAddress, setNewGuardianAddress] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [isAddingGuardian, setIsAddingGuardian] = useState(false);
  const { toast } = useToast();

  const addGuardian = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    if (!isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only the wallet owner can add guardians.",
        variant: "destructive"
      });
      return;
    }

    if (!newGuardianAddress || !newGuardianName) {
      toast({
        title: "Missing Information",
        description: "Please provide both address and name for the guardian.",
        variant: "destructive"
      });
      return;
    }

    // Validate address format (basic check)
    if (!newGuardianAddress.startsWith('0x') || newGuardianAddress.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Sui address starting with 0x.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingGuardian(true);

    try {
      // Execute transaction through demo wallet
      await executeTransaction(`add_guardian(${newGuardianAddress})`);

      const newGuardian: Guardian = {
        id: Date.now().toString(),
        address: newGuardianAddress,
        name: newGuardianName,
        status: 'pending',
        dateAdded: new Date().toISOString().split('T')[0]
      };

      setGuardians(prev => [...prev, newGuardian]);
      setNewGuardianAddress('');
      setNewGuardianName('');

      toast({
        title: "Transaction Successful!",
        description: `${newGuardianName} has been added as a guardian.`,
      });

      // Simulate confirmation after a delay
      setTimeout(() => {
        setGuardians(prev => prev.map(g =>
          g.id === newGuardian.id ? { ...g, status: 'active' } : g
        ));
      }, 3000);

    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to add guardian. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingGuardian(false);
    }
  };

  const removeGuardian = async (guardianId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    if (!isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only the wallet owner can remove guardians.",
        variant: "destructive"
      });
      return;
    }

    const guardian = guardians.find(g => g.id === guardianId);
    if (!guardian) return;

    try {
      // Execute transaction through demo wallet
      await executeTransaction(`remove_guardian(${guardian.address})`);

      setGuardians(prev => prev.filter(g => g.id !== guardianId));

      toast({
        title: "Transaction Successful!",
        description: `${guardian.name} has been removed as a guardian.`,
      });

    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to remove guardian. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard.",
    });
  };

  const getStatusIcon = (status: Guardian['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Guardian['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-guardian-green" />
            Guardian Management
          </h2>
          <p className="text-muted-foreground">
            Manage trusted friends and family who can help recover your wallet
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="soul-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Guardian
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guardian</DialogTitle>
              <DialogDescription>
                Add a trusted friend or family member as a guardian for your wallet recovery.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="guardian-name">Guardian Name</Label>
                <Input
                  id="guardian-name"
                  placeholder="e.g., Alice (Sister)"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="guardian-address">Sui Wallet Address</Label>
                <Input
                  id="guardian-address"
                  placeholder="0x..."
                  value={newGuardianAddress}
                  onChange={(e) => setNewGuardianAddress(e.target.value)}
                />
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Make sure this address belongs to someone you trust completely. 
                  They will be able to help recover your wallet.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={addGuardian} 
                disabled={isAddingGuardian}
                className="w-full soul-gradient text-white"
              >
                {isAddingGuardian ? 'Adding Guardian...' : 'Add Guardian'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Guardian List */}
      <div className="grid gap-4">
        {guardians.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Guardians Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add trusted friends and family as guardians to enable wallet recovery.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="soul-gradient text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Guardian
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Guardian</DialogTitle>
                      <DialogDescription>
                        Add a trusted friend or family member as a guardian for your wallet recovery.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="guardian-name">Guardian Name</Label>
                        <Input
                          id="guardian-name"
                          placeholder="e.g., Alice (Sister)"
                          value={newGuardianName}
                          onChange={(e) => setNewGuardianName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="guardian-address">Sui Wallet Address</Label>
                        <Input
                          id="guardian-address"
                          placeholder="0x..."
                          value={newGuardianAddress}
                          onChange={(e) => setNewGuardianAddress(e.target.value)}
                        />
                      </div>
                      
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Make sure this address belongs to someone you trust completely. 
                          They will be able to help recover your wallet.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        onClick={addGuardian} 
                        disabled={isAddingGuardian}
                        className="w-full soul-gradient text-white"
                      >
                        {isAddingGuardian ? 'Adding Guardian...' : 'Add Guardian'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          guardians.map((guardian) => (
            <Card key={guardian.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(guardian.status)}
                    <div>
                      <CardTitle className="text-lg">{guardian.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {guardian.address.slice(0, 8)}...{guardian.address.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddress(guardian.address)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(guardian.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuardian(guardian.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Added on {guardian.dateAdded}</span>
                  {guardian.status === 'pending' && (
                    <span className="text-yellow-600">Waiting for confirmation...</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recovery Threshold Info */}
      {guardians.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Recovery Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recovery Threshold</p>
                  <p className="text-sm text-muted-foreground">
                    Number of guardian approvals needed for recovery
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  1 of {guardians.filter(g => g.status === 'active').length}
                </Badge>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  For this demo, only 1 guardian approval is required for recovery. 
                  In production, you might want to require multiple approvals for enhanced security.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
