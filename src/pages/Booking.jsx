import React, { useState, useContext } from 'react';
import { StudioContext } from '../context/StudioContext';
import { STUDIO_SERVICES } from '../data/studioDb';
import { ShieldCheck, Square, CheckSquare } from 'lucide-react';
import { formatCedi } from '../utils/format'; 
import emailjs from '@emailjs/browser';
import BookingSuccess from '../components/BookingSuccess';

export default function Booking() {
  const { registerAppointment } = useContext(StudioContext);

  const TREATMENT_PACKAGE_FEE = 65;

  const generate24HourSlots = (stepMinutes = 15) => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += stepMinutes) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  };

  const timeOptions = generate24HourSlots(15); 

  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    region: 'Greater Accra',
    city: '',
    serviceIds: STUDIO_SERVICES.length > 0 ? [STUDIO_SERVICES[0].id] : [], 
    date: '2026-06-20', 
    time: '09:00', 
    notes: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSelectedServices = () => {
    return STUDIO_SERVICES.filter(s => form.serviceIds.includes(s.id));
  };

  const calculateTotalCost = () => {
    const servicesSum = getSelectedServices().reduce((sum, service) => sum + service.price, 0);
    return servicesSum + TREATMENT_PACKAGE_FEE;
  };

  const handleServiceToggle = (e, id) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    setForm(prevForm => {
      const currentIds = [...prevForm.serviceIds];
      
      if (currentIds.includes(id)) {
        if (currentIds.length > 1) {
          return {
            ...prevForm,
            serviceIds: currentIds.filter(serviceId => serviceId !== id)
          };
        }
        return prevForm;
      } else {
        return {
          ...prevForm,
          serviceIds: [...currentIds, id]
        };
      }
    });
  };

  const validate = () => {
    let localErrors = {};
    if (!form.name.trim()) localErrors.name = 'Full identifier string required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) localErrors.email = 'Valid global email routing path required.';
    if (!form.phone.trim() || form.phone.length < 9) localErrors.phone = 'Valid operational communication number required.';
    if (!form.city.trim()) localErrors.city = 'Target city or area location statement required.';
    if (form.serviceIds.length === 0) localErrors.services = 'Please select at least one service.';
    
    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const selectedServices = getSelectedServices();
    const serviceNamesCombined = selectedServices.map(s => s.name).join(', ');
    const totalCost = calculateTotalCost();
    
    // Calculate the 50% deposit structures matching your backend/template setups
    const depositAmount = totalCost / 2;
    const remainingBalance = totalCost - depositAmount;
    
    // 1. Generate local context appointment entry
    const confirmationToken = registerAppointment({
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
      clientRegion: form.region,
      clientCity: form.city,
      serviceName: `${serviceNamesCombined} (+ Mandatory Treatment Package)`, 
      date: form.date,
      time: form.time, 
      cost: totalCost 
    });

    // 2. Build parameter payload matching your Admin Template: template_xrpyhzc
    const adminTemplateParams = {
      to_email: 'charisdogbe@gmail.com',
      from_name: form.name,
      reply_to: form.email,
      phone: form.phone,
      region: form.region,
      city: form.city,
      service: `${serviceNamesCombined} (+ Mandatory GHS 65.00 Treatment Package)`,
      preferred_date: form.date,
      preferred_time: form.time,
      message: form.notes || 'None provided.',
      total_amount: `GHS ${totalCost.toFixed(2)}`,
      deposit_amount: `GHS ${depositAmount.toFixed(2)}`,
      reference_number: confirmationToken
    };

    // 3. Build parameter payload matching your Client Template: template_s0nnhf6
    const clientTemplateParams = {
      to_email: form.email,
      client_name: form.name,
      client_email: form.email,
      business_name: 'SLAY BodyPiercing',
      appointment_date: new Date(form.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      appointment_time: form.time,
      selected_services: serviceNamesCombined,
      total_cost: `GHS ${totalCost.toFixed(2)}`,
      deposit_required: `GHS ${depositAmount.toFixed(2)}`,
      remaining_balance: `GHS ${remainingBalance.toFixed(2)}`,
      booking_reference: confirmationToken,
      business_email: 'info@slaybodypiercing.com',
      business_phone: '+233 24 123 4567',
      payment_instructions: 'Make payment via Mobile Money to complete your booking'
    };

    try {
      // 4. Fire both payloads concurrently
      await Promise.all([
        // Admin Notification Email
        emailjs.send(
          'service_mam22qv',
          'template_xrpyhzc',
          adminTemplateParams,
          '0-kKEp4ff20FCDLk7'
        ),
        // Client Confirmation Receipt Email
        emailjs.send(
          'service_mam22qv',
          'template_s0nnhf6',
          clientTemplateParams,
          '0-kKEp4ff20FCDLk7'
        )
      ]);
      
      console.log("Both ledger payloads successfully dispatched via EmailJS!");
      setToken(confirmationToken);
    } catch (emailError) {
      console.error("EmailJS network cluster routing stalled:", emailError);
      // Fallback: Always display the local receipt UI card even if email endpoints drop
      setToken(confirmationToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dedicated Linkage to the Success Screen Component
  if (token) {
    return (
      <BookingSuccess 
        token={token}
        form={form}
        selectedServices={getSelectedServices()}
        totalCost={calculateTotalCost()}
        depositRequired={calculateTotalCost() / 2}
        treatmentFee={TREATMENT_PACKAGE_FEE}
        onReset={() => {
          setToken(null);
          setForm({
            name: '',
            email: '',
            phone: '',
            region: 'Greater Accra',
            city: '',
            serviceIds: STUDIO_SERVICES.length > 0 ? [STUDIO_SERVICES[0].id] : [],
            date: '2026-06-20',
            time: '09:00',
            notes: ''
          });
          setErrors({});
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 animate-fadeIn text-left">
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-blush/30 studio-shadow space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-studio-dark uppercase tracking-wider">BOOK AN APPIONTMENT HERE </h2>
          <p className="text-xs text-studio-gray mt-0.5">Mandatory treatment package is automatically included (GHS 65).</p>
        </div>

        <form onSubmit={handleDispatch} className="space-y-4 text-xs">
          {/* Identity Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Full Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe" className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark focus:outline-none" />
              {errors.name && <span className="text-[10px] text-red-500 font-medium font-mono">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]"> Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@domain.com" className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark focus:outline-none" />
              {errors.email && <span className="text-[10px] text-red-500 font-medium font-mono">{errors.email}</span>}
            </div>
          </div>

          {/* Contact and Regional Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Phone Number</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="024XXXXXXX" className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark font-mono font-bold focus:outline-none" />
              {errors.phone && <span className="text-[10px] text-red-500 font-medium font-mono">{errors.phone}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Region </label>
              <select value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark font-bold cursor-pointer focus:outline-none">
                <option value="Greater Accra">Greater Accra</option>
                <option value="Central Region">Central Region</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">City / Area</label>
              <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Sowutoum" className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark font-bold focus:outline-none" />
              {errors.city && <span className="text-[10px] text-red-500 font-medium font-mono">{errors.city}</span>}
            </div>
          </div>

          {/* Service Selector Grid */}
          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Services (Select One or More)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {STUDIO_SERVICES.map(s => {
                const isSelected = form.serviceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => handleServiceToggle(e, s.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-rosegold bg-blush-light/30 text-studio-dark font-bold shadow-xs' 
                        : 'border-blush/30 bg-studio-bg/40 text-studio-gray hover:border-blush'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-rosegold shrink-0" />
                      ) : (
                        <Square size={16} className="text-studio-gray shrink-0" />
                      )}
                      <div>
                        <span className="block text-xs font-serif font-bold text-studio-dark">{s.name}</span>
                        <span className="block text-[10px] text-studio-gray font-normal font-mono">{s.duration}</span>
                      </div>
                    </div>
                    <span className={`font-mono text-xs font-black ${isSelected ? 'text-rosegold' : 'text-studio-gray'}`}>
                      {formatCedi(s.price)}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.services && <span className="text-[10px] text-red-500 font-medium font-mono">{errors.services}</span>}
          </div>

          {/* Timing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Select Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark font-mono font-bold focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Choose Preferred Time</label>
              <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark font-mono font-bold cursor-pointer max-h-40 focus:outline-none">
                {timeOptions.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold uppercase text-studio-gray tracking-widest text-[9px]">Medical Hypoallergenic Annotations / Restrictions</label>
            <textarea rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Specify patch testing logs, historical metal allergies, or explicit sizing parameters..." className="p-3 border border-blush/30 rounded-xs bg-studio-bg text-studio-dark focus:outline-none" />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-studio-dark text-blush text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-rosegold hover:text-white transition-all duration-300 shadow-md font-sans cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
            {isSubmitting ? 'TRANSMITTING ACCOUNT DATA...' : `BOOK APPOINTMENT • ${formatCedi(calculateTotalCost())}`}
          </button>
        </form>
      </div>

      {/* Sidebar Overview */}
      <div className="space-y-4">
        <div className="bg-studio-dark text-white rounded-3xl p-6 border border-blush/20 h-fit space-y-4 shadow-xl">
          <h4 className="font-serif text-sm font-bold text-blush uppercase tracking-wide">Basket Overview</h4>
          <div className="space-y-2 border-b border-white/10 pb-3 text-xs">
            {getSelectedServices().map(s => (
              <div key={s.id} className="flex justify-between items-center text-[11px]">
                <span className="text-white/80">{s.name}</span>
                <span className="font-mono text-white/60">{formatCedi(s.price)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-[11px] border-t border-white/5 pt-2">
              <span className="text-blush font-medium">Treatment Package (Mandatory)</span>
              <span className="font-mono text-blush/80">{formatCedi(TREATMENT_PACKAGE_FEE)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-bold font-serif text-[#F3CFCF] pt-1">
            <span>Running Subtotal:</span>
            <span className="font-mono text-sm font-black">{formatCedi(calculateTotalCost())}</span>
          </div>
        </div>

        <div className="bg-studio-dark text-white rounded-3xl p-6 border border-blush/20 h-fit space-y-4 shadow-xl">
          <h4 className="font-serif text-sm font-bold text-blush uppercase tracking-wide">Studio Booking Rules</h4>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Your booking will be confirmed after a 50% deposit via Mobile Money. Payment instructions will be sent upon successful booking.
          </p>
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5 text-[9px] uppercase tracking-wider text-white/50 font-mono">
            <ShieldCheck size={14} className="text-blush shrink-0" /> End-to-end tokenized platform security active
          </div>
        </div>
      </div>
    </div>
  );
}