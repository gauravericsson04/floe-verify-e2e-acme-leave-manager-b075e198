import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  reason_text?: string;
  status: string;
}

const LeaveRequestList: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    // For demo we assume the logged in user is an employee with id 'employee-1'
    fetch('/api/leave-requests', {
      headers: { 'x-user-id': 'employee-1', 'x-user-role': 'employee' }
    })
      .then(r => r.json())
      .then(setRequests);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Leave Requests</h2>
      <Link to="/leave-requests/create">Create New Request</Link>
      <ul>
        {requests.map(r => (
          <li key={r.id}>
            {r.start_date} to {r.end_date} – {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequestList;
