import { Customer, Loan, Payment, LoanRequest, PaymentRequest, LoanLedger } from '@/types/banking';

// Banking calculations as per the specification
export class BankingCalculations {
  static calculateSimpleInterest(principal: number, years: number, rate: number): number {
    return principal * years * (rate / 100);
  }

  static calculateTotalAmount(principal: number, interest: number): number {
    return principal + interest;
  }

  static calculateMonthlyEMI(totalAmount: number, years: number): number {
    const totalMonths = years * 12;
    return totalAmount / totalMonths;
  }

  static calculateRemainingEMIs(remainingBalance: number, monthlyEMI: number): number {
    return Math.ceil(remainingBalance / monthlyEMI);
  }
 

}

// In-memory database simulation
export class BankingDatabase {
  private static customers: Customer[] = [
    {
      customer_id: 'CUST001',
      name: 'John Doe',
      created_at: new Date().toISOString(),
    },
    {
      customer_id: 'CUST002',
      name: 'Jane Smith',
      created_at: new Date().toISOString(),
    },
    {
      customer_id: 'CUST003',
      name: 'Robert Johnson',
      created_at: new Date().toISOString(),
    },
  ];

  private static loans: Loan[] = [];
  private static payments: Payment[] = [];

  static getAllCustomers(): Customer[] {
    return this.customers;
  }

  static getCustomerById(customerId: string): Customer | undefined {
    return this.customers.find(c => c.customer_id === customerId);
  }

  static createLoan(request: LoanRequest): Loan {
    const interest = BankingCalculations.calculateSimpleInterest(
      request.loan_amount,
      request.loan_period_years,
      request.interest_rate_yearly
    );
    const totalAmount = BankingCalculations.calculateTotalAmount(request.loan_amount, interest);
    const monthlyEMI = BankingCalculations.calculateMonthlyEMI(totalAmount, request.loan_period_years);

    const loan: Loan = {
      loan_id: `LOAN${(this.loans.length + 1).toString().padStart(3, '0')}`,
      customer_id: request.customer_id,
      principal_amount: request.loan_amount,
      total_amount: totalAmount,
      interest_rate: request.interest_rate_yearly,
      loan_period_years: request.loan_period_years,
      monthly_emi: monthlyEMI,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    this.loans.push(loan);
    return loan;
  }

  static getLoanById(loanId: string): Loan | undefined {
    return this.loans.find(l => l.loan_id === loanId);
  }

  static getLoansByCustomerId(customerId: string): Loan[] {
    return this.loans.filter(l => l.customer_id === customerId);
  }

  static addPayment(loanId: string, request: PaymentRequest): Payment {
    const payment: Payment = {
      payment_id: `PAY${(this.payments.length + 1).toString().padStart(4, '0')}`,
      loan_id: loanId,
      amount: request.amount,
      payment_type: request.payment_type,
      payment_date: new Date().toISOString(),
    };

    this.payments.push(payment);
    return payment;
  }

  static getPaymentsByLoanId(loanId: string): Payment[] {
    return this.payments.filter(p => p.loan_id === loanId);
  }

  static getLoanLedger(loanId: string): LoanLedger | null {
    const loan = this.getLoanById(loanId);
    if (!loan) return null;

    const payments = this.getPaymentsByLoanId(loanId);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceAmount = loan.total_amount - totalPaid;
    const emisLeft = BankingCalculations.calculateRemainingEMIs(balanceAmount, loan.monthly_emi);

    const transactions = payments.map(p => ({
      transaction_id: p.payment_id,
      date: p.payment_date,
      amount: p.amount,
      type: p.payment_type,
    }));

    return {
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: totalPaid,
      balance_amount: Math.max(0, balanceAmount),
      emis_left: Math.max(0, emisLeft),
      transactions,
    };
  }

  static updateLoanStatus(loanId: string, status: 'ACTIVE' | 'PAID_OFF'): void {
    const loan = this.getLoanById(loanId);
    if (loan) {
      loan.status = status;
    }
  }
   static getAllPayments(): Payment[] {
  return this.payments;
}
}