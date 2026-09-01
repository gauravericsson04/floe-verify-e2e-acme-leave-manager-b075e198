import { query } from '../db';
import { LeaveRequest } from '../types';

export class LeaveRequestRepository {
  async findAll(): Promise<LeaveRequest[]> {
    const res = await query('SELECT * FROM leave_request ORDER BY created_at DESC');
    return res.rows;
  }

  async findById(id: string): Promise<LeaveRequest | null> {
    const res = await query('SELECT * FROM leave_request WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    const res = await query('SELECT * FROM leave_request WHERE employee_id = $1 ORDER BY created_at DESC', [employeeId]);
    return res.rows;
  }

  async create(data: Omit<LeaveRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<LeaveRequest> {
    const res = await query(
      `INSERT INTO leave_request (employee_id, start_date, end_date, reason_text, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.employee_id, data.start_date, data.end_date, data.reason_text, 'pending']
    );
    return res.rows[0];
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<LeaveRequest> {
    const res = await query(
      `UPDATE leave_request SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  }

  async deductBalance(employeeId: string, days: number): Promise<void> {
    await query(
      `UPDATE employee SET leave_balance_days = leave_balance_days - $1, updated_at = now() WHERE id = $2`,
      [days, employeeId]
    );
  }
}
