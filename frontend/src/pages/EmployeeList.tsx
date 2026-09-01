import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Employee {
  id: string;
  full_name: string;
  email: string;
  leave_balance_days: number;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch('/api/employees', {
      headers: { 'x-user-id': 'system', 'x-user-role': 'hr' }
    })
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Employees</h2>
      <Link to="/employees/create">Create New Employee</Link>
      <ul>
        {employees.map(e => (
          <li key={e.id}>
            {e.full_name} – {e.email} – Balance: {e.leave_balance_days} days
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
