'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

type TickToggleProps = {
  initialValue: boolean;
  orderId: string;
  fieldToUpdate: 'delivered' | 'total_pay_completed'; // extend if needed
  label?: string;
};

const TickToggle = ({ initialValue, orderId, fieldToUpdate }: TickToggleProps) => {
    const [value, setValue] = useState<boolean>(() => initialValue);

  const handleToggle = async () => {
    const newStatus = !value;
    setValue(newStatus);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [fieldToUpdate]: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setValue(!newStatus); // rollback
    }
  };

  return (
    <div className="pl-12 pb-24 flex items-center gap-2 cursor-pointer" onClick={handleToggle}>
      <div
        className={`w-5 h-5 flex items-center justify-center rounded border border-gray-400 ${
          value ? 'bg-green-500 text-white' : 'bg-white'
        }`}
      >
        {value && <Check size={16} />}
      </div>
    </div>
  );
};

export default TickToggle;
