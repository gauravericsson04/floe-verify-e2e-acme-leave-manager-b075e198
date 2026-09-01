import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeCreate: React.FC = () => {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'system',
        'x-user-role': 'hr'
      },
      body: JSON.stringify({ full_name, email })
    });
    navigate('/employees');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input value={full_name} onChange={e => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
