import { LeaveRequestRepository } from '../repositories/LeaveRequestRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { LeaveRequest } from '../types';
import { WorkflowExecutor } from '../workflow/WorkflowExecutor';
import { SubmitLeaveRequestWorkflow } from '../workflow/SubmitLeaveRequestWorkflow';

export class LeaveRequestService {
  private repo = new LeaveRequestRepository();
  private employeeRepo = new EmployeeRepository();
  private executor = new WorkflowExecutor();

  async listAll(): Promise<LeaveRequest[]> {
    return this.repo.findAll();
  }

  async listByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return this.repo.findByEmployeeId(employeeId);
  }

  async get(id: string): Promise<LeaveRequest | null> {
    return this.repo.findById(id);
  }

  async create(data: Omit<LeaveRequest, 'id' | 'status' | 'created_at' | 'updated_at'>, actorId: string): Promise<LeaveRequest> {
    const leaveRequest = await this.repo.create(data);
    // Kick off workflow
    const workflow = new SubmitLeaveRequestWorkflow();
    await this.executor.execute(workflow, {
      workflowRunId: undefined, // executor will create a run record
      recordId: leaveRequest.id,
      actor: actorId,
      inputs: { leaveRequest },
      previousOutputs: {}
    });
    return leaveRequest;
  }

  // Transition method required by rule 2
  async transition(id: string, newStatus: 'pending' | 'approved' | 'rejected'): Promise<LeaveRequest> {
    return this.repo.updateStatus(id, newStatus);
  }

  async applyDecision(leaveRequestId: string, decision: 'approve' | 'reject'): Promise<LeaveRequest> {
    const leaveRequest = await this.repo.findById(leaveRequestId);
    if (!leaveRequest) throw new Error('Leave request not found');
    const employee = await this.employeeRepo.findById(leaveRequest.employee_id);
    if (!employee) throw new Error('Employee not found');
    const daysRequested =
      (new Date(leaveRequest.end_date).getTime() - new Date(leaveRequest.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1;
    if (decision === 'approve') {
      await this.repo.updateStatus(leaveRequestId, 'approved');
      await this.repo.deductBalance(employee.id, daysRequested);
    } else {
      await this.repo.updateStatus(leaveRequestId, 'rejected');
    }
    return this.repo.findById(leaveRequestId) as Promise<LeaveRequest>;
  }
}
