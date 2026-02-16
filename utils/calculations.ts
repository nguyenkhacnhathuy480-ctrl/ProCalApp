import { Inputs, CalculationResult } from '../types';

export const calculateProfit = (inputs: Inputs): CalculationResult => {
  const purchase = Number(inputs.purchasePrice) || 0;
  const sell = Number(inputs.sellingPrice) || 0;
  const feePercent = Number(inputs.platformFeePercent) || 0;
  const shipping = Number(inputs.shippingFee) || 0;
  const ads = Number(inputs.adCost) || 0;

  const platformFeeAmount = sell * (feePercent / 100);
  const totalCost = purchase + shipping + ads + platformFeeAmount;
  const profit = sell - totalCost;
  
  let margin = 0;
  if (sell !== 0) {
    margin = (profit / sell) * 100;
  }

  let roi = 0;
  if (totalCost !== 0) {
    roi = (profit / totalCost) * 100;
  }

  // Break Even: (Fixed Costs) / (1 - Variable Fee Rate)
  // Variable Fee Rate = feePercent / 100
  // Fixed Costs here refers to costs not dependent on final sell price percentage (Purchase + Shipping + Ads)
  const fixedCosts = purchase + shipping + ads;
  let breakEven = 0;
  const contributionMarginRatio = 1 - (feePercent / 100);
  
  if (contributionMarginRatio > 0) {
    breakEven = fixedCosts / contributionMarginRatio;
  }

  return {
    profit,
    margin,
    breakEven,
    roi,
    totalCost,
    isLoss: profit < 0
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};