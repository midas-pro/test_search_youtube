
import React from 'react';
import VideoCard from './VideoCard';
import { YouTubeVideo } from '@/services/youtubeService';

interface VideoGridProps {
  videos: YouTubeVideo[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
