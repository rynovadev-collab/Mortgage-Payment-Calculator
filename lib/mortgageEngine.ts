export interface MortgageScenarioInput {
  mortgageAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  monthlyOverpayment?: number;
  lumpSum?: number;
}

export interface MortgageScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageScenarioResult {
  startingBalance: number;
  monthlyPayment: number;
  monthlyOverpayment: number;
  totalMonthlyPayment: number;

  months: number;
  totalInterest: number;
  totalPaid: number;

  schedule: MortgageScheduleRow[];
}

export const calculateMortgageScenario = ({
  mortgageAmount,
  annualRate,
  termMonths,
  monthlyPayment,
  monthlyOverpayment = 0,
  lumpSum = 0,
}: MortgageScenarioInput): MortgageScenarioResult => {
  const safeMortgageAmount = Math.max(0, mortgageAmount);
  const safeRate = Math.max(0, annualRate);
  const safeTermMonths = Math.max(1, Math.round(termMonths));
  const safeMonthlyPayment = Math.max(0, monthlyPayment);
  const safeOverpayment = Math.max(0, monthlyOverpayment);
  const safeLumpSum = Math.max(0, lumpSum);

  const startingBalance = Math.max(
    0,
    safeMortgageAmount - safeLumpSum
  );

  const monthlyRate = safeRate / 100 / 12;

  const totalMonthlyPayment =
    safeMonthlyPayment + safeOverpayment;

  let balance = startingBalance;
  let totalInterest = 0;
  let totalPaid = safeLumpSum;

  const schedule: MortgageScheduleRow[] = [];

  let month = 0;

  /*
   * 1,200 months = 100 years.
   * This protects the browser against invalid combinations
   * where the payment never clears the mortgage.
   */
  while (
    balance > 0.01 &&
    month < 1200 &&
    month < safeTermMonths + 900
  ) {
    const interest = balance * monthlyRate;

    // Mortgage would never reduce.
    if (
      totalMonthlyPayment <= interest &&
      monthlyRate > 0
    ) {
      break;
    }

    const actualPayment = Math.min(
      totalMonthlyPayment,
      balance + interest
    );

    const principal = Math.max(
      0,
      actualPayment - interest
    );

    balance = Math.max(
      0,
      balance - principal
    );

    totalInterest += interest;
    totalPaid += actualPayment;
    month++;

    schedule.push({
      month,
      payment: actualPayment,
      principal,
      interest,
      balance,
    });

    if (principal <= 0) {
      break;
    }
  }

  return {
    startingBalance,
    monthlyPayment: safeMonthlyPayment,
    monthlyOverpayment: safeOverpayment,
    totalMonthlyPayment,

    months: month,
    totalInterest,
    totalPaid,

    schedule,
  };
};

export const formatMortgageDuration = (
  months: number
): string => {
  if (months <= 0) {
    return "0 months";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} ${
      remainingMonths === 1 ? "month" : "months"
    }`;
  }

  if (remainingMonths === 0) {
    return `${years} ${
      years === 1 ? "year" : "years"
    }`;
  }

  return `${years}y ${remainingMonths}m`;
};

export const calculateMortgageFreeDate = (
  months: number
): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date;
};