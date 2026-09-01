import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export interface WorkflowContext {
  workflowRunId?: string;
  recordId: string;
  actor: string;
  inputs: Record<string, any>;
  previousOutputs: Record<string, any>;
}

export abstract class WorkflowNode {
  id: string;
  type: string;
  execution_mode: string;
  constructor(id: string, type: string, execution_mode: string) {
    this.id = id;
    this.type = type;
    this.execution_mode = execution_mode;
  }
  abstract execute(context: WorkflowContext, outputs: Record<string, any>): Promise<string>; // returns next node id
}

export class WorkflowExecutor {
  async execute(workflow: WorkflowDefinition, initContext: WorkflowContext): Promise<void> {
    // Create workflow run record
    const runId = uuidv4();
    await query(
      `INSERT INTO workflow_runs (id, workflow_id, record_id, status) VALUES ($1, $2, $3, $4)`,
      [runId, workflow.name, initContext.recordId, 'running']
    );
    initContext.workflowRunId = runId;
    let currentNodeId = workflow.startNodeId;
    const outputs: Record<string, any> = {};
    while (currentNodeId && !['approved', 'rejected'].includes(currentNodeId)) {
      const node = workflow.nodes.find(n => n.id === currentNodeId);
      if (!node) break;
      const nextNodeId = await node.execute(initContext, outputs);
      currentNodeId = nextNodeId;
    }
    // Mark run completed
    await query(
      `UPDATE workflow_runs SET status = $1, completed_at = now() WHERE id = $2`,
      ['completed', runId]
    );
  }
}

export interface WorkflowDefinition {
  name: string;
  startNodeId: string;
  nodes: WorkflowNode[];
}
