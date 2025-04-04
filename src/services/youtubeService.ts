
const API_KEY = 'AIzaSyBheeJDoqRbUx6-WsFm0VETxLlGVJ85SlI';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
}

export async function searchVideos(keyword: string): Promise<YouTubeVideo[]> {
  try {
    // First, search for videos matching the keyword
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        keyword
      )}&type=video&key=${API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const searchData = await searchResponse.json();
    
    // Extract video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get additional video details including view counts
    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const videoData = await videoResponse.json();
    
    // Map the response to our simplified model
    return videoData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      viewCount: item.statistics?.viewCount ? formatViewCount(Number(item.statistics.viewCount)) : 'N/A'
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}

// Format view count with K, M, B suffixes
function formatViewCount(count: number): string {
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + 'B';
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}
