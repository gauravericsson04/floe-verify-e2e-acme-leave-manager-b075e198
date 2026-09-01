import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveRequestCreate: React.FC = () => {
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [reason_text, setReasonText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/leave-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'employee-1',
        'x-user-role': 'employee'
      },
      body: JSON.stringify({ start_date, end_date, reason_text })
    });
    navigate('/leave-requests');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input type="date" value={start_date} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={end_date} onChange={e => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label>Reason:</label>
          <textarea value={reason_text} onChange={e => setReasonText(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LeaveRequestCreate;
