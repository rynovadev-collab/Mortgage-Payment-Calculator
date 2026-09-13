import { UserMortgageData } from "@/types/mortgage";

/**
 * Calculate monthly interest rate from annual rate
 */
export const calculateMonthlyRate = (annualRate: number): number => {
  return annualRate / 100 / 12;
};

export const calculateRequiredMonthlyPayment = (
  mortgageAmount: number,
  annualRate: number,
  termMonths: number
): number => {
  if (mortgageAmount <= 0 || termMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;

  // Handles 0% mortgages
  if (monthlyRate === 0) {
    return mortgageAmount / termMonths;
  }

  const payment =
    mortgageAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return payment;
};

/**
 * Payment schedule row for detailed breakdown
 */
export interface PaymentScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  overpaymentPortion?: number;
}

/**
 * Generate complete payment schedule with month-by-month breakdown
 */
export const generatePaymentSchedule = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number,
  maxMonths: number
): PaymentScheduleRow[] => {
  const data: PaymentScheduleRow[] = [];
  let balance = mortgageAmount;
  const monthlyRate = calculateMonthlyRate(annualRate);
  const totalMonthlyPayment = monthlyPayment + overpaymentAmount;
  
  for (let month = 1; month <= maxMonths && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = totalMonthlyPayment - interestPayment;
    
    // Payment doesn't cover interest
    if (principalPayment <= 0) break;
    
    const overpaymentPortion = Math.min(overpaymentAmount, principalPayment);
    const regularPrincipal = principalPayment - overpaymentPortion;
    
    balance = Math.max(0, balance - principalPayment);
    
    data.push({
      month,
      payment: totalMonthlyPayment,
      principal: regularPrincipal,
      interest: interestPayment,
      balance: balance,
      overpaymentPortion: overpaymentPortion
    });
    
    if (balance <= 0) break;
  }
  
  return data;
};

/**
 * Balance projection data point for charts
 */
export interface BalanceProjection {
  month: number;
  balance: number;
  withoutOverpayment?: number;
}

/**
 * Calculate balance projection over time (with and without overpayment)
 */
export const calculateBalanceProjection = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number,
  maxMonths: number,
  includeComparison: boolean = true
): BalanceProjection[] => {
  const data: BalanceProjection[] = [];
  const monthlyRate = calculateMonthlyRate(annualRate);
  const totalPayment = monthlyPayment + overpaymentAmount;
  
  // Calculate with overpayment
  let balance = mortgageAmount;
  data.push({ month: 0, balance, withoutOverpayment: balance });
  
  // Calculate without overpayment (for comparison)
  let balanceWithoutOverpayment = mortgageAmount;
  
  for (let month = 1; month <= maxMonths; month++) {
    // With overpayment
    const interestPayment = balance * monthlyRate;
    const principalPayment = totalPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    
    const dataPoint: BalanceProjection = {
      month,
      balance: Math.round(balance)
    };
    
    // Without overpayment (if comparison needed)
    if (includeComparison && overpaymentAmount > 0) {
      const interestWithoutOverpayment = balanceWithoutOverpayment * monthlyRate;
      const principalWithoutOverpayment = monthlyPayment - interestWithoutOverpayment;
      balanceWithoutOverpayment = Math.max(0, balanceWithoutOverpayment - principalWithoutOverpayment);
      dataPoint.withoutOverpayment = Math.round(balanceWithoutOverpayment);
    }
    
    data.push(dataPoint);
    
    if (balance <= 0) break;
  }
  
  return data;
};

/**
 * Interest/Principal breakdown data point for charts
 */
export interface InterestPrincipalBreakdown {
  month: number;
  interest: number;
  principal: number;
  overpayment: number;
  date?: string;
}

/**
 * Calculate interest and principal breakdown over time
 */
export const calculateInterestPrincipalBreakdown = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number,
  maxMonths: number,
  startDate: Date = new Date()
): InterestPrincipalBreakdown[] => {
  const data: InterestPrincipalBreakdown[] = [];
  const monthlyRate = calculateMonthlyRate(annualRate);
  const totalPayment = monthlyPayment + overpaymentAmount;
  let balance = mortgageAmount;
  
  for (let month = 1; month <= maxMonths; month++) {
    if (balance <= 0) break;
    
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(totalPayment - interestPayment, balance);
    const overpaymentPortion = Math.min(overpaymentAmount, principalPayment);
    const regularPrincipalPayment = principalPayment - overpaymentPortion;
    
    balance = Math.max(0, balance - principalPayment);
    
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + month);
    
    data.push({
      month,
      interest: Math.round(interestPayment),
      principal: Math.round(regularPrincipalPayment),
      overpayment: Math.round(overpaymentPortion),
      date: currentDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    });
  }
  
  return data;
};

/**
 * Interest savings calculation result
 */
export interface InterestSavings {
  fullTerm: number;
  sixMonths: number;
  totalInterestWithOverpayment: number;
  totalInterestStandard: number;
  monthsToPayoff: number;
  monthsToPayoffStandard: number;
}

/**
 * Calculate total interest savings from overpayments
 */
export const calculateInterestSavings = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number,
  maxMonths: number
): InterestSavings => {
  const monthlyRate = calculateMonthlyRate(annualRate);
  
  console.log('=== INTEREST CALCULATION DEBUG ===');
  console.log('Inputs:', { mortgageAmount, annualRate, monthlyPayment, overpaymentAmount, maxMonths });
  
  // Calculate WITHOUT overpayments FIRST (standard) - ONLY for maxMonths
  console.log('\n--- WITHOUT OVERPAYMENT (limited to ' + maxMonths + ' months) ---');
  let balanceStandard = mortgageAmount;
  let totalInterestStandard = 0;
  let sixMonthInterestStandard = 0;
  
  for (let month = 1; month <= maxMonths; month++) {
    // Step 1: Calculate interest on current balance
    const interestPayment = balanceStandard * annualRate / 100 / 12;
    
    // Step 2: Calculate principal payment
    const principalPayment = monthlyPayment - interestPayment;
    
    console.log(`Month ${month}: Balance=${balanceStandard.toFixed(2)}, Interest=${interestPayment.toFixed(2)}, Principal=${principalPayment.toFixed(2)}`);
    
    if (principalPayment <= 0) break;
    
    totalInterestStandard += interestPayment;
    if (month <= 6) {
      sixMonthInterestStandard += interestPayment;
    }
    
    // Step 3: Calculate new balance by removing principal
    balanceStandard = balanceStandard - principalPayment;
    if (balanceStandard < 0) balanceStandard = 0;
  }
  console.log('Total Interest WITHOUT overpayment:', totalInterestStandard.toFixed(2));
  
  // Calculate WITH overpayments - ONLY for maxMonths
  console.log('\n--- WITH OVERPAYMENT (£' + overpaymentAmount + ', limited to ' + maxMonths + ' months) ---');
  let balanceWith = mortgageAmount;
  let totalInterestWithOverpayment = 0;
  let sixMonthInterestWithOverpayment = 0;
  
  for (let month = 1; month <= maxMonths; month++) {
    // Step 1: Calculate interest on current balance (recalculated each month based on NEW balance)
    const interestPayment = balanceWith * annualRate / 100 / 12;
    
    // Step 2: Calculate principal payment from monthly payment
    const principalPayment = monthlyPayment - interestPayment;
    
    // Step 4: Add overpayment to principal
    const totalPrincipalPayment = principalPayment + overpaymentAmount;
    
    console.log(`Month ${month}: Balance=${balanceWith.toFixed(2)}, Interest=${interestPayment.toFixed(2)}, Principal=${principalPayment.toFixed(2)}, Overpayment=${overpaymentAmount.toFixed(2)}, Total Principal=${totalPrincipalPayment.toFixed(2)}`);
    
    if (principalPayment <= 0) break;
    
    totalInterestWithOverpayment += interestPayment;
    if (month <= 6) {
      sixMonthInterestWithOverpayment += interestPayment;
    }
    
    // Step 3: Calculate new balance by removing total principal (including overpayment)
    balanceWith = balanceWith - totalPrincipalPayment;
    if (balanceWith < 0) balanceWith = 0;
  }
  console.log('Total Interest WITH overpayment:', totalInterestWithOverpayment.toFixed(2));
  
  // For full mortgage payoff calculations (monthsToPayoff)
  let tempBalance = mortgageAmount;
  let monthsToPayoff = 0;
  for (let month = 1; month <= 600 && tempBalance > 0; month++) {
    const interestPayment = tempBalance * annualRate / 100 / 12;
    const principalPayment = monthlyPayment - interestPayment;
    const totalPrincipalPayment = principalPayment + overpaymentAmount;
    if (principalPayment <= 0) break;
    tempBalance = tempBalance - totalPrincipalPayment;
    if (tempBalance < 0) tempBalance = 0;
    monthsToPayoff = month;
    if (tempBalance <= 0) break;
  }
  
  let tempBalanceStandard = mortgageAmount;
  let monthsToPayoffStandard = 0;
  for (let month = 1; month <= 600 && tempBalanceStandard > 0; month++) {
    const interestPayment = tempBalanceStandard * annualRate / 100 / 12;
    const principalPayment = monthlyPayment - interestPayment;
    if (principalPayment <= 0) break;
    tempBalanceStandard = tempBalanceStandard - principalPayment;
    if (tempBalanceStandard < 0) tempBalanceStandard = 0;
    monthsToPayoffStandard = month;
    if (tempBalanceStandard <= 0) break;
  }
  
  const interestSaved = totalInterestStandard - totalInterestWithOverpayment;
  console.log('\n=== RESULTS ===');
  console.log('Total Interest WITHOUT overpayment:', totalInterestStandard.toFixed(2));
  console.log('Total Interest WITH overpayment:', totalInterestWithOverpayment.toFixed(2));
  console.log('Interest Saved:', interestSaved.toFixed(2));
  console.log('Calculation: ' + totalInterestStandard.toFixed(2) + ' - ' + totalInterestWithOverpayment.toFixed(2) + ' = ' + interestSaved.toFixed(2));
  console.log('==================\n');
  
  return {
    fullTerm: interestSaved,
    sixMonths: sixMonthInterestStandard - sixMonthInterestWithOverpayment,
    totalInterestWithOverpayment,
    totalInterestStandard,
    monthsToPayoff,
    monthsToPayoffStandard
  };
};

/**
 * Calculate mortgage term in months based on payment amount
 */
export const calculateMortgageTerm = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number = 0
): number => {
  if (!mortgageAmount || !annualRate || !monthlyPayment) {
    return 360; // Default to 30 years
  }

  const monthlyRate = calculateMonthlyRate(annualRate);
  const totalPayment = monthlyPayment + overpaymentAmount;
  let balance = mortgageAmount;
  let months = 0;

  // Calculate how many months it takes to pay off the mortgage
  while (balance > 0 && months < 480) { // Cap at 40 years for safety
    const interestPayment = balance * monthlyRate;
    const principalPayment = totalPayment - interestPayment;
    
    if (principalPayment <= 0) break;
    
    balance -= principalPayment;
    months++;
  }

  return months;
};

/**
 * Calculate months remaining until contract end date
 */
export const calculateMonthsUntilDate = (endDate: string): number => {
  if (!endDate) return 0;
  
  const today = new Date();
  const end = new Date(endDate);
  
  const monthsDiff = (end.getFullYear() - today.getFullYear()) * 12 + 
                    (end.getMonth() - today.getMonth());
  
  return Math.max(0, monthsDiff);
};

/**
 * Overpayment scenario comparison result
 */
export interface OverpaymentScenario {
  overpayment: number;
  totalInterest: number;
  monthsToPayoff: number;
  data: BalanceProjection[];
  monthlyData: BalanceProjection[];
}

/**
 * Calculate projection for a specific overpayment scenario
 */
export const calculateOverpaymentScenario = (
  mortgageAmount: number,
  annualRate: number,
  monthlyPayment: number,
  overpaymentAmount: number,
  maxMonths: number
): OverpaymentScenario => {
  const monthlyRate = calculateMonthlyRate(annualRate);
  let balance = mortgageAmount;
  const totalMonthlyPayment = monthlyPayment + overpaymentAmount;
  const data: BalanceProjection[] = [];
  const monthlyData: BalanceProjection[] = [];
  let totalInterest = 0;
  let month = 0;

  while (balance > 0 && month < maxMonths) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = totalMonthlyPayment - interestPayment;
    
    if (principalPayment <= 0) break;
    
    balance = Math.max(0, balance - principalPayment);
    totalInterest += interestPayment;
    month++;

    // Store data for both chart and table
    const dataPoint = {
      month: month,
      balance: balance,
    };
    
    monthlyData.push(dataPoint);
    data.push(dataPoint);
    
    if (balance <= 0) break;
  }

  return { 
    overpayment: overpaymentAmount,
    totalInterest, 
    monthsToPayoff: month,
    data,
    monthlyData
  };
};
