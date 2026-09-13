import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const featureSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(500),
  icon_name: z.string().min(1),
  display_order: z.number().int().min(1),
});

interface Feature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_coming_soon: boolean;
  created_at: string;
  updated_at: string;
}

const iconOptions = [
  "Calculator", "TrendingUp", "Calendar", "PieChart", "FileText", "Shield",
  "Star", "CheckCircle", "Zap", "Target", "Award", "BarChart"
];

export const FeaturesManagement = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "Star",
    display_order: 1,
    is_coming_soon: false,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load features",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const validatedData = featureSchema.parse(formData);
      
      if (editingId) {
        const { error } = await supabase
          .from('features')
          .update({
            ...validatedData,
            is_coming_soon: formData.is_coming_soon,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Feature updated successfully" });
      } else {
        const { error } = await supabase
          .from('features')
          .insert({
            ...validatedData,
            is_coming_soon: formData.is_coming_soon,
          });

        if (error) throw error;
        toast({ title: "Feature created successfully" });
      }

      resetForm();
      fetchFeatures();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        console.error('Error saving feature:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save feature",
        });
      }
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id);
    setIsCreating(true);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon_name: feature.icon_name,
      display_order: feature.display_order,
      is_coming_soon: feature.is_coming_soon,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;

    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Feature deleted successfully" });
      fetchFeatures();
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete feature",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon_name: "Star",
      display_order: 1,
      is_coming_soon: false,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (loading) return <div>Loading features...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Features Management</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? "Cancel" : "Add Feature"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Feature" : "Create New Feature"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Feature title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Feature description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                id="is_coming_soon"
                checked={formData.is_coming_soon}
                onCheckedChange={(checked) => setFormData({ ...formData, is_coming_soon: checked })}
              />
              <Label htmlFor="is_coming_soon">Coming Soon</Label>
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Update Feature" : "Create Feature"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {feature.title}
                    {feature.is_coming_soon && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(feature)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(feature.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Icon: {feature.icon_name}</p>
                <p>Display Order: {feature.display_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};