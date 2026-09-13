import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";

const SharedNavigation = () => {
  const { user, signOut } = useAuth();
  const { track } = useAnalytics();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    track('user_signed_out', { method: 'navigation' });
    await signOut();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-[90%] mx-auto px-4 relative">
        {/* Logo spanning full nav height - hidden on mobile */}
        <Link to="/" className="hidden md:flex absolute left-2 top-2 bottom-2 items-stretch z-10">
          <img src="/logo.png" alt="AmortIQ Logo" className="h-full w-auto object-contain" />
        </Link>
        
        <div className="flex items-center justify-between py-2 md:pl-52 lg:pl-60">
          {/* Mobile logo */}
          <Link to="/" className="flex md:hidden">
            <img src="/logo.png" alt="AmortIQ Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="hidden md:block"></div> {/* Spacer for logo on desktop */}
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="sm" onClick={() => track('cta_click', { location: 'nav', type: 'dashboard' })}>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-black hover:text-primary">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost" size="sm" onClick={() => track('cta_click', { location: 'nav', type: 'sign_in' })} className="text-black hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm" onClick={() => track('cta_click', { location: 'nav', type: 'register' })}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="flex flex-col gap-6 mt-8 pb-8">
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 pb-6 border-b">
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/dashboard" className="w-full">
                          <Button className="w-full" onClick={() => track('cta_click', { location: 'mobile_nav', type: 'dashboard' })}>
                            Go to Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button variant="outline" className="w-full" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link to="/auth?mode=signup" className="w-full">
                          <Button className="w-full" onClick={() => track('cta_click', { location: 'mobile_nav', type: 'register' })}>
                            Register
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/auth?mode=login" className="w-full">
                          <Button variant="outline" className="w-full" onClick={() => track('cta_click', { location: 'mobile_nav', type: 'sign_in' })}>
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link 
                      to="/" 
                      className="text-lg font-medium text-black hover:text-primary transition-colors py-2"
                      onClick={() => track('navigation_click', { destination: 'home', device: 'mobile' })}
                    >
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/about" 
                      className="text-lg font-medium text-black hover:text-primary transition-colors py-2"
                      onClick={() => track('navigation_click', { destination: 'about', device: 'mobile' })}
                    >
                      About
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/features" 
                      className="text-lg font-medium text-black hover:text-primary transition-colors py-2"
                      onClick={() => track('navigation_click', { destination: 'features', device: 'mobile' })}
                    >
                      Features
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/pricing" 
                      className="text-lg font-medium text-black hover:text-primary transition-colors py-2"
                      onClick={() => track('navigation_click', { destination: 'pricing', device: 'mobile' })}
                    >
                      Pricing
                    </Link>
                  </SheetClose>
                  <div className="flex flex-col gap-2 pl-2 border-l-2 border-muted">
                    <SheetClose asChild>
                      <Link 
                        to="/resources" 
                        className="text-base font-medium text-black hover:text-primary transition-colors py-2"
                        onClick={() => track('navigation_click', { destination: 'resources', device: 'mobile' })}
                      >
                        Guides & Articles
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/affordability-calculator" 
                        className="text-base font-medium text-black hover:text-primary transition-colors py-2"
                        onClick={() => track('navigation_click', { destination: 'affordability_calculator', device: 'mobile' })}
                      >
                        Affordability Calculator
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/news" 
                        className="text-base font-medium text-black hover:text-primary transition-colors py-2"
                        onClick={() => track('navigation_click', { destination: 'news', device: 'mobile' })}
                      >
                        News & Rates
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/forum" 
                        className="text-base font-medium text-black hover:text-primary transition-colors py-2"
                        onClick={() => track('navigation_click', { destination: 'forum', device: 'mobile' })}
                      >
                        Community Forum
                      </Link>
                    </SheetClose>
                  </div>
                  <SheetClose asChild>
                    <Link 
                      to="/contact" 
                      className="text-lg font-medium text-black hover:text-primary transition-colors py-2"
                      onClick={() => track('navigation_click', { destination: 'contact', device: 'mobile' })}
                    >
                      Contact Us
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="border-t hidden md:block" style={{ borderColor: 'transparent', borderImage: 'linear-gradient(to right, transparent 165px, hsl(var(--border)) 165px) 1' }}>
          <div className="flex items-center justify-center gap-2 lg:gap-4 py-4 overflow-x-auto flex-wrap pl-40">
            <Link 
              to="/" 
              className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors px-2 py-2 whitespace-nowrap"
              onClick={() => track('navigation_click', { destination: 'home' })}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors px-2 py-2 whitespace-nowrap"
              onClick={() => track('navigation_click', { destination: 'about' })}
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors px-2 py-2 whitespace-nowrap"
              onClick={() => track('navigation_click', { destination: 'features' })}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors px-2 py-2 whitespace-nowrap"
              onClick={() => track('navigation_click', { destination: 'pricing' })}
            >
              Pricing
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors flex items-center gap-1 outline-none px-2 py-2 whitespace-nowrap">
                Resources
                <ChevronDown className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem asChild>
                  <Link 
                    to="/resources" 
                    className="w-full cursor-pointer text-base"
                    onClick={() => track('navigation_click', { destination: 'resources' })}
                  >
                    Guides & Articles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/affordability-calculator" 
                    className="w-full cursor-pointer text-base"
                    onClick={() => track('navigation_click', { destination: 'affordability_calculator' })}
                  >
                    Affordability Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/news" 
                    className="w-full cursor-pointer text-base"
                    onClick={() => track('navigation_click', { destination: 'news' })}
                  >
                    News & Rates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/forum" 
                    className="w-full cursor-pointer text-base"
                    onClick={() => track('navigation_click', { destination: 'forum' })}
                  >
                    Community Forum
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link 
              to="/contact" 
              className="text-base lg:text-lg font-medium text-black hover:text-primary transition-colors px-2 py-2 whitespace-nowrap"
              onClick={() => track('navigation_click', { destination: 'contact' })}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavigation;
