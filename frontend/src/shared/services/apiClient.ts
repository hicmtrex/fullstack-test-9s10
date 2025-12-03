/**
 * Centralized API client with error handling
 * Provides consistent error handling and response formatting
 */

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

/**
 * Centralized API client
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Handles fetch response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: T;
    try {
      data = isJson ? await response.json() : ((await response.text()) as unknown as T);
    } catch (error) {
      throw new ApiClientError(response.status, 'Failed to parse response', error);
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: string }).error)
          : `Request failed with status ${response.status}`;

      throw new ApiClientError(response.status, errorMessage, data);
    }

    return { data, status: response.status };
  }

  /**
   * Performs GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);
      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(408, 'Request timeout');
      }
      throw new ApiClientError(500, 'Network error', error);
    }
  }

  /**
   * Performs POST request
   */
  async post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      clearTimeout(timeoutId);
      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(408, 'Request timeout');
      }
      throw new ApiClientError(500, 'Network error', error);
    }
  }

  /**
   * Performs PUT request
   */
  async put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      clearTimeout(timeoutId);
      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(408, 'Request timeout');
      }
      throw new ApiClientError(500, 'Network error', error);
    }
  }

  /**
   * Performs DELETE request
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        method: 'DELETE',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);
      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(408, 'Request timeout');
      }
      throw new ApiClientError(500, 'Network error', error);
    }
  }
}

// Export singleton instance
// Note: baseURL is empty because endpoints already include the full path (/api/...)
// This allows Vite proxy to handle /api requests correctly
export const apiClient = new ApiClient({
  baseURL: '',
});
