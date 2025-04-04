
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { YouTubeVideo } from '@/services/youtubeService';

interface VideoCardProps {
  video: YouTubeVideo;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const sendToSlack = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the video when clicking the button
    setIsSending(true);
    
    const webhookUrl = 'https://hooks.slack.com/services/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';
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "YouTube Video Shared",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*<https://www.youtube.com/watch?v=${video.id}|${video.title}>*\nBy: ${video.channelTitle}`
          }
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: video.title
          },
          image_url: video.thumbnailUrl,
          alt_text: video.title
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Published: ${video.publishedAt} • ${video.viewCount} views`
            }
          ]
        }
      ]
    };
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        mode: 'no-cors', // Required for cross-origin requests to Slack
      });
      
      toast({
        title: "Sent to Slack",
        description: "Video has been shared to Slack channel",
      });
    } catch (error) {
      console.error("Error sharing to Slack:", error);
      toast({
        title: "Error",
        description: "Failed to share to Slack. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card 
      className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-youtube-black">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{video.channelTitle}</p>
        <div className="mt-auto flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span>{video.publishedAt}</span>
            {video.viewCount && <span className="ml-2">{video.viewCount} views</span>}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 text-xs"
            onClick={sendToSlack}
            disabled={isSending}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            {isSending ? 'Sending...' : 'Share'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
