export interface NormalizedCard {
  holderName: string;
  number: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
}

function luhnCheck(cardNumber: string) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum > 0 && sum % 10 === 0;
}

function isExpired(expireMonth: string, expireYear: string) {
  const month = Number(expireMonth);
  const year = 2000 + Number(expireYear);

  if (month < 1 || month > 12) return true;

  const now = new Date();
  const expiry = new Date(year, month, 0, 23, 59, 59, 999);
  return expiry < now;
}

export function normalizeAndValidateCard(input: {
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}): { ok: true; card: NormalizedCard } | { ok: false; message: string } {
  const holderName = input.cardHolder.trim().replace(/\s+/g, " ");
  const number = input.cardNumber.replace(/\D/g, "");
  const cvc = input.cardCvv.replace(/\D/g, "");
  const [expireMonth = "", expireYear = ""] = input.cardExpiry.split("/");

  if (holderName.length < 3) {
    return { ok: false, message: "Kart üzerindeki isim geçerli değil." };
  }

  if (!/^\d{13,19}$/.test(number) || !luhnCheck(number)) {
    return { ok: false, message: "Kart numarası geçerli değil." };
  }

  if (!/^\d{3,4}$/.test(cvc)) {
    return { ok: false, message: "CVV geçerli değil." };
  }

  if (!/^\d{2}$/.test(expireMonth) || !/^\d{2}$/.test(expireYear) || isExpired(expireMonth, expireYear)) {
    return { ok: false, message: "Kart son kullanma tarihi geçerli değil." };
  }

  return {
    ok: true,
    card: {
      holderName,
      number,
      expireMonth,
      expireYear: `20${expireYear}`,
      cvc,
    },
  };
}
