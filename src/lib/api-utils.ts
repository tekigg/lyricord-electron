// api-utils.ts
const baseApiUrl = 'https://weeb-api.vercel.app';

// Define types for the responses

interface GeniusResponse {
  title: string;
  fullTitle: string;
  artist: string;
  image: string;
  url: string;
}

interface LyricsResponse {
  lyrics: string;
}

// Create a function to fetch lyrics from Genius
export async function fetchGeniusLyrics(query: string): Promise<GeniusResponse[]> {
  try {
    const response = await fetch(`${baseApiUrl}/genius?query=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: GeniusResponse[] = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Create a function to fetch lyrics by URL
export async function fetchLyricsByUrl(url: string): Promise<LyricsResponse> {
  try {
    const response = await fetch(`${baseApiUrl}/lyrics?url=${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: LyricsResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
