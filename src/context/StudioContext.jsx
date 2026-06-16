import React, { createContext, useState } from 'react';

export const StudioContext = createContext();

export function StudioProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  
  const registerAppointment = (bookingData) => {
    const confirmationToken = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      token: confirmationToken,
      timestamp: new Date().toISOString(),
      ...bookingData,
      status: 'Confirmed'
    };
    setAppointments((prev) => [newRecord, ...prev]);
    return confirmationToken;
  };

  return (
    <StudioContext.Provider value={{ appointments, registerAppointment }}>
      {children}
    </StudioContext.Provider>
  );
}