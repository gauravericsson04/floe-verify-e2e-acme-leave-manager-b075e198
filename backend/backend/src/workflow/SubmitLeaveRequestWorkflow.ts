import { WorkflowDefinition, WorkflowNode, WorkflowContext } from './WorkflowExecutor';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

// Helper to record node execution
async function recordNodeExecution(runId: string, node: WorkflowNode, input: any, output: any, status: string, error?: string) {
  await query(
    `INSERT INTO node_executions (id, workflow_run_id, node_id, execution_mode, status, input, output, started_at, completed_at, error) VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now(), $8)`,
    [uuidv4(), runId, node.id, node.execution_mode, status, JSON.stringify(input), JSON.stringify(output), error || null]
  );
}

class ValidateBalanceNode extends WorkflowNode {
  constructor() { super('s1', 'condition', 'deterministic'); }
  async execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string> {
    const { leaveRequest } = context.inputs;
    const employeeRes = await query('SELECT leave_balance_days FROM employee WHERE id = $1', [leaveRequest.employee_id]);
    const balance = Number(employeeRes.rows[0].leave_balance_days);
    const daysRequested = (new Date(leaveRequest.end_date).getTime() - new Date(leaveRequest.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1;
    const valid = daysRequested <= balance;
    await recordNodeExecution(context.workflowRunId!, this, { leaveRequest }, { valid }, 'completed');
    return valid ? 's2' : 'rejected';
  }
}

class InterpretReasonNode extends WorkflowNode {
  constructor() { super('s2', 'action', 'ai'); }
  async execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string> {
    // Mock classification – just echo back a category.
    const { leaveRequest } = context.inputs;
    const category = leaveRequest.reason_text ? 'general' : 'unspecified';
    await recordNodeExecution(context.workflowRunId!, this, { leaveRequest }, { category }, 'completed');
    return 's3';
  }
}

class ManagerApprovalNode extends WorkflowNode {
  constructor() { super('s3', 'human', 'human'); }
  async execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string> {
    // In a real system this would wait for human input. Here we simulate immediate approval for demo.
    const decision = context.inputs.managerDecision || 'approve'; // expect 'approve' or 'reject'
    await recordNodeExecution(context.workflowRunId!, this, {}, { decision }, 'completed');
    return decision === 'approve' ? 's4' : 'rejected';
  }
}

class EscalateNode extends WorkflowNode {
  constructor() { super('s3_escalate', 'human', 'human'); }
  async execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string> {
    const decision = context.inputs.hrDecision || 'reject';
    await recordNodeExecution(context.workflowRunId!, this, {}, { decision }, 'completed');
    return decision === 'approve' ? 's4' : 'rejected';
  }
}

class ApplyDecisionNode extends WorkflowNode {
  constructor() { super('s4', 'action', 'deterministic'); }
  async execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string> {
    // Call service method to update status and deduct balance.
    const { recordId } = context;
    // For simplicity we directly update status to approved; the service will handle balance.
    await query(`UPDATE leave_request SET status = $1, updated_at = now() WHERE id = $2`, ['approved', recordId]);
    await recordNodeExecution(context.workflowRunId!, this, {}, { status: 'approved' }, 'completed');
    return 'approved';
  }
}

export class SubmitLeaveRequestWorkflow implements WorkflowDefinition {
  name = 'submit_leave_request';
  startNodeId = 's1';
  nodes: WorkflowNode[] = [
    new ValidateBalanceNode(),
    new InterpretReasonNode(),
    new ManagerApprovalNode(),
    new EscalateNode(),
    new ApplyDecisionNode()
  ];
}
