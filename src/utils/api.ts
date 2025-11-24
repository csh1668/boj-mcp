/**
 * API 호출을 위한 유틸리티 함수
 * 재시도 로직 및 에러 처리를 포함합니다.
 */

export interface FetchAPIOptions extends RequestInit {
  /**
   * 최대 재시도 횟수 (기본값: 3)
   */
  maxRetries?: number;
  
  /**
   * 재시도 전 대기 시간(ms) (기본값: 1000)
   */
  retryDelay?: number;
  
  /**
   * 타임아웃 시간(ms) (기본값: 30000)
   */
  timeout?: number;
}

/**
 * 재시도 가능한 에러인지 확인
 */
function isRetryableError(status: number): boolean {
  // 5xx 서버 오류 또는 429 Too Many Requests
  return status >= 500 || status === 429;
}

/**
 * 지연 시간만큼 대기
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 타임아웃을 포함한 fetch 래퍼
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * 재시도 로직이 포함된 fetch API 래퍼
 * 
 * @param url 요청할 URL
 * @param options fetch 옵션 및 재시도 설정
 * @returns Response 객체
 * @throws 에러 발생 시 적절한 에러 메시지와 함께 throw
 */
export async function fetchAPI(
  url: string,
  options: FetchAPIOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 타임아웃이 설정된 경우 타임아웃 래퍼 사용
      const response = timeout > 0
        ? await fetchWithTimeout(url, fetchOptions, timeout)
        : await fetch(url, fetchOptions);

      // 성공적인 응답 (2xx)
      if (response.ok) {
        return response;
      }

      // 재시도 가능한 에러인지 확인
      if (isRetryableError(response.status) && attempt < maxRetries) {
        lastResponse = response;
        const delayMs = retryDelay * 2 ** attempt; // Exponential backoff
        await delay(delayMs);
        continue;
      }

      // 재시도 불가능한 에러 또는 최대 재시도 횟수 초과
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 네트워크 오류 등 재시도 가능한 에러인 경우
      if (attempt < maxRetries && !lastResponse) {
        const delayMs = retryDelay * 2 ** attempt; // Exponential backoff
        await delay(delayMs);
        continue;
      }

      // 최대 재시도 횟수 초과 또는 재시도 불가능한 에러
      throw lastError;
    }
  }

  // 이 부분은 도달하지 않아야 하지만 타입 안전성을 위해
  throw lastError || new Error('Unknown error occurred');
}

