import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Trash2, Edit2, X, Send } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";

const postSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(2000, "Post must be less than 2000 characters")
});

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be less than 500 characters")
});

interface ForumPost {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    email: string | null;
    show_name_on_forum: boolean;
  };
}

interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    email: string | null;
    show_name_on_forum: boolean;
  };
}

const Forum = () => {
  const { user, subscriptionData } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<Record<string, ForumComment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPosts();
    fetchCommentCounts();
    
    const postsChannel = supabase
      .channel('forum-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_comments'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            fetchCommentCounts();
          }
          // Refetch comments for the specific post if it's expanded
          if (payload.new && 'post_id' in payload.new && payload.new.post_id && expandedPosts.has(payload.new.post_id as string)) {
            fetchCommentsForPost(payload.new.post_id as string);
          }
          if (payload.old && 'post_id' in payload.old && payload.old.post_id && expandedPosts.has(payload.old.post_id as string)) {
            fetchCommentsForPost(payload.old.post_id as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [expandedPosts]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          user_id,
          content,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(post => post.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, email, show_name_on_forum')
          .in('user_id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.user_id, p]) || []
        );

        const postsWithProfiles = data.map(post => ({
          ...post,
          profiles: profilesMap.get(post.user_id)
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load forum posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to post in the forum",
        variant: "destructive",
      });
      return;
    }

    try {
      const validated = postSchema.parse({ content: newPost });
      setSubmitting(true);

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          content: validated.content
        });

      if (error) throw error;

      setNewPost("");
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (postId: string) => {
    try {
      const validated = postSchema.parse({ content: editContent });
      
      const { error } = await supabase
        .from('forum_posts')
        .update({ content: validated.content })
        .eq('id', postId);

      if (error) throw error;

      setEditingId(null);
      setEditContent("");
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Error updating post:', error);
        toast({
          title: "Error",
          description: "Failed to update post",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const getUserDisplayName = (post: ForumPost) => {
    // Check if user has disabled showing their name
    if (post.profiles?.show_name_on_forum === false) {
      return "Anonymous";
    }
    
    if (post.profiles?.username) return post.profiles.username;
    if (post.profiles?.email) {
      const emailName = post.profiles.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "Anonymous User";
  };

  const getUserSubscriptionBadge = (postUserId: string) => {
    if (postUserId === user?.id && subscriptionData?.subscribed) {
      return <Badge variant="default" className="ml-2">Premium</Badge>;
    }
    return <Badge variant="outline" className="ml-2">Free</Badge>;
  };

  const fetchCommentCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('post_id');

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(comment => {
        counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
      });

      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  };

  const fetchCommentsForPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles for comment authors
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(comment => comment.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, email, show_name_on_forum')
          .in('user_id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.user_id, p]) || []
        );

        const commentsWithProfiles = data.map(comment => ({
          ...comment,
          profiles: profilesMap.get(comment.user_id)
        }));

        setComments(prev => ({ ...prev, [postId]: commentsWithProfiles }));
      } else {
        setComments(prev => ({ ...prev, [postId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedPosts.has(postId)) {
      setExpandedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setExpandedPosts(prev => new Set(prev).add(postId));
      if (!comments[postId]) {
        await fetchCommentsForPost(postId);
      }
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    const commentContent = newComment[postId] || "";
    
    try {
      const validated = commentSchema.parse({ content: commentContent });

      const { error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: validated.content
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: "" }));
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Error creating comment:', error);
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateComment = async (commentId: string, postId: string) => {
    try {
      const validated = commentSchema.parse({ content: editCommentContent });
      
      const { error } = await supabase
        .from('forum_comments')
        .update({ content: validated.content })
        .eq('id', commentId);

      if (error) throw error;

      setEditingCommentId(null);
      setEditCommentContent("");
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
      await fetchCommentsForPost(postId);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Error updating comment:', error);
        toast({
          title: "Error",
          description: "Failed to update comment",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      await fetchCommentsForPost(postId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const getUserDisplayNameFromComment = (comment: ForumComment) => {
    if (comment.profiles?.show_name_on_forum === false) {
      return "Anonymous";
    }
    
    if (comment.profiles?.username) return comment.profiles.username;
    if (comment.profiles?.email) {
      const emailName = comment.profiles.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "Anonymous User";
  };

  return (
    <>
      <SEOHead 
        title="Community Forum - Share Tips & Ask Questions | AmortIQ"
        description="Join the AmortIQ community forum. Share mortgage tips, ask questions, and learn from other UK homeowners about overpayments and mortgage management."
        keywords="mortgage forum, mortgage community, overpayment tips, mortgage advice uk"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SharedNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Community Forum
              </h1>
              <p className="text-xl text-gray-600">
                Share tips, ask questions, and learn from fellow homeowners
              </p>
            </div>

            {user ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Share Your Thoughts</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Share a mortgage tip, ask a question, or start a discussion..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-4"
                    rows={4}
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {newPost.length}/2000 characters
                    </span>
                    <Button 
                      onClick={handleSubmitPost}
                      disabled={!newPost.trim() || submitting}
                    >
                      {submitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-700 mb-4">
                    Sign in to join the conversation and share your mortgage journey
                  </p>
                  <Button asChild>
                    <a href="/auth?mode=login">Sign In to Post</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    No posts yet. Be the first to start a conversation!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-900">
                                {getUserDisplayName(post)}
                              </span>
                              {getUserSubscriptionBadge(post.user_id)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        {user?.id === post.user_id && (
                          <div className="flex gap-2">
                            {editingId === post.id ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditContent("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(post.id);
                                    setEditContent(post.content);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {editingId === post.id ? (
                        <div>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="mb-2"
                            rows={4}
                            maxLength={2000}
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleUpdatePost(post.id)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-4">
                            {post.content}
                          </p>

                          {/* Comments Section */}
                          <div className="border-t pt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComments(post.id)}
                              className="mb-2"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {commentCounts[post.id] || 0} {commentCounts[post.id] === 1 ? 'Comment' : 'Comments'}
                            </Button>

                            {expandedPosts.has(post.id) && (
                              <div className="space-y-4 mt-4">
                                {/* New Comment Input */}
                                {user && (
                                  <div className="flex gap-2">
                                    <Textarea
                                      placeholder="Add a comment..."
                                      value={newComment[post.id] || ""}
                                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                      className="flex-1"
                                      rows={2}
                                      maxLength={500}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleSubmitComment(post.id)}
                                      disabled={!newComment[post.id]?.trim()}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}

                                {/* Comments List */}
                                {comments[post.id]?.length > 0 ? (
                                  <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                    {comments[post.id].map(comment => (
                                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                              <User className="h-3 w-3 text-primary" />
                                            </div>
                                            <div>
                                              <span className="font-medium text-sm text-gray-900">
                                                {getUserDisplayNameFromComment(comment)}
                                              </span>
                                              <span className="text-xs text-gray-500 ml-2">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                              </span>
                                            </div>
                                          </div>
                                          
                                          {user?.id === comment.user_id && (
                                            <div className="flex gap-1">
                                              {editingCommentId === comment.id ? (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                    setEditingCommentId(null);
                                                    setEditCommentContent("");
                                                  }}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              ) : (
                                                <>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      setEditingCommentId(comment.id);
                                                      setEditCommentContent(comment.content);
                                                    }}
                                                  >
                                                    <Edit2 className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteComment(comment.id, post.id)}
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        {editingCommentId === comment.id ? (
                                          <div className="space-y-2">
                                            <Textarea
                                              value={editCommentContent}
                                              onChange={(e) => setEditCommentContent(e.target.value)}
                                              rows={2}
                                              maxLength={500}
                                            />
                                            <Button 
                                              size="sm"
                                              onClick={() => handleUpdateComment(comment.id, post.id)}
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {comment.content}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 text-center py-4">
                                    No comments yet. Be the first to comment!
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Forum;
