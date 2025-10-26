import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export function CommunityHub() {
  const discussions = [
    {
      id: 1,
      author: 'Adebayo Ogunlesi',
      avatar: 'AO',
      title: 'Best practices for maize farming in rainy season',
      excerpt: 'I have been experimenting with different planting techniques...',
      likes: 24,
      replies: 12,
      tags: ['Maize', 'Rainy Season'],
      time: '2 hours ago',
    },
    {
      id: 2,
      author: 'Chioma Nwosu',
      avatar: 'CN',
      title: 'Organic fertilizer alternatives that work',
      excerpt: 'After years of using chemical fertilizers, I switched to...',
      likes: 45,
      replies: 28,
      tags: ['Organic', 'Fertilizer'],
      time: '5 hours ago',
    },
    {
      id: 3,
      author: 'Ibrahim Mohammed',
      avatar: 'IM',
      title: 'Drought-resistant crops for the dry season',
      excerpt: 'Looking for recommendations on crops that can survive...',
      likes: 18,
      replies: 15,
      tags: ['Drought', 'Crop Selection'],
      time: '1 day ago',
    },
  ];

  const topContributors = [
    { name: 'Adebayo O.', posts: 156, badge: 'Expert' },
    { name: 'Chioma N.', posts: 142, badge: 'Expert' },
    { name: 'Ibrahim M.', posts: 98, badge: 'Contributor' },
    { name: 'Fatima A.', posts: 87, badge: 'Contributor' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Community Hub</h2>
        <p className="text-muted-foreground">
          Connect with fellow farmers, share experiences, and learn from each other
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Discussion Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Discussions</CardTitle>
                <Button>New Discussion</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{discussion.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-medium hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{discussion.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.time}</span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          {discussion.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {discussion.replies}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Top Contributors
              </CardTitle>
              <CardDescription>Most active community members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">{contributor.posts} posts</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contributor.badge}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <span className="font-bold">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Today</span>
                <span className="font-bold">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discussions</span>
                <span className="font-bold">1,256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Solved Questions</span>
                <span className="font-bold">894</span>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Organic Farming', 'Irrigation Systems', 'Pest Control', 'Market Prices', 'Crop Rotation'].map((topic, index) => (
                <Badge key={index} variant="outline" className="w-full justify-start">
                  {topic}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
