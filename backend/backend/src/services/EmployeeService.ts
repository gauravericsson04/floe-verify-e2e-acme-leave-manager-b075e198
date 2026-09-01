import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { Employee } from '../types';

export class EmployeeService {
  private repo = new EmployeeRepository();

  async list(): Promise<Employee[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<Employee | null> {
    return this.repo.findById(id);
  }

  async create(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    return this.repo.create(data);
  }
}
