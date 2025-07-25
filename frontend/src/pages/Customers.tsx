import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Eye, CreditCard } from 'lucide-react';
import { BankingDatabase } from '@/lib/banking-logic';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const customers = BankingDatabase.getAllCustomers();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerStats = (customerId: string) => {
    const loans = BankingDatabase.getLoansByCustomerId(customerId);
    const activeLoans = loans.filter(loan => loan.status === 'ACTIVE');
    const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.total_amount, 0);
    
    return {
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      totalAmount: totalLoanAmount,
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and loan portfolios
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Directory
          </CardTitle>
          <CardDescription>
            View and manage all customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Total Loans</TableHead>
                <TableHead>Active Loans</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const stats = getCustomerStats(customer.customer_id);
                return (
                  <TableRow key={customer.customer_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Member since {new Date(customer.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {customer.customer_id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {stats.totalLoans}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stats.activeLoans > 0 ? "default" : "outline"}>
                        {stats.activeLoans}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ₹{stats.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link to={`/customers/${customer.customer_id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link to={`/loans/create?customer=${customer.customer_id}`}>
                          <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-1" />
                            New Loan
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customers found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;