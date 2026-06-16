import React from 'react';
import { CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { formatCedi } from '../utils/format';

export default function BookingSuccess({ token, form, selectedServices, totalCost, depositRequired, treatmentFee, onReset }) {
  const [copied, setCopied] = React.useState(false);
  const cleanToken = token.startsWith('SP') ? token : `SP-${token}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto text-center p-8 bg-white border border-blush rounded-3xl studio-shadow space-y-6 animate-fadeIn text-left my-8">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm animate-scaleIn">
        <CheckCircle2 size={32} />
      </div>

      {/* Main Headers */}
      <div className="space-y-1 text-center">
        <h3 className="font-serif text-2xl font-bold text-studio-dark uppercase tracking-wide">Booking Received!</h3>
        <p className="text-xs text-studio-gray">Your appointment was successful.</p>
      </div>

      {/* Receipt Card */}
      <div className="p-5 bg-blush-light/30 rounded-2xl font-mono text-xs space-y-3 border border-blush/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-100 bg-rosegold"></div>
        
        {/* Interactive Token Row */}
        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blush/20">
          <div>
            <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider">Booking ID</span>
            <span className="font-bold text-sm text-studio-dark tracking-wide">{cleanToken}</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-studio-bg rounded-lg transition-colors border border-transparent hover:border-blush/40 cursor-pointer text-studio-gray hover:text-rosegold"
            title="Copy Code"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Schedule */}
        <div className="pt-1">
          <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider">Schedule Reservation</span>
          <span className="font-bold text-studio-dark text-xs">
            {new Date(form.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} @ {form.time}
          </span>
        </div>

        {/* Client Metadata */}
        <div>
          <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider">Guest Identity</span>
          <span className="font-bold text-studio-dark text-xs">{form.name} ({form.phone})</span>
        </div>

        {/* Location Summary */}
        <div>
          <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider">Location Target</span>
          <span className="font-bold text-studio-dark text-xs">{form.city}, {form.region}</span>
        </div>
        
        {/* Core Services Selected */}
        <div className="pt-2 border-t border-blush/20">
          <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider mb-1">Selected Items</span>
          <ul className="list-disc list-inside pl-1 text-studio-dark font-sans font-medium space-y-1">
            {selectedServices.map(s => (
              <li key={s.id} className="text-[11px]">{s.name} <span className="font-mono text-studio-gray text-[10px]">({formatCedi(s.price)})</span></li>
            ))}
            <li className="text-[11px] text-rosegold font-bold">Mandatory Treatment Care: {formatCedi(treatmentFee)}</li>
          </ul>
        </div>

         <div className="pt-1">
          <span className="text-studio-gray block text-[10px] uppercase font-bold tracking-wider">Payment Instructions</span>
          <span className="font-bold text-studio-dark text-xs">
            Below are payment Details:
            <li className="text-[11px] text-rosegold font-bold"> 👤Name on Momo: Juliet Sena Dogbe</li>
            <li className="text-[11px] text-rosegold font-bold"> 📱Momo Number: 0550396789</li>
            <li className="font-bold text-studio-dark text-xs text-[11px]"> Important:
Please use your Booking ID as your refrence when making payment. Your appointment will be confirmed once payment is received.</li>
            
          </span>
        </div>

        {/* Total Ledger Summary */}
        <div className="pt-2 border-t border-blush/20 flex justify-between items-center font-sans">
          <span className="text-studio-gray font-medium">Subtotal Cost:</span> 
          <span className="font-bold text-base text-studio-dark font-mono">{formatCedi(totalCost)}</span>
        </div>



        {/* Mobile Money Callout Bar */}
        <div className="bg-rosegold/5 p-3 rounded-xl border border-rosegold/20 flex justify-between items-center font-sans">
          <div>
            <span className="text-rosegold font-bold block text-xs">50% MoMo Deposit Due</span>
            <span className="text-[10px] text-studio-gray font-normal normal-case">Pay to lock your calendar slot</span>
          </div>
          <span className="font-mono text-base font-black text-rosegold">{formatCedi(depositRequired)}</span>
        </div>
      </div>

      {/* Instructional Actions Footer */}
      <div className="space-y-4">
        <p className="text-[11px] text-studio-gray leading-relaxed text-center px-2">
          An automated invoice has been dispatched to <span className="font-bold text-studio-dark">{form.email}</span>. Please reference your booking token code when matching payment transfers.
        </p>

        <div className="flex items-center justify-center gap-2 bg-studio-bg p-2.5 rounded-xl border border-blush/20 text-[10px] uppercase tracking-wider text-studio-gray font-mono">
          <ShieldCheck size={14} className="text-rosegold shrink-0" /> Tokenized Secure Authorization Receipt
        </div>

        <button 
          onClick={onReset}
          className="w-full py-3 bg-studio-dark text-blush text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rosegold hover:text-white transition-all duration-300 shadow-sm font-sans cursor-pointer"
        >
          Return to Booking Screen
        </button>
      </div>
    </div>
  );
}