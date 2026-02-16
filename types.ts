export interface Inputs {
  purchasePrice: number | '';
  sellingPrice: number | '';
  platformFeePercent: number | '';
  shippingFee: number | '';
  adCost: number | '';
}

export interface CalculationResult {
  profit: number;
  margin: number;
  breakEven: number;
  roi: number;
  totalCost: number;
  isLoss: boolean;
}

export interface HistoryItem {
  id: string;
  date: string;
  inputs: Inputs;
  result: CalculationResult;
  productName: string;
}

export enum AppView {
  CALCULATOR = 'CALCULATOR',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}