import { APIRequestContext, request, APIResponse } from '@playwright/test';

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

  private async handleResponse(response: APIResponse) {
    if (!response.ok()) {
      throw new Error(`Request failed with status ${response.status()}`);
    }
    return response.json();
  }

  async login(username: string, password: string) {
    const response = await this.apiContext.post('/auth/login', {
      data: { username, password },
    });
    return this.handleResponse(response);
  }

  async logout(token: string) {
    const response = await this.apiContext.post('/auth/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return this.handleResponse(response);
  }

  async getEmployees(token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await this.apiContext.get('/viewEmployeeList', { headers });
    return this.handleResponse(response);
  }

  async getEmployeeById(token: string, id: number) {
    const response = await this.apiContext.get(`/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return this.handleResponse(response);
  }

  async createEmployee(token: string, employeeData: object) {
    const response = await this.apiContext.post('/employees', {
      headers: { Authorization: `Bearer ${token}` },
      data: employeeData,
    });
    return this.handleResponse(response);
  }

  async updateEmployee(token: string, id: number, employeeData: object) {
    const response = await this.apiContext.put(`/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: employeeData,
    });
    return this.handleResponse(response);
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
    return this.handleResponse(response);
  }
}
