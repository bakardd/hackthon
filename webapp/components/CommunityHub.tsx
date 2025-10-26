import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageCircle, 
  ThumbsUp, 
  Users, 
  HelpCircle,
  Send,
  Award
} from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    author: 'Chidi Okafor',
    avatar: 'CO',
    title: 'Best practices for maize farming in rainy season?',
    content: 'Looking for advice on managing my maize farm during heavy rainfall. Any tips on drainage?',
    category: 'Crop Management',
    replies: 12,
    likes: 24,
    timeAgo: '2 hours ago',
    isExpert: false,
  },
  {
    id: 2,
    author: 'Dr. Amina Hassan',
    avatar: 'AH',
    title: 'Organic pest control methods for cassava',
    content: 'Here are some proven organic methods to control pests in cassava farms without chemicals...',
    category: 'Pest Control',
    replies: 8,
    likes: 45,
    timeAgo: '5 hours ago',
    isExpert: true,
  },
  {
    id: 3,
    author: 'Emeka Nwosu',
    avatar: 'EN',
    title: 'Successful rice harvest - sharing my experience',
    content: 'Just completed my rice harvest with 3.5 tons/acre yield. Here is what worked for me...',
    category: 'Success Stories',
    replies: 18,
    likes: 67,
    timeAgo: '1 day ago',
    isExpert: false,
  },
  {
    id: 4,
    author: 'Fatima Bello',
    avatar: 'FB',
    title: 'Soil preparation techniques for sandy soil',
    content: 'What amendments do you use for sandy soil to improve water retention?',
    category: 'Soil Health',
    replies: 15,
    likes: 32,
    timeAgo: '2 days ago',
    isExpert: false,
  },
];

const expertQA = [
  {
    id: 1,
    question: 'When is the best time to apply nitrogen fertilizer for maize?',
    askedBy: 'John A.',
    answer: 'The optimal time is at the V6 stage (6 leaves) when the plant needs nitrogen most. Split application is recommended - 50% at planting and 50% at V6 stage.',
    answeredBy: 'Dr. Agricultural Expert',
    category: 'Fertilization',
    votes: 28,
    timeAgo: '3 days ago',
  },
  {
    id: 2,
    question: 'How do I identify and treat cassava mosaic disease?',
    askedBy: 'Mary K.',
    answer: 'Cassava mosaic shows yellow-green patches on leaves. Prevention is key - use disease-free cuttings, remove infected plants, and control whiteflies which spread the virus.',
    answeredBy: 'Plant Pathologist',
    category: 'Disease Management',
    votes: 42,
    timeAgo: '1 week ago',
  },
];

export function CommunityHub() {
  const [newPost, setNewPost] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Farmer Forum
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Expert Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6 mt-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <CardDescription>Ask questions, share experiences, or offer advice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Post title..." />
                <Textarea 
                  placeholder="What's on your mind? Share your farming experiences, ask questions, or offer advice..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Crop Management
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Pest Control
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Soil Health
                    </Badge>
                  </div>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{post.author}</span>
                        {post.isExpert && (
                          <Badge className="bg-blue-600">
                            <Award className="w-3 h-3 mr-1" />
                            Expert
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">• {post.timeAgo}</span>
                      </div>
                      
                      <h4 className="mb-2">{post.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{post.content}</p>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{post.category}</Badge>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies} Replies
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-6 mt-6">
          {/* Ask Expert */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Ask an Expert</CardTitle>
              <CardDescription>Get professional advice from agricultural experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Describe your farming challenge or question in detail..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Answered by certified agricultural experts
                    </span>
                  </div>
                  <Button>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Submit Question
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expert Answers */}
          <div className="space-y-4">
            {expertQA.map((qa) => (
              <Card key={qa.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{qa.category}</Badge>
                        <span className="text-sm text-gray-500">{qa.timeAgo}</span>
                      </div>
                      <h4 className="mb-2">{qa.question}</h4>
                      <div className="text-sm text-gray-500">Asked by {qa.askedBy}</div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">Expert Answer by {qa.answeredBy}</span>
                      </div>
                      <p className="text-gray-700">{qa.answer}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({qa.votes})
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Follow up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl text-green-600">1,247</div>
                  <div className="text-sm text-gray-600 mt-1">Active Farmers</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl text-blue-600">89</div>
                  <div className="text-sm text-gray-600 mt-1">Expert Contributors</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl text-purple-600">3,456</div>
                  <div className="text-sm text-gray-600 mt-1">Questions Answered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
