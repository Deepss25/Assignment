import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react';
import { BankingDatabase } from '@/lib/banking-logic';

const CustomerOverview = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customerId ? BankingDatabase.getCustomerById(customerId) : null;
  const loans = customerId ? BankingDatabase.getLoansByCustomerId(customerId) : [];

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold">Customer Not Found</h2>
        <Link to="/customers"><Button className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" />Back to Customers</Button></Link>
      </div>
    );
  }

  const totalAmount = loans.reduce((sum, loan) => sum + loan.total_amount, 0);
  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/customers"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.customer_id}</p>
          </div>
        </div>
        <Link to={`/loans/create?customer=${customer.customer_id}`}>
          <Button className="bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />New Loan</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Loans</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{loans.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Loans</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-accent">{activeLoans.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Portfolio</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Portfolio</CardTitle>
          <CardDescription>All loans for this customer</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Monthly EMI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.loan_id}>
                  <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">{loan.loan_id}</code></TableCell>
                  <TableCell>₹{loan.principal_amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{loan.total_amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{loan.monthly_emi.toLocaleString('en-IN')}</TableCell>
                  <TableCell><Badge variant={loan.status === 'ACTIVE' ? 'default' : 'secondary'}>{loan.status}</Badge></TableCell>
                  <TableCell className="space-x-2">
  <Link to={`/loans/${loan.loan_id}/ledger`}>
    <Button variant="outline" size="sm">
      <CreditCard className="h-4 w-4 mr-1" />View
    </Button>
  </Link>
  <Link to={`/loans/${loan.loan_id}/payment`}>
    <Button variant="default" size="sm">
      Pay
    </Button>
  </Link>
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOverview;