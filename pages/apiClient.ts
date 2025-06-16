import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private apiContext: APIRequestContext;
  private baseURL: string;

  private constructor(apiContext: APIRequestContext, baseURL: string) {
    this.apiContext = apiContext;
    this.baseURL = baseURL;
  }

  static async create(baseURL: string): Promise<ApiClient> {
    const apiContext = await request.newContext({ baseURL });
    return new ApiClient(apiContext, baseURL);
  }

  async dispose() {
    await this.apiContext.dispose();
  }

  async login(username: string, password: string) {
    const response = await this.apiContext.post('/auth/login', {
      data: { username, password },
    });
    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}`);
    }
    return response.json();
  }

  async logout(token: string) {
    const response = await this.apiContext.post('/auth/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok()) {
      throw new Error(`Logout failed with status ${response.status()}`);
    }
    return response.json();
  }

  async getEmployees(token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await this.apiContext.get('/viewEmployeeList', { headers });
    if (!response.ok()) {
      throw new Error(`Get employees failed with status ${response.status()}`);
    }
    return response.json();
  }

  async getEmployeeById(token: string, id: number) {
    const response = await this.apiContext.get(`/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok()) {
      throw new Error(`Get employee by ID failed with status ${response.status()}`);
    }
    return response.json();
  }

  async createEmployee(token: string, employeeData: object) {
    const response = await this.apiContext.post('/employees', {
      headers: { Authorization: `Bearer ${token}` },
      data: employeeData,
    });
    if (!response.ok()) {
      throw new Error(`Create employee failed with status ${response.status()}`);
    }
    return response.json();
  }

  async updateEmployee(token: string, id: number, employeeData: object) {
    const response = await this.apiContext.put(`/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: employeeData,
    });
    if (!response.ok()) {
      throw new Error(`Update employee failed with status ${response.status()}`);
    }
    return response.json();
  }

  async deleteEmployee(token: string, id: number) {
    const response = await this.apiContext.delete(`/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok()) {
      throw new Error(`Delete employee failed with status ${response.status()}`);
    }
    return response.status();
  }

  async searchEmployees(token: string, query: string) {
    const response = await this.apiContext.get('/employees/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { query },
    });
    if (!response.ok()) {
      throw new Error(`Search employees failed with status ${response.status()}`);
    }
    return response.json();
  }
}
