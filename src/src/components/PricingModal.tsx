import { useState } from 'react';
import { X, Check, Zap, Crown, Gamepad2, Box, ExternalLink, Loader2 } from 'lucide-react';
import { RAZORPAY_PLANS, formatINR, type RazorpayPlan } from '@/lib/razorpay';

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  initialType?: '2d' | '3d';
}

export function PricingModal({ open, onClose, initialType = '2d' }: PricingModalProps) {
  const [selectedType, setSelectedType] = useState<'2d' | '3d'>(initialType);
  const [redirecting, setRedirecting] = useState(false);

  if (!open) return null;

  const plans = RAZORPAY_PLANS[selectedType];

  function handleSubscribe(plan: RazorpayPlan) {
    setRedirecting(true);
    window.open(plan.paymentUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setRedirecting(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="relative px-6 py-6 border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-sm text-gray-400 mt-1">Subscribe via Razorpay to unlock game generation</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl bg-white/5">
            <button onClick={() => setSelectedType('2d')}
              className={`py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedType === '2d' ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-400 hover:text-white'
              }`}>
              <Gamepad2 className="w-4 h-4" /> 2D Game Generation
            </button>
            <button onClick={() => setSelectedType('3d')}
              className={`py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedType === '3d' ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-gray-950 shadow-lg shadow-accent-500/30' : 'text-gray-400 hover:text-white'
              }`}>
              <Box className="w-4 h-4" /> 3D Game Generation
            </button>
          </div>
        </div>

        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isAnnual = plan.period === 'annual';
            return (
              <div key={plan.id}
                className={`relative rounded-2xl border p-5 transition-all hover:scale-[1.02] ${
                  isAnnual ? 'border-accent-500/30 bg-accent-500/[0.05]' : 'border-white/10 bg-white/[0.03]'
                }`}>
                {isAnnual && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 text-gray-950 text-xs font-bold whitespace-nowrap">BEST VALUE</div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  {isAnnual ? <Crown className="w-5 h-5 text-accent-400" /> : <Zap className="w-5 h-5 text-primary-400" />}
                  <h3 className="font-bold text-lg">{isAnnual ? 'Annual' : 'Monthly'}</h3>
                </div>
                <div className="mb-1">
                  <span className="font-display text-3xl font-bold">{formatINR(plan.price)}</span>
                  <span className="text-sm text-gray-400 ml-1">/{isAnnual ? 'year' : 'month'}</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">{selectedType === '2d' ? '2D' : '3D'} Game Generation</div>
                {plan.bonus && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20">
                    <p className="text-sm font-semibold text-accent-300 flex items-center gap-1.5"><Check className="w-4 h-4" /> {plan.bonus}</p>
                    <p className="text-xs text-accent-400/70 mt-0.5">{plan.monthsAccess} months total access</p>
                  </div>
                )}
                {!plan.bonus && <div className="mb-4 h-0" />}
                <ul className="space-y-2 mb-5">
                  <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-accent-400 flex-shrink-0" /> Unlimited game generations</li>
                  <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-accent-400 flex-shrink-0" /> All {selectedType === '2d' ? '2D' : '3D'} game templates</li>
                  <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-accent-400 flex-shrink-0" /> Custom prompts &amp; themes</li>
                  <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-accent-400 flex-shrink-0" /> {plan.monthsAccess} month{plan.monthsAccess > 1 ? 's' : ''} access</li>
                </ul>
                <button onClick={() => handleSubscribe(plan)} disabled={redirecting}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isAnnual ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-gray-950 hover:from-accent-300 hover:to-accent-400 shadow-lg shadow-accent-500/30'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-lg shadow-primary-500/30'
                  } hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60`}>
                  {redirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe via Razorpay <ExternalLink className="w-4 h-4" /></>}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
            <p className="text-xs text-gray-500">Secure payments powered by <span className="font-semibold text-gray-300">Razorpay</span>. You'll be redirected to the official Razorpay payment page to complete your subscription.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
