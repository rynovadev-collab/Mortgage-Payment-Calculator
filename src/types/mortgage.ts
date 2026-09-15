export interface MortgageData {
  mortgageAmount: number;
  currentRate: number;
  monthlyPayment: number;
  loanTermMonths: number;
  overpayment: number;
  lumpSumAmount?: number;
}

export interface UserMortgageData {
  mortgageAmount: number;
  currentRate: number;
  remainingTermYears: number;
  remainingTermMonths: number;
  monthlyPayment: number;
  overpaymentAmount: number;
  lumpSumAmount: number;
}