import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BankingDatabase } from '@/lib/banking-logic';

const Dashboard = () => {
  const customers = BankingDatabase.getAllCustomers();
  const allLoans = customers.flatMap(customer => 
    BankingDatabase.getLoansByCustomerId(customer.customer_id)
  );
  
  const activeLoans = allLoans.filter(loan => loan.status === 'ACTIVE');
  const totalLoanAmount = allLoans.reduce((sum, loan) => sum + loan.total_amount, 0);
  const averageLoanAmount = allLoans.length > 0 ? totalLoanAmount / allLoans.length : 0;

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length.toString(),
      description: 'Active customer accounts',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Active Loans',
      value: activeLoans.length.toString(),
      description: 'Currently active loans',
      icon: CreditCard,
      color: 'text-accent',
    },
    {
      title: 'Total Portfolio',
      value: `₹${totalLoanAmount.toLocaleString('en-IN')}`,
      description: 'Total loan amount disbursed',
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      title: 'Average Loan',
      value: `₹${averageLoanAmount.toLocaleString('en-IN')}`,
      description: 'Average loan amount',
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to AgetBank Lending System
          </p>
        </div>
        <Link to="/loans/create">
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Latest customer registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 3).map((customer) => (
                <div key={customer.customer_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.customer_id}</p>
                  </div>
                  <Link to={`/customers/${customer.customer_id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <CardDescription>
              Current active loan accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeLoans.slice(0, 3).map((loan) => {
                const customer = BankingDatabase.getCustomerById(loan.customer_id);
                return (
                  <div key={loan.loan_id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{loan.principal_amount.toLocaleString('en-IN')} @ {loan.interest_rate}%
                      </p>
                    </div>
                    <Link to={`/loans/${loan.loan_id}/ledger`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;