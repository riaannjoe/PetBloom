import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: ApiClientOptions['params']): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, params, headers, ...rest } = options;

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      errorBody,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
