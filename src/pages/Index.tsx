
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import SearchBar from '@/components/SearchBar';
import VideoGrid from '@/components/VideoGrid';
import { YouTubeVideo, searchVideos } from '@/services/youtubeService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (keyword: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchVideos(keyword);
      setVideos(results);
      
      if (results.length === 0) {
        toast({
          title: "No videos found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos. Please try again.",
        variant: "destructive",
      });
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-youtube-black flex items-center justify-center">
            <span className="bg-youtube-red text-white p-2 mr-2 rounded">Trend</span>Tube Viewer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest trending YouTube videos by searching for keywords
          </p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading ? (
          <div className="flex justify-center my-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-youtube-red rounded-full animate-bounce"></div>
              <p className="mt-4 text-gray-600">Loading videos...</p>
            </div>
          </div>
        ) : (
          <>
            {!hasSearched ? (
              <Card className="mx-auto max-w-2xl bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-youtube-black">Get Started</CardTitle>
                  <CardDescription>Enter a keyword above to find trending videos</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <svg className="w-20 h-20 mx-auto text-youtube-red opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </CardContent>
              </Card>
            ) : videos.length > 0 ? (
              <VideoGrid videos={videos} />
            ) : hasSearched && (
              <div className="text-center my-20">
                <p className="text-gray-600">No videos found. Try a different search term.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
