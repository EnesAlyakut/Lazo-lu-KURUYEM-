export interface CartItemWithWeight {
  variant?: string;
  quantity: number;
  [key: string]: any;
}

export function calculateTotalWeight(items: CartItemWithWeight[]): number {
  let totalWeightInKg = 0;

  for (const item of items) {
    let weightInKg = 0;
    
    const variant = (item.variant || "").toLowerCase();
    
    if (variant.includes("kg")) {
      const match = variant.match(/([\d.,]+)\s*kg/);
      if (match) {
        weightInKg = parseFloat(match[1].replace(',', '.'));
      }
    } else if (variant.includes("g") || variant.includes("gr")) {
      const match = variant.match(/([\d.,]+)\s*(?:gr|g)/);
      if (match) {
        weightInKg = parseFloat(match[1].replace(',', '.')) / 1000;
      }
    } else {
      // Default fallback if variant doesn't have explicit weight
      weightInKg = 0.5; // assume 500g as standard
    }
    
    totalWeightInKg += weightInKg * item.quantity;
  }
  
  return totalWeightInKg;
}

export function calculateShippingCost(totalKg: number): number {
  
  if (totalKg <= 3) return 225;
  if (totalKg <= 5) return 275;
  if (totalKg <= 10) return 300;
  if (totalKg <= 15) return 350;
  if (totalKg <= 20) return 450;
  if (totalKg <= 25) return 550;
  if (totalKg <= 30) return 650;
  
  // KG BİRİM FİYAT 21,00
  // Her ekstra KG için 21 TL eklenecek
  const extraKg = Math.ceil(totalKg - 30);
  return 650 + (extraKg * 21);
}
