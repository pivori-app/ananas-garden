import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, LogOut, LayoutDashboard, UserCircle, Gift } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Détection du scroll pour l'animation du header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('session_id') || '';
    }
    return '';
  });

  const { data: cartItems } = trpc.cart.list.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const prevCountRef = useRef(cartItemCount);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (cartItemCount > prevCountRef.current) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/create", label: "Créer un bouquet" },
    { href: "/scanner", label: "Scanner" },
    { href: "/blog", label: "Blog" },
    { href: "/cart", label: "Panier", badge: cartItemCount },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' 
        : ''
    }`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer">
            <img src={APP_LOGO} alt="Ananas Garden" className="h-14 w-14 object-contain" />
            <span className="text-2xl font-bold tracking-tight">
              Ananas Garden
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span 
                    className={`absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transition-transform ${
                      shouldAnimate && item.href === "/cart" ? "animate-bounce" : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <div className="flex items-center cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon compte</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <div className="flex items-center cursor-pointer w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/referral">
                    <div className="flex items-center cursor-pointer w-full">
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Parrainage</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <a href={getLoginUrl()}>Connexion</a>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu de navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 pt-8">
              <Link href="/">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src={APP_LOGO} alt="Ananas Garden" className="h-14 w-14 object-contain" />
                  <span className="text-2xl font-bold">Ananas Garden</span>
                </div>
              </Link>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 text-lg font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span 
                          className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground transition-transform ${
                            shouldAnimate && item.href === "/cart" ? "animate-bounce" : ""
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                
                {/* Mon compte - visible uniquement si connecté */}
                {isAuthenticated && (
                  <Link href="/account">
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-colors cursor-pointer ${
                        isActive("/account")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>Mon compte</span>
                    </div>
                  </Link>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
