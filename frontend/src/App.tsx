import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import EmployeeCreate from './pages/EmployeeCreate';
import LeaveRequestList from './pages/LeaveRequestList';
import LeaveRequestCreate from './pages/LeaveRequestCreate';

const App: React.FC = () => {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/employees" style={{ marginRight: '1rem' }}>Employees</Link>
        <Link to="/leave-requests" style={{ marginRight: '1rem' }}>Leave Requests</Link>
      </nav>
      <Routes>
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/create" element={<EmployeeCreate />} />
        <Route path="/leave-requests" element={<LeaveRequestList />} />
        <Route path="/leave-requests/create" element={<LeaveRequestCreate />} />
      </Routes>
    </Router>
  );
};

export default App;
