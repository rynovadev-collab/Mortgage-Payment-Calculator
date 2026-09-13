import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const guideSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(500),
  topics: z.array(z.string().min(1).max(200)).min(1),
  display_order: z.number().int().min(1),
});

interface Guide {
  id: string;
  title: string;
  description: string;
  topics: string[];
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const GuidesManagement = () => {
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topics: [""],
    display_order: 1,
    published: false,
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('display_order');

      if (error) throw error;
      
      const formattedGuides = (data || []).map(guide => ({
        ...guide,
        topics: Array.isArray(guide.topics) ? guide.topics : 
                (typeof guide.topics === 'string' ? JSON.parse(guide.topics) : [])
      }));
      
      setGuides(formattedGuides);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load guides",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const validatedData = guideSchema.parse(formData);
      
      if (editingId) {
        const { error } = await supabase
          .from('guides')
          .update({
            ...validatedData,
            topics: JSON.stringify(validatedData.topics),
            published: formData.published,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Guide updated successfully" });
      } else {
        const { error } = await supabase
          .from('guides')
          .insert({
            ...validatedData,
            topics: JSON.stringify(validatedData.topics),
            published: formData.published,
          });

        if (error) throw error;
        toast({ title: "Guide created successfully" });
      }

      resetForm();
      fetchGuides();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        console.error('Error saving guide:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save guide",
        });
      }
    }
  };

  const handleEdit = (guide: Guide) => {
    setEditingId(guide.id);
    setIsCreating(true);
    setFormData({
      title: guide.title,
      description: guide.description,
      topics: Array.isArray(guide.topics) ? guide.topics : [],
      display_order: guide.display_order,
      published: guide.published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    try {
      const { error } = await supabase
        .from('guides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Guide deleted successfully" });
      fetchGuides();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete guide",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      topics: [""],
      display_order: 1,
      published: false,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const addTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ""] });
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  if (loading) return <div>Loading guides...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Guides Management</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? "Cancel" : "Add Guide"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Guide" : "Create New Guide"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Understanding Mortgage Basics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the guide"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Topics</Label>
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder="e.g., What is a mortgage?"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTopic(index)}
                    disabled={formData.topics.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addTopic} size="sm">
                Add Topic
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
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
              {editingId ? "Update Guide" : "Create Guide"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {guides.map((guide) => (
          <Card key={guide.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {guide.title}
                    {guide.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(guide)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(guide.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Topics:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {(Array.isArray(guide.topics) ? guide.topics : []).map((topic, index) => (
                    <li key={index}>• {topic}</li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">Display Order: {guide.display_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};