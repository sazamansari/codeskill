import api from '@/config/api';

describe('API Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should attach Authorization header if token exists', async () => {
    localStorage.setItem('codeskill_token', 'mock_token_123');

    // Simulate an interceptor call
    const config: any = { headers: {} };
    // @ts-ignore
    const result = await api.interceptors.request.handlers[0].fulfilled(config);

    expect(result.headers.Authorization).toBe('Bearer mock_token_123');
  });

  it('should not attach Authorization header if token does not exist', async () => {
    const config: any = { headers: {} };
    // @ts-ignore
    const result = await api.interceptors.request.handlers[0].fulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
