

export function getYouTubeId(url: string): string | null {
  // Regex to match YouTube video IDs
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function isValidImageUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    // We use 'HEAD' to get headers without downloading the full image.
    // 'no-store' ensures we get a fresh response.
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      // Add a timeout to prevent hanging on slow responses
      signal: AbortSignal.timeout(3000), // 3-second timeout
    });

    if (!response.ok) {
      console.warn(`[isValidImageUrl] URL not OK: ${response.status} ${url}`);
      return false; // Not a successful request (e.g., 404)
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.warn(`[isValidImageUrl] Not an image content-type: ${contentType} ${url}`);
      return false; // Not an image
    }

    return true; // Looks good!
  } catch (error: any) {
    // This catches network errors (e.g., DNS failure, timeout)
    if (error.name === 'TimeoutError') {
      console.warn(`[isValidImageUrl] Timeout for URL: ${url}`);
    } else {
      console.warn(`[isValidImageUrl] Fetch error for URL: ${url}`, error.message);
    }
    return false;
  }
}