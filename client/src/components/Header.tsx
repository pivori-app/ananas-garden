import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    { href: "/cart", label: "Panier", badge: cartItemCount }
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={APP_LOGO} alt="Ananas Garden" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight">
              Ananas Garden
            </span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
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
              </a>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 pt-8">
              <Link href="/">
                <a 
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src={APP_LOGO} alt="Ananas Garden" className="h-10 w-10 object-contain" />
                  <span className="text-2xl font-bold">Ananas Garden</span>
                </a>
              </Link>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
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
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
