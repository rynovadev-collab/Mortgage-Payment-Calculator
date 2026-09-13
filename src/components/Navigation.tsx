import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Settings, Shield, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const { user, signOut } = useAuth();
  const { track } = useAnalytics();

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        if (data?.username) {
          setUsername(data.username);
        } else {
          // Reset username if no username found in profile
          setUsername("");
        }
      } else {
        setUsername("");
      }
    };
    
    fetchUsername();
  }, [user]);

  const getDisplayName = () => {
    if (username) return username;
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "Guest";
  };

  const handleSignOut = async () => {
    track('user_signed_out', { method: 'navigation' });
    await signOut();
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 shadow-sm border-b border-border" itemScope itemType="https://schema.org/SiteNavigationElement">
      <div className="max-w-[90%] mx-auto px-4 relative">
        {/* Logo spanning full nav height - hidden on mobile */}
        <Link to="/" itemProp="url" className="hidden md:flex absolute left-2 top-2 bottom-2 items-stretch z-10">
          <img src="/logo.png" alt="AmortIQ Logo" className="h-full w-auto object-contain" />
        </Link>
        
        <div className="flex items-center justify-between h-16 md:pl-52 lg:pl-60">
          {/* Mobile logo */}
          <Link to="/" itemProp="url" className="flex md:hidden">
            <img src="/logo.png" alt="AmortIQ Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="hidden md:block"></div> {/* Spacer for logo on desktop */}
          
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link 
              to="/" 
              className="text-black hover:text-primary transition-colors font-medium text-sm"
              onClick={() => track('navigation_click', { destination: 'home' })}
              itemProp="url"
            >
              <span itemProp="name">Home</span>
            </Link>
            
            <div className="relative">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-auto py-0 px-0 text-black hover:text-primary bg-transparent hover:bg-transparent data-[state=open]:bg-transparent font-medium text-sm">
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[100]">
                      <ul className="grid w-[400px] gap-3 p-4 bg-background">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              onClick={() => track('navigation_click', { destination: 'about' })}
                            >
                              <div className="text-sm font-medium leading-none text-black">About</div>
                              <p className="line-clamp-2 text-sm leading-snug text-black">
                                Learn more about AmortIQ
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/features"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              onClick={() => track('navigation_click', { destination: 'features' })}
                            >
                              <div className="text-sm font-medium leading-none text-black">Features</div>
                              <p className="line-clamp-2 text-sm leading-snug text-black">
                                Explore our powerful tools
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/resources"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              onClick={() => track('navigation_click', { destination: 'resources' })}
                            >
                              <div className="text-sm font-medium leading-none text-black">Resource Center</div>
                              <p className="line-clamp-2 text-sm leading-snug text-black">
                                Guides and tools
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/contact"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              onClick={() => track('navigation_click', { destination: 'contact' })}
                            >
                              <div className="text-sm font-medium leading-none text-black">Contact</div>
                              <p className="line-clamp-2 text-sm leading-snug text-black">
                                Get in touch with us
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            <Link 
              to="/account-settings" 
              className="text-black hover:text-primary transition-colors flex items-center gap-1 font-medium text-sm"
              onClick={() => track('navigation_click', { destination: 'account_settings' })}
            >
              <Settings className="h-4 w-4" />
              Account
            </Link>
            <Link 
              to="/security" 
              className="text-black hover:text-primary transition-colors flex items-center gap-1 font-medium text-sm"
              onClick={() => track('navigation_click', { destination: 'security' })}
            >
              <Shield className="h-4 w-4" />
              Security
            </Link>
            {user && (
              <div className="flex items-center space-x-2 text-sm text-black">
                <User className="h-4 w-4" />
                <span>{getDisplayName()}</span>
              </div>
            )}
            <Button variant="ghost" onClick={handleSignOut} className="flex items-center space-x-2 text-black">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-white">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="px-3 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  track('navigation_click', { destination: 'home', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
              
              <div className="px-3 py-2 text-sm font-medium text-black">
                Resources
              </div>
              <Link 
                to="/about" 
                className="px-6 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  track('navigation_click', { destination: 'about', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="px-6 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  track('navigation_click', { destination: 'features', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                Features
              </Link>
              <Link 
                to="/resources" 
                className="px-6 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  track('navigation_click', { destination: 'resources', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                Resource Center
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  track('navigation_click', { destination: 'contact', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                Contact
              </Link>
              
              <Link 
                to="/account-settings" 
                className="px-3 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 mt-2"
                onClick={() => {
                  track('navigation_click', { destination: 'account_settings', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
              <Link 
                to="/security" 
                className="px-3 py-2 text-black hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => {
                  track('navigation_click', { destination: 'security', source: 'mobile_menu' });
                  setIsMenuOpen(false);
                }}
              >
                <Shield className="h-4 w-4" />
                Security Center
              </Link>
              {user && (
                <div className="px-3 py-2 text-sm text-black border-b pb-3 mb-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Signed in as: {getDisplayName()}</span>
                  </div>
                </div>
              )}
              <Button 
                variant="ghost" 
                className="justify-start flex items-center space-x-2 mx-3 text-black"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
