import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Shield, AlertTriangle, CheckCircle, Clock, User, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDemoWallet } from '@/lib/demo-wallet-context';

interface RecoveryRequest {
  id: string;
  newOwnerAddress: string;
  initiatedBy: string;
  initiatedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requiredApprovals: number;
  currentApprovals: number;
  approvers: Array<{
    address: string;
    name: string;
    approvedAt: string;
  }>;
}

export function RecoveryWorkflow() {
  const { isConnected, isGuardian, executeTransaction } = useDemoWallet();
  const [activeRecovery, setActiveRecovery] = useState<RecoveryRequest | null>(null);

  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [isInitiating, setIsInitiating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  const guardians = [
    { address: '0x1234567890abcdef1234567890abcdef12345678', name: 'Alice (Sister)' },
    { address: '0xabcdef1234567890abcdef1234567890abcdef12', name: 'Bob (Best Friend)' }
  ];

  const initiateRecovery = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    if (!newOwnerAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide the new owner address.",
        variant: "destructive"
      });
      return;
    }

    if (!newOwnerAddress.startsWith('0x') || newOwnerAddress.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Sui address starting with 0x.",
        variant: "destructive"
      });
      return;
    }

    setIsInitiating(true);

    try {
      await executeTransaction(`initiate_recovery(${newOwnerAddress})`);

      const newRecovery: RecoveryRequest = {
        id: Date.now().toString(),
        newOwnerAddress,
        initiatedBy: '0x1111222233334444555566667777888899990000',
        initiatedAt: new Date().toISOString(),
        status: 'pending',
        requiredApprovals: 1,
        currentApprovals: 0,
        approvers: []
      };

      setActiveRecovery(newRecovery);
      setNewOwnerAddress('');

      toast({
        title: "Transaction Successful!",
        description: "Recovery request has been submitted. Waiting for guardian approvals.",
      });

    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to initiate recovery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitiating(false);
    }
  };

  const approveRecovery = async () => {
    if (!activeRecovery) return;

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    if (!isGuardian) {
      toast({
        title: "Permission Denied",
        description: "Only guardians can approve recovery requests.",
        variant: "destructive"
      });
      return;
    }

    setIsApproving(true);

    try {
      await executeTransaction(`approve_recovery()`);

      const newApprover = {
        address: guardians[0].address,
        name: guardians[0].name,
        approvedAt: new Date().toISOString()
      };

      const updatedRecovery = {
        ...activeRecovery,
        currentApprovals: activeRecovery.currentApprovals + 1,
        approvers: [...activeRecovery.approvers, newApprover]
      };

      // Check if we have enough approvals
      if (updatedRecovery.currentApprovals >= updatedRecovery.requiredApprovals) {
        updatedRecovery.status = 'completed';

        toast({
          title: "Transaction Successful!",
          description: "Recovery completed! Wallet ownership has been transferred.",
        });

        // Reset after completion
        setTimeout(() => {
          setActiveRecovery(null);
        }, 3000);
      } else {
        toast({
          title: "Transaction Successful!",
          description: "Your approval has been recorded. Waiting for more approvals.",
        });
      }

      setActiveRecovery(updatedRecovery);

    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to approve recovery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const cancelRecovery = async () => {
    if (!activeRecovery) return;

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await executeTransaction(`cancel_recovery()`);

      setActiveRecovery(null);

      toast({
        title: "Transaction Successful!",
        description: "The recovery request has been cancelled.",
      });

    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to cancel recovery. Please try again.",
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

  const getStatusBadge = (status: RecoveryRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Approved</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const progressPercentage = activeRecovery 
    ? (activeRecovery.currentApprovals / activeRecovery.requiredApprovals) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-recovery-orange" />
            Wallet Recovery
          </h2>
          <p className="text-muted-foreground">
            Initiate or manage wallet recovery with guardian approval
          </p>
        </div>
        
        {!activeRecovery && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="soul-gradient text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Initiate Recovery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Initiate Wallet Recovery</DialogTitle>
                <DialogDescription>
                  Start the recovery process to transfer wallet ownership to a new address.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-owner">New Owner Address</Label>
                  <Input
                    id="new-owner"
                    placeholder="0x..."
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> This will transfer complete control of your wallet 
                    to the new address. Make sure you control the new address.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This recovery requires approval from {guardians.length > 0 ? '1 guardian' : 'your guardians'}. 
                    The process may take some time.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={initiateRecovery} 
                  disabled={isInitiating || guardians.length === 0}
                  className="w-full soul-gradient text-white"
                >
                  {isInitiating ? 'Initiating Recovery...' : 'Initiate Recovery'}
                </Button>
                
                {guardians.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    You need to add guardians before initiating recovery.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Active Recovery */}
      {activeRecovery ? (
        <div className="space-y-4">
          <Card className="glass-card border-recovery-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-recovery-orange" />
                    Active Recovery Request
                  </CardTitle>
                  <CardDescription>
                    Recovery initiated on {formatDate(activeRecovery.initiatedAt)}
                  </CardDescription>
                </div>
                {getStatusBadge(activeRecovery.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Recovery Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">New Owner Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {activeRecovery.newOwnerAddress.slice(0, 12)}...{activeRecovery.newOwnerAddress.slice(-10)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(activeRecovery.newOwnerAddress)}
                      className="h-auto p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Initiated By</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {activeRecovery.initiatedBy.slice(0, 12)}...{activeRecovery.initiatedBy.slice(-10)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(activeRecovery.initiatedBy)}
                      className="h-auto p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Approval Progress</Label>
                  <span className="text-sm text-muted-foreground">
                    {activeRecovery.currentApprovals} of {activeRecovery.requiredApprovals} required
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Approvers */}
              {activeRecovery.approvers.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Approvals Received</Label>
                  <div className="space-y-2">
                    {activeRecovery.approvers.map((approver, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">{approver.name}</p>
                          <p className="text-sm text-green-700">
                            Approved on {formatDate(approver.approvedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {activeRecovery.status === 'pending' && (
                  <>
                    <Button 
                      onClick={approveRecovery}
                      disabled={isApproving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isApproving ? 'Approving...' : 'Approve Recovery'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={cancelRecovery}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Cancel Recovery
                    </Button>
                  </>
                )}
                
                {activeRecovery.status === 'completed' && (
                  <div className="w-full text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">Recovery Completed Successfully!</p>
                    <p className="text-sm text-green-700">Wallet ownership has been transferred.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* No Active Recovery */
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Recovery</h3>
              <p className="text-muted-foreground mb-6">
                Your wallet is secure. Start a recovery process if you've lost access to your current wallet.
              </p>
              
              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="soul-gradient text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Initiate Recovery
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Initiate Wallet Recovery</DialogTitle>
                      <DialogDescription>
                        Start the recovery process to transfer wallet ownership to a new address.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-owner">New Owner Address</Label>
                        <Input
                          id="new-owner"
                          placeholder="0x..."
                          value={newOwnerAddress}
                          onChange={(e) => setNewOwnerAddress(e.target.value)}
                        />
                      </div>
                      
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Warning:</strong> This will transfer complete control of your wallet 
                          to the new address. Make sure you control the new address.
                        </AlertDescription>
                      </Alert>
                      
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          This recovery requires approval from {guardians.length > 0 ? '1 guardian' : 'your guardians'}. 
                          The process may take some time.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        onClick={initiateRecovery} 
                        disabled={isInitiating || guardians.length === 0}
                        className="w-full soul-gradient text-white"
                      >
                        {isInitiating ? 'Initiating Recovery...' : 'Initiate Recovery'}
                      </Button>
                      
                      {guardians.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          You need to add guardians before initiating recovery.
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <p className="text-xs text-muted-foreground">
                  Recovery requires guardian approval and may take time to complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Instructions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">How Recovery Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-soul-purple/10 flex-shrink-0">
                <User className="h-4 w-4 text-soul-purple" />
              </div>
              <div>
                <h4 className="font-medium">1. Initiate Recovery</h4>
                <p className="text-sm text-muted-foreground">
                  Start the recovery process by providing the new wallet address you want to transfer ownership to.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-guardian-green/10 flex-shrink-0">
                <Shield className="h-4 w-4 text-guardian-green" />
              </div>
              <div>
                <h4 className="font-medium">2. Guardian Approval</h4>
                <p className="text-sm text-muted-foreground">
                  Your trusted guardians review and approve the recovery request. Currently requires 1 approval.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-recovery-orange/10 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-recovery-orange" />
              </div>
              <div>
                <h4 className="font-medium">3. Automatic Transfer</h4>
                <p className="text-sm text-muted-foreground">
                  Once enough approvals are received, the smart contract automatically transfers ownership.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
