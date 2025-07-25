import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BankingDatabase, BankingCalculations } from '@/lib/banking-logic';
import { LoanRequest } from '@/types/banking';
import { useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';

const CreateLoan = () => {
  const [formData, setFormData] = useState<LoanRequest>({
    customer_id: '',
    loan_amount: 0,
    loan_period_years: 0,
    interest_rate_yearly: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calculations, setCalculations] = useState<{
    interest: number;
    totalAmount: number;
    monthlyEMI: number;
  } | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const customers = BankingDatabase.getAllCustomers();

  const calculateLoan = () => {
    if (formData.loan_amount > 0 && formData.loan_period_years > 0 && formData.interest_rate_yearly > 0) {
      const interest = BankingCalculations.calculateSimpleInterest(
        formData.loan_amount,
        formData.loan_period_years,
        formData.interest_rate_yearly
      );
      const totalAmount = BankingCalculations.calculateTotalAmount(formData.loan_amount, interest);
      const monthlyEMI = BankingCalculations.calculateMonthlyEMI(totalAmount, formData.loan_period_years);

      setCalculations({
        interest,
        totalAmount,
        monthlyEMI,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || formData.loan_amount <= 0 || formData.loan_period_years <= 0 || formData.interest_rate_yearly <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields with valid values.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const loan = BankingDatabase.createLoan(formData);
      
      toast({
        title: 'Loan Created Successfully',
        description: `Loan ID: ${loan.loan_id}`,
      });

      navigate(`/loans/${loan.loan_id}/ledger`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create loan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoanRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Auto-calculate when values change
  useEffect(() => {
    calculateLoan();
  }, [formData.loan_amount, formData.loan_period_years, formData.interest_rate_yearly]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Loan</h1>
        <p className="text-muted-foreground">
          Create a new loan account for an existing customer
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>
              Enter the loan parameters below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => handleInputChange('customer_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.customer_id} value={customer.customer_id}>
                        {customer.name} ({customer.customer_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={formData.loan_amount || ''}
                  onChange={(e) => handleInputChange('loan_amount', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Loan Period (Years)</Label>
                <Input
                  id="period"
                  type="number"
                  placeholder="Enter loan period in years"
                  value={formData.loan_period_years || ''}
                  onChange={(e) => handleInputChange('loan_period_years', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter interest rate"
                  value={formData.interest_rate_yearly || ''}
                  onChange={(e) => handleInputChange('interest_rate_yearly', parseFloat(e.target.value) || 0)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Loan...' : 'Create Loan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {calculations && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Loan Calculations
              </CardTitle>
              <CardDescription>
                Calculated values based on your input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Principal Amount:</span>
                <span className="font-bold">₹{formData.loan_amount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Interest:</span>
                <span className="font-bold text-warning">₹{calculations.interest.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount Payable:</span>
                <span className="font-bold text-primary">₹{calculations.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium">Monthly EMI:</span>
                <span className="font-bold text-accent text-lg">₹{calculations.monthlyEMI.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">Calculation Formula:</p>
                <p>Interest = P × N × R/100</p>
                <p>Total Amount = P + Interest</p>
                <p>Monthly EMI = Total Amount / (N × 12)</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateLoan;