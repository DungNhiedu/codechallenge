import { test, expect } from '@playwright/test';
import nock from 'nock';
import { ApiClient } from '../pages/apiClient';

test.describe('OrangeHRM API Tests with Nock Mock', () => {
  let apiClient: ApiClient;
  let token: string;

  test.beforeAll(async () => {
    apiClient = await ApiClient.create('https://opensource-demo.orangehrmlive.com');
  });

  test.afterEach(() => {
    nock.cleanAll(); // Xóa mock sau mỗi test
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('TC_API_01 - Login API with valid credentials', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .post('/auth/login', { username: 'Admin', password: 'admin123' })
      .reply(200, {
        token: 'mocked-token-123',
        user: { username: 'Admin', role: 'admin' },
      });

    const response = await apiClient.login('Admin', 'admin123');
    expect(response.token).toBe('mocked-token-123');
    expect(response.user.username).toBe('Admin');
    token = response.token;
  });

  test('TC_API_02 - Login API with invalid credentials', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .post('/auth/login', { username: 'invalid_user', password: 'wrong_password' })
      .reply(401, { error: 'Invalid username or password' });

    const error = await apiClient.login('invalid_user', 'wrong_password').catch(e => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('401');
  });

  test('TC_API_03 - Fetch employee list', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .get('/viewEmployeeList')
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ]);

    const employees = await apiClient.getEmployees(token);
    expect(Array.isArray(employees)).toBe(true);
    expect(employees.length).toBeGreaterThan(0);
  });

  test('TC_API_04 - Fetch specific employee by ID', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .get('/employees/1')
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

    const employee = await apiClient.getEmployeeById(token, 1);
    expect(employee).toHaveProperty('id', 1);
    expect(employee.firstName).toBe('John');
  });

  test('TC_API_05 - Create a new employee', async () => {
    const newEmployee = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

    nock('https://opensource-demo.orangehrmlive.com')
      .post('/employees', newEmployee)
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(201, { id: 3, ...newEmployee });

    const created = await apiClient.createEmployee(token, newEmployee);
    expect(created).toHaveProperty('id');
    expect(created.firstName).toBe('John');
  });

  test('TC_API_06 - Update existing employee', async () => {
    const updatedData = { firstName: 'John', lastName: 'Doe Updated' };

    nock('https://opensource-demo.orangehrmlive.com')
      .put('/employees/1', updatedData)
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, { id: 1, ...updatedData });

    const updated = await apiClient.updateEmployee(token, 1, updatedData);
    expect(updated.lastName).toBe('Doe Updated');
  });

  test('TC_API_07 - Delete an employee', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .delete('/employees/1')
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(204);

    const status = await apiClient.deleteEmployee(token, 1);
    expect(status).toBe(204);
  });

  test('TC_API_08 - Access unauthorized endpoint without token', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
    .get('/viewEmployeeList')
    .reply(401, { error: 'Unauthorized' });

    const error = await apiClient.getEmployees('').catch(e => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('401');
  });

  test('TC_API_09 - Search employees', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .get('/employees/search')
      .query({ query: 'John' })
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 4, firstName: 'Johnny', lastName: 'Smith' },
      ]);

    const results = await apiClient.searchEmployees(token, 'John');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  test('TC_API_10 - Logout API', async () => {
    nock('https://opensource-demo.orangehrmlive.com')
      .post('/auth/logout')
      .matchHeader('authorization', `Bearer ${token}`)
      .reply(200, { message: 'Logout successful' });

    const response = await apiClient.logout(token);
    expect(response).toHaveProperty('message', 'Logout successful');
  });
});
