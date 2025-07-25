import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BankingDatabase, BankingCalculations } from '@/lib/banking-logic';
import { PaymentRequest } from '@/types/banking';

const MakePayment = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentData, setPaymentData] = useState<PaymentRequest>({
    amount: 0,
    payment_type: 'EMI',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ledger, setLedger] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    if (loanId) {
      const ledgerData = BankingDatabase.getLoanLedger(loanId);
      setLedger(ledgerData);
      
      if (ledgerData) {
        const customerData = BankingDatabase.getCustomerById(ledgerData.customer_id);
        setCustomer(customerData);
        
        // Set default EMI amount
        setPaymentData(prev => ({
          ...prev,
          amount: ledgerData.monthly_emi,
        }));
      }
    }
  }, [loanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loanId || paymentData.amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive',
      });
      return;
    }

    if (paymentData.amount > ledger.balance_amount) {
      toast({
        title: 'Payment Amount Too High',
        description: 'Payment amount cannot exceed the remaining balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payment = BankingDatabase.addPayment(loanId, paymentData);
      
      // Check if loan is fully paid
      const updatedLedger = BankingDatabase.getLoanLedger(loanId);
      if (updatedLedger && updatedLedger.balance_amount <= 0) {
        BankingDatabase.updateLoanStatus(loanId, 'PAID_OFF');
      }
      
      toast({
        title: 'Payment Recorded Successfully',
        description: `Payment ID: ${payment.payment_id}`,
      });

      navigate(`/loans/${loanId}/ledger`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTypeChange = (type: 'EMI' | 'LUMP_SUM') => {
    setPaymentData(prev => ({
      ...prev,
      payment_type: type,
      amount: type === 'EMI' ? ledger?.monthly_emi || 0 : 0,
    }));
  };

  const calculateRemainingEMIs = () => {
    if (!ledger || paymentData.amount <= 0) return 0;
    const newBalance = ledger.balance_amount - paymentData.amount;
    return BankingCalculations.calculateRemainingEMIs(newBalance, ledger.monthly_emi);
  };

  if (!ledger) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Loan Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested loan could not be found.</p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const newBalance = ledger.balance_amount - paymentData.amount;
  const remainingEMIs = calculateRemainingEMIs();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link to={`/loans/${loanId}/ledger`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ledger
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Make Payment</h1>
          <p className="text-muted-foreground">
            {customer?.name} • {ledger.loan_id}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Record a payment for this loan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={paymentData.payment_type}
                  onValueChange={(value: 'EMI' | 'LUMP_SUM') => handlePaymentTypeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMI">Regular EMI</SelectItem>
                    <SelectItem value="LUMP_SUM">Lump Sum Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter payment amount"
                  value={paymentData.amount || ''}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0
                  }))}
                />
                {paymentData.payment_type === 'EMI' && (
                  <p className="text-sm text-muted-foreground">
                    Suggested EMI: ₹{ledger.monthly_emi.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Balance:</span>
                  <span className="font-medium">₹{ledger.balance_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Amount:</span>
                  <span className="font-medium">₹{paymentData.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span>New Balance:</span>
                  <span className="font-bold">₹{Math.max(0, newBalance).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || paymentData.amount <= 0}>
                {isLoading ? 'Processing Payment...' : 'Record Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Impact Analysis
            </CardTitle>
            <CardDescription>
              How this payment affects your loan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Remaining Balance:</span>
                <span className="font-bold">₹{Math.max(0, newBalance).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">EMIs Remaining:</span>
                <span className="font-bold">{Math.max(0, remainingEMIs)}</span>
              </div>
              
              {paymentData.payment_type === 'LUMP_SUM' && paymentData.amount > ledger.monthly_emi && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-success">Lump Sum Benefit</p>
                  <p className="text-xs text-success/80">
                    This payment will reduce your remaining EMIs by {ledger.emis_left - remainingEMIs} months
                  </p>
                </div>
              )}

              {newBalance <= 0 && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-success">🎉 Loan Completion</p>
                  <p className="text-xs text-success/80">
                    This payment will fully settle your loan!
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Current Loan Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Principal:</span>
                  <span>₹{ledger.principal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>₹{ledger.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>₹{ledger.amount_paid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly EMI:</span>
                  <span>₹{ledger.monthly_emi.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MakePayment;