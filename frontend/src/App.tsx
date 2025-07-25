import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateLoan from "./pages/CreateLoan";
import LoanLedger from "./pages/LoanLedger";
import MakePayment from "./pages/MakePayment";
import Customers from "./pages/Customers";
import CustomerOverview from "./pages/CustomerOverview";
import NotFound from "./pages/NotFound";
import PaymentsPage from './pages/PaymentsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:customerId" element={<CustomerOverview />} />
            <Route path="/loans/create" element={<CreateLoan />} />
            <Route path="/loans/:loanId/ledger" element={<LoanLedger />} />
            <Route path="/loans/:loanId/payment" element={<MakePayment />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
