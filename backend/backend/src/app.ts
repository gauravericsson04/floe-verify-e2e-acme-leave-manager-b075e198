import express from 'express';
import cors from 'cors';
import employeeRouter from './controllers/EmployeeController';
import leaveRequestRouter from './controllers/LeaveRequestController';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRouter);
app.use('/api/leave-requests', leaveRequestRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
