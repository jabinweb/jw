export const YEARLY_MAINTENANCE_DISCOUNT = 0.1; // 10% discount
export const YEARLY_SETUP_DISCOUNT = 0; // No discount on setup fee

export const calculateYearlyPrice = (monthlyPrice: number, isMaintenanceFee = false) => {
  const discount = isMaintenanceFee ? YEARLY_MAINTENANCE_DISCOUNT : YEARLY_SETUP_DISCOUNT;
  return monthlyPrice * (1 - discount);
};
