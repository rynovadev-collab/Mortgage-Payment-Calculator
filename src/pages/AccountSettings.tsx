import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { User, Key, Save, CreditCard, Crown, MapPin, Trash2, MessageSquare, XCircle } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const usernameSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
});

const addressSchema = z.object({
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
});

const AccountSettings = () => {
  const { user, subscriptionData, subscriptionLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Username state
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [fetchingUsername, setFetchingUsername] = useState(true);
  
  // Address state
  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  
  // Forum privacy state
  const [showNameOnForum, setShowNameOnForum] = useState(true);
  const [forumPrivacyLoading, setForumPrivacyLoading] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cancel subscription state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Fetch current username
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, address, show_name_on_forum')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your profile information.",
          });
        } else if (profile) {
          if (profile.username) {
            setCurrentUsername(profile.username);
            setNewUsername(profile.username);
          }
          if (profile.address) {
            setAddress(profile.address);
          }
          setShowNameOnForum(profile.show_name_on_forum ?? true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setFetchingUsername(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUsernameLoading(true);
    try {
      const validatedData = usernameSchema.parse({ username: newUsername });
      
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', validatedData.username)
        .neq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Username Taken",
          description: "This username is already taken. Please choose a different one.",
        });
        return;
      }

      // Update username
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: validatedData.username 
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setCurrentUsername(validatedData.username);
      toast({
        title: "Username Updated!",
        description: "Your username has been successfully updated.",
      });
    } catch (error) {
      console.error('Username update error:', error);
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update username. Please try again.",
        });
      }
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAddressLoading(true);
    try {
      const validatedData = addressSchema.parse({ address });
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          address: validatedData.address 
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Address Updated!",
        description: "Your address has been successfully updated.",
      });
    } catch (error) {
      console.error('Address update error:', error);
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update address. Please try again.",
        });
      }
    } finally {
      setAddressLoading(false);
    }
  };

  const handleForumPrivacyUpdate = async (checked: boolean) => {
    if (!user) return;

    setForumPrivacyLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          show_name_on_forum: checked
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setShowNameOnForum(checked);
      toast({
        title: "Privacy Setting Updated",
        description: checked 
          ? "Your name will be shown on forum posts" 
          : "You will appear as Anonymous on forum posts",
      });
    } catch (error) {
      console.error('Forum privacy update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update privacy setting. Please try again.",
      });
      // Revert the switch state on error
      setShowNameOnForum(!checked);
    } finally {
      setForumPrivacyLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setPasswordLoading(true);
    try {
      const validatedData = passwordSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword
      });

      // Verify current password by trying to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: validatedData.currentPassword,
      });

      if (verifyError) {
        toast({
          variant: "destructive",
          title: "Incorrect Password",
          description: "Your current password is incorrect.",
        });
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: validatedData.newPassword
      });

      if (error) {
        throw error;
      }

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password Updated!",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      console.error('Password update error:', error);
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update password. Please try again.",
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelSubscription = async (requestType: 'immediate' | 'end_of_period') => {
    if (!user) return;

    setCancelLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('submit-refund-request', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          requestType,
          reason: cancelReason,
        },
      });

      if (error) throw error;

      toast({
        title: requestType === 'immediate' ? "Cancellation Requested" : "Cancellation Scheduled",
        description: requestType === 'immediate' 
          ? "Your subscription has been cancelled and refund request submitted. We'll review it within 24 hours."
          : "Your subscription will be cancelled at the end of the current billing period.",
      });

      setCancelDialogOpen(false);
      setCancelReason("");
      
      // Refresh subscription data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process cancellation. Please try again.",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleteLoading(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call edge function to delete account
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Sign out
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (fetchingUsername) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SharedNavigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        <div className="space-y-6">
          {/* Address Display */}
          {address && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">{address}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings.
            </p>
          </div>

          {/* Username Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Username
              </CardTitle>
              <CardDescription>
                Update your username for a more personalized experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentUsername">Current Username</Label>
                  <Input
                    id="currentUsername"
                    value={currentUsername || "Not set"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    placeholder="Enter your new username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    disabled={usernameLoading}
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+"
                    title="Username can only contain letters, numbers, and underscores"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={usernameLoading || newUsername === currentUsername}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {usernameLoading ? "Updating..." : "Update Username"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Address Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
              <CardDescription>
                Search by postcode to find your address, or enter it manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="e.g., 18 William Childerhouse Way, NR5 9LY, Norwich"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={addressLoading}
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground">
                    {address.length}/200 characters
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={addressLoading || !address.trim()}
                  className="flex items-center gap-2 w-full"
                >
                  <Save className="h-4 w-4" />
                  {addressLoading ? "Saving..." : "Save Address"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Forum Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Forum Privacy
              </CardTitle>
              <CardDescription>
                Control how your name appears on community forum posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-name-on-forum" className="font-medium">
                    Display Name on Forum
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When disabled, you'll appear as "Anonymous" on all forum posts
                  </p>
                </div>
                <Switch
                  id="show-name-on-forum"
                  checked={showNameOnForum}
                  onCheckedChange={handleForumPrivacyUpdate}
                  disabled={forumPrivacyLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>
              <CardDescription>
                Manage your premium subscription, update payment methods, or cancel your plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Current Plan:</span>
                    {subscriptionLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : subscriptionData?.subscribed ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Premium Active
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="secondary">Free Plan</Badge>
                    )}
                  </div>
                  {subscriptionData?.subscribed && subscriptionData?.subscription_end && (
                    <p className="text-sm text-muted-foreground">
                      Renews on {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {subscriptionData?.subscribed && (
                  <Button
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.functions.invoke('customer-portal', {
                          headers: {
                            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                          },
                        });

                        if (error) throw error;

                        if (data?.url) {
                          window.open(data.url, '_blank');
                        }
                      } catch (error) {
                        console.error('Error opening customer portal:', error);
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to open subscription management. Please try again.",
                        });
                      }
                    }}
                    variant="outline"
                  >
                    Manage Subscription
                  </Button>
                )}
              </div>
              
              {subscriptionData?.subscribed && (
                <>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.functions.invoke('customer-portal', {
                            headers: {
                              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                            },
                          });

                          if (error) throw error;

                          if (data?.url) {
                            window.open(data.url, '_blank');
                          }
                        } catch (error) {
                          console.error('Error opening customer portal:', error);
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to open subscription management. Please try again.",
                          });
                        }
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Manage Subscription
                    </Button>
                    <Button
                      onClick={() => setCancelDialogOpen(true)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Subscription Management Options:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Cancel your subscription anytime</li>
                      <li>Update payment methods</li>
                      <li>View billing history</li>
                      <li>Download invoices</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and current status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <Input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="text-sm text-destructive font-medium mb-2">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Deleting your account will permanently remove all your data, including your profile, 
                    mortgage accounts, and subscription information. This action is irreversible.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Choose how you would like to cancel your subscription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <div className="space-y-3">
              <Button
                onClick={() => handleCancelSubscription('immediate')}
                variant="destructive"
                className="w-full"
                disabled={cancelLoading}
              >
                Request Refund & Cancel Immediately
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Cancels now and requests a refund (subject to 14-day cooling-off period)
              </p>
              <Button
                onClick={() => handleCancelSubscription('end_of_period')}
                variant="outline"
                className="w-full"
                disabled={cancelLoading}
              >
                Cancel at End of Billing Period
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Keep access until {subscriptionData?.subscription_end ? new Date(subscriptionData.subscription_end).toLocaleDateString() : 'end of period'}, no refund
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </p>
              <p className="font-medium text-destructive">
                All of the following will be permanently deleted:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Your profile and account information</li>
                <li>All mortgage accounts and calculations</li>
                <li>Subscription and billing history</li>
                <li>Reviews and forum posts</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSettings;
