import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Newspaper, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50).max(5000),
  category: z.string().min(1),
});

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const NewsManagement = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    published: false,
  });

  const categories = ["general", "rates", "market", "policy", "tips"];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load news articles",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const validatedData = articleSchema.parse(formData);
      
      if (editingId) {
        const { error } = await supabase
          .from('news_articles')
          .update({
            ...validatedData,
            published: formData.published,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Article updated successfully" });
      } else {
        const { error } = await supabase
          .from('news_articles')
          .insert({
            ...validatedData,
            published: formData.published,
          });

        if (error) throw error;
        toast({ title: "Article created successfully" });
      }

      resetForm();
      fetchArticles();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        console.error('Error saving article:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save article",
        });
      }
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setIsCreating(true);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      published: article.published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Article deleted successfully" });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete article",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      published: false,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (loading) return <div>Loading news articles...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News Articles Management</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? "Cancel" : "Add Article"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Article" : "Create New Article"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Article content"
                rows={10}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Update Article" : "Create Article"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    {article.title}
                    {article.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                    <Badge variant="outline">{article.category}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {article.content.substring(0, 150)}...
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};