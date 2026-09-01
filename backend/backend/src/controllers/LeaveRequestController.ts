import { Router, Request, Response } from 'express';
import { LeaveRequestService } from '../services/LeaveRequestService';
import { authMiddleware, authorize, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const service = new LeaveRequestService();

router.use(authMiddleware);

// List leave requests – permission varies by role, handled inside.
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;
  const userId = req.user?.id;
  if (role === 'employee') {
    const list = await service.listByEmployee(userId!);
    return res.json(list);
  }
  // manager and hr can see all for simplicity (team logic omitted)
  const list = await service.listAll();
  res.json(list);
});

router.post('/', authorize('create', 'LeaveRequest', 'own'), async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date, reason_text } = req.body;
  const employeeId = req.user!.id;
  const leaveRequest = await service.create({ employee_id: employeeId, start_date, end_date, reason_text }, employeeId);
  res.status(201).json(leaveRequest);
});

router.patch('/:id/status', authorize('update', 'LeaveRequest.status'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { decision } = req.body; // 'approve' | 'reject'
  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }
  const updated = await service.applyDecision(id, decision as any);
  res.json(updated);
});

export default router;
