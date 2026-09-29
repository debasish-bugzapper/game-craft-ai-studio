export interface RazorpayPlan {
  id: string;
  label: string;
  price: number;
  period: 'monthly' | 'annual';
  monthsAccess: number;
  bonus: string;
  type: '2d' | '3d';
  paymentUrl: string;
}

export const RAZORPAY_PLANS: Record<string, RazorpayPlan[]> = {
  '2d': [
    { id: '2d-monthly', label: '2D Monthly', price: 1999, period: 'monthly', monthsAccess: 1, bonus: '', type: '2d', paymentUrl: 'https://rzp.io/rzp/I7tqH68h' },
    { id: '2d-annual', label: '2D Annual', price: 20000, period: 'annual', monthsAccess: 14, bonus: '2 Months Extra Free', type: '2d', paymentUrl: 'https://rzp.io/rzp/TuncMCLk' },
  ],
  '3d': [
    { id: '3d-monthly', label: '3D Monthly', price: 3999, period: 'monthly', monthsAccess: 1, bonus: '', type: '3d', paymentUrl: 'https://rzp.io/rzp/rwoCTFfn' },
    { id: '3d-annual', label: '3D Annual', price: 40000, period: 'annual', monthsAccess: 14, bonus: '2 Months Extra Free', type: '3d', paymentUrl: 'https://rzp.io/rzp/iDnwczf' },
  ],
};

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
