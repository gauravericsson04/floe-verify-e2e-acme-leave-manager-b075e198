import { Router, Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { authMiddleware, authorize } from '../middleware/auth';

const router = Router();
const service = new EmployeeService();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const employees = await service.list();
  res.json(employees);
});

router.post('/', authorize('create', 'Employee'), async (req: Request, res: Response) => {
  const { full_name, email, leave_balance_days } = req.body;
  const employee = await service.create({ full_name, email, leave_balance_days });
  res.status(201).json(employee);
});

export default router;
