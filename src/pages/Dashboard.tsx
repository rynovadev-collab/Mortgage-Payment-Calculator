import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import MortgageDashboard from "@/components/MortgageDashboard";
import ReviewWidget from "@/components/ReviewWidget";
import FeedbackWidget from "@/components/FeedbackWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageCircle, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, subscriptionData } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Array<{ id: string; account_name: string }>>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  
  // Fetch username and accounts from profiles/mortgage_accounts tables
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profile) {
          setUsername(profile.username);
        }

        // Fetch mortgage accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('mortgage_accounts')
          .select('id, account_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
        } else if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData);
          setSelectedAccountId(accountsData[0].id);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleCreateAccount = async () => {
    if (!user || !newAccountName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an account name.",
      });
      return;
    }

    if (!subscriptionData?.subscribed) {
      toast({
        variant: "destructive",
        title: "Premium Feature",
        description: "Multiple mortgage accounts are only available for premium members. Upgrade to access this feature.",
      });
      return;
    }

    setCreatingAccount(true);
    try {
      const { data, error } = await supabase
        .from('mortgage_accounts')
        .insert({
          user_id: user.id,
          account_name: newAccountName.trim(),
          mortgage_amount: 0,
          current_rate: 0,
          monthly_payment: 0,
          contract_end_date: new Date().toISOString().split('T')[0],
          payment_day_of_month: 1,
          overpayment_amount: 0,
        })
        .select('id, account_name')
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An account with this name already exists.",
          });
        } else {
          throw error;
        }
      } else if (data) {
        setAccounts(prev => [...prev, data]);
        setSelectedAccountId(data.id);
        setIsAddDialogOpen(false);
        setNewAccountName("");
        toast({
          title: "Success",
          description: `Account "${data.account_name}" created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setCreatingAccount(false);
    }
  };
  
  // Get display name with fallback
  const getDisplayName = () => {
    if (username) return username;
    if (!user) return "Guest";
    
    // Fallback to email-based name if no username
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "Guest";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-14 md:pt-16 pb-6">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="space-y-4 md:space-y-6">
              <div className="animate-pulse">
                <div className="h-6 md:h-8 bg-muted rounded w-1/2 md:w-1/3 mb-4"></div>
                <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                  <div className="h-48 md:h-64 bg-muted rounded"></div>
                  <div className="h-48 md:h-64 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-14 md:pt-16 pb-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {/* Welcome Message */}
          <div className="mt-4 md:mt-6 mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2 text-center md:text-left">
              Welcome {getDisplayName()}! 👋
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-black text-center md:text-left">
              Your mortgage savings are awaiting! Let's explore your payment breakdown and discover how much you can save.
            </p>
          </div>

          {/* Account Selector */}
          {accounts.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Label htmlFor="account-select" className="text-base font-semibold min-w-fit text-black">
                Select Account:
              </Label>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -left-2 z-10 text-[10px] px-1.5 py-0.5 pointer-events-none"
                  >
                    Premium
                  </Badge>
                  <Select value={selectedAccountId || undefined} onValueChange={setSelectedAccountId}>
                    <SelectTrigger id="account-select" className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                      title="Add new account (Premium)"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader>
                      <DialogTitle>Add New Mortgage Account</DialogTitle>
                      <DialogDescription>
                        {subscriptionData?.subscribed 
                          ? "Create a new mortgage or finance account to track separately."
                          : "This is a premium feature. Upgrade to add multiple accounts."}
                      </DialogDescription>
                    </DialogHeader>
                    {subscriptionData?.subscribed ? (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="account-name">Account Name</Label>
                          <Input
                            id="account-name"
                            placeholder="e.g., Car Finance Account"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
                          />
                        </div>
                        <Button 
                          onClick={handleCreateAccount} 
                          disabled={creatingAccount || !newAccountName.trim()}
                          className="w-full"
                        >
                          {creatingAccount ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4">
                        <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          
          <MortgageDashboard key={selectedAccountId} selectedAccountId={selectedAccountId} />
          
          {/* Review & Feedback Tabs */}
          <div className="mt-8 mb-8">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="reviews" className="flex items-center gap-2 text-black">
                  <Star className="h-4 w-4" />
                  Leave a Review
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2 text-black">
                  <MessageCircle className="h-4 w-4" />
                  Send Feedback
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews">
                <ReviewWidget />
              </TabsContent>
              
              <TabsContent value="feedback">
                <FeedbackWidget />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
