import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CreditCard, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { BankingDatabase } from '@/lib/banking-logic';
import { LoanLedger as LoanLedgerType } from '@/types/banking';

const LoanLedger = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const [ledger, setLedger] = useState<LoanLedgerType | null>(null);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    if (loanId) {
      const ledgerData = BankingDatabase.getLoanLedger(loanId);
      setLedger(ledgerData);
      
      if (ledgerData) {
        const customerData = BankingDatabase.getCustomerById(ledgerData.customer_id);
        setCustomer(customerData);
      }
    }
  }, [loanId]);

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

  const progressPercentage = ((ledger.amount_paid / ledger.total_amount) * 100);
  const isFullyPaid = ledger.balance_amount <= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Ledger</h1>
            <p className="text-muted-foreground">
              {customer?.name} • {ledger.loan_id}
            </p>
          </div>
        </div>
        <Link to={`/loans/${loanId}/payment`}>
          <Button className="bg-accent hover:bg-accent/90">
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
        </Link>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{ledger.principal.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Original loan amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{ledger.amount_paid.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">{progressPercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{ledger.balance_amount.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Remaining amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMIs Left</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ledger.emis_left}</div>
            <p className="text-xs text-muted-foreground">Monthly payments remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>Complete information about this loan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{customer?.name} ({ledger.customer_id})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Loan ID:</span>
                <span>{ledger.loan_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Principal Amount:</span>
                <span>₹{ledger.principal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span>₹{ledger.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Monthly EMI:</span>
                <span>₹{ledger.monthly_emi.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={isFullyPaid ? "default" : "secondary"}>
                  {isFullyPaid ? "PAID OFF" : "ACTIVE"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Progress:</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Payment Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All payments made towards this loan</CardDescription>
        </CardHeader>
        <CardContent>
          {ledger.transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'LUMP_SUM' ? 'default' : 'secondary'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payments recorded yet</p>
              <p className="text-sm">Make your first payment to see transaction history</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanLedger;