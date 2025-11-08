// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const mockResponse = { data: 'test data' };
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    });
    await throttledGetDataFromApi('/test');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: 'test data' });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    await throttledGetDataFromApi('/post/1');

    expect(mockGet).toHaveBeenCalledWith('/post/1');
  });

  test('should return response data', async () => {
    const mockResponse = { data: 'test data' };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    const result = await throttledGetDataFromApi('/test');
    expect(result).toBe('test data');
  });
});
