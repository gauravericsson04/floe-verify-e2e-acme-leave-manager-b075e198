import { query } from '../db';
import { Employee } from '../types';

export class EmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const res = await query('SELECT * FROM employee ORDER BY created_at DESC');
    return res.rows;
  }

  async findById(id: string): Promise<Employee | null> {
    const res = await query('SELECT * FROM employee WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async create(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const res = await query(
      `INSERT INTO employee (full_name, email, leave_balance_days) VALUES ($1, $2, $3) RETURNING *`,
      [data.full_name, data.email, data.leave_balance_days ?? 20]
    );
    return res.rows[0];
  }
}
