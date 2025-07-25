
function calculateSimpleInterest(P, N, R) {
  return P * N * (R / 100);
}

function calculateTotalAmount(P, interest) {
  return P + interest;
}

function calculateMonthlyEMI(totalAmount, loanPeriodYears) {
  return +(totalAmount / (loanPeriodYears * 12)).toFixed(2);
}

module.exports = {
  calculateSimpleInterest,
  calculateTotalAmount,
  calculateMonthlyEMI
};
