export interface Customer {
  customer_id: string;
  name: string;
  created_at: string;
}

export interface Loan {
  loan_id: string;
  customer_id: string;
  principal_amount: number;
  total_amount: number;
  interest_rate: number;
  loan_period_years: number;
  monthly_emi: number;
  status: 'ACTIVE' | 'PAID_OFF';
  created_at: string;
}

export interface Payment {
  payment_id: string;
  loan_id: string;
  amount: number;
  payment_type: 'EMI' | 'LUMP_SUM';
  payment_date: string;
}

export interface LoanTransaction {
  transaction_id: string;
  date: string;
  amount: number;
  type: string;
}

export interface LoanLedger {
  loan_id: string;
  customer_id: string;
  principal: number;
  total_amount: number;
  monthly_emi: number;
  amount_paid: number;
  balance_amount: number;
  emis_left: number;
  transactions: LoanTransaction[];
}

export interface CustomerOverview {
  customer_id: string;
  total_loans: number;
  loans: {
    loan_id: string;
    principal: number;
    total_amount: number;
    total_interest: number;
    emi_amount: number;
    amount_paid: number;
    emis_left: number;
  }[];
}

export interface LoanRequest {
  customer_id: string;
  loan_amount: number;
  loan_period_years: number;
  interest_rate_yearly: number;
}

export interface PaymentRequest {
  amount: number;
  payment_type: 'EMI' | 'LUMP_SUM';
}