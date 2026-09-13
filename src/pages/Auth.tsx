import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Footer from "@/components/Footer";
import { validatePasswordStrength, isCommonPassword } from "@/utils/passwordValidation";
import { useSecurityTracking } from "@/hooks/useSecurityTracking";
import { PasswordStrengthIndicator } from "@/components/security/PasswordStrengthIndicator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Separate schemas for login and signup
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  password: z.string().min(1, "Password is required"), // No minimum length for login
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  password: z.string().min(12, "Password must be at least 12 characters").max(100),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
});

const Auth = () => {
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const securityTracking = useSecurityTracking();
  
  // Check URL parameter for mode (login/signup)
  const searchParams = new URLSearchParams(window.location.search);
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  
  // Password strength validation
  const passwordValidation = password ? validatePasswordStrength(password) : { isValid: false, errors: [], strength: "weak" as const };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", { event, user: session?.user?.email });
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery detected");
        setIsPasswordReset(true);
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        if (session?.user) {
          console.log("User signed in, redirecting to dashboard");
          navigate("/dashboard");
        }
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", { user: session?.user?.email });
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    // Check URL hash for password recovery
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlType = hashParams.get('type');
    console.log("URL hash params:", { type: urlType });
    
    if (urlType === 'recovery') {
      console.log("URL indicates password recovery");
      setIsPasswordReset(true);
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for account lockout
      if (isLogin) {
        const isLocked = await securityTracking.checkAccountLockout(email);
        if (isLocked) {
          setAccountLocked(true);
          toast({
            variant: "destructive",
            title: "Account Locked",
            description: "Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.",
          });
          setLoading(false);
          return;
        }
      }

      // Use appropriate schema based on login/signup
      let validatedData;
      
      if (isLogin) {
        // For login, only validate email format - no password length requirement
        validatedData = loginSchema.parse({ email, password });
      } else {
        // For signup, apply full validation
        if (!passwordValidation.isValid) {
          toast({
            variant: "destructive",
            title: "Weak Password",
            description: "Please create a stronger password that meets all requirements.",
          });
          setLoading(false);
          return;
        }
        
        if (isCommonPassword(password)) {
          toast({
            variant: "destructive",
            title: "Common Password",
            description: "This password is too common. Please choose a more unique password.",
          });
          setLoading(false);
          return;
        }
        
        validatedData = signupSchema.parse({ email, password, username });
      }
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) {
          // Track failed login attempt
          await securityTracking.trackLoginAttempt({
            email: validatedData.email,
            success: false,
            failureReason: error.message,
          });
          
          // Check if account should be locked
          const failedAttempts = await securityTracking.getRecentFailedAttempts(validatedData.email);
          if (failedAttempts >= 4) {
            setAccountLocked(true);
            // Lock account for 30 minutes
            await supabase.from("account_lockouts").upsert({
              email: validatedData.email,
              locked_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              lock_reason: "Multiple failed login attempts",
              attempt_count: failedAttempts + 1,
            });
          }
          
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: `Invalid email or password. ${5 - failedAttempts} attempts remaining before account lockout.`,
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              variant: "destructive",
              title: "Email Not Confirmed",
              description: "Please check your email and click the confirmation link.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: error.message,
            });
          }
        } else {
          // Track successful login
          await securityTracking.trackLoginAttempt({
            email: validatedData.email,
            success: true,
          });
          
          if (data.user) {
            await securityTracking.trackLoginHistory({
              userId: data.user.id,
            });
          }
          
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: validatedData.username
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              variant: "destructive",
              title: "Account Exists",
              description: "An account with this email already exists. Please sign in instead.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Signup Failed",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "You can now sign in with your credentials.",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
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
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address first.",
      });
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password Reset Sent!",
          description: "Check your email for a password reset link.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send password reset email.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Password Update Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password Updated!",
          description: "Your password has been successfully updated.",
        });
        setIsPasswordReset(false);
        setIsLogin(true);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isPasswordReset 
              ? "Set New Password" 
              : (isLogin ? "Welcome Back" : "Create Account")
            }
          </CardTitle>
          <CardDescription>
            {isPasswordReset 
              ? "Enter your new password below"
              : isLogin 
                ? "Sign in to access your financial dashboard" 
                : "Join to start managing your finances"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPasswordReset ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+"
                    title="Username can only contain letters, numbers, and underscores"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Create a strong password (12+ characters)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={isLogin ? 6 : 12}
                />
                {!isLogin && password && (
                  <PasswordStrengthIndicator
                    password={password}
                    strength={passwordValidation.strength}
                    errors={passwordValidation.errors}
                  />
                )}
              </div>
              
              {accountLocked && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account has been temporarily locked due to multiple failed login attempts.
                    Please try again in 30 minutes or reset your password.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
              
              {!isLogin && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  By creating an account, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </form>
          )}
          
          {!isPasswordReset && isLogin && (
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="text-sm"
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </Button>
            </div>
          )}
          
          {!isPasswordReset && (
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <Footer />
    </div>
  );
};

export default Auth;