import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

// Lazy load des routes secondaires pour réduire le bundle initial
const CreateBouquet = lazy(() => import("./pages/CreateBouquet"));
const BouquetDetail = lazy(() => import("./pages/BouquetDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Favorites = lazy(() => import("./pages/Favorites"));
const LoyaltyPoints = lazy(() => import("./pages/LoyaltyPoints"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Account = lazy(() => import("./pages/Account"));
const Notifications = lazy(() => import("./pages/Notifications"));
const BouquetConfigurator = lazy(() => import("./pages/BouquetConfigurator"));
const CGV = lazy(() => import("./pages/CGV"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Referral = lazy(() => import("./pages/Referral"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const FAQ = lazy(() => import("./pages/FAQ"));
const History = lazy(() => import("./pages/History"));
const Birthdays = lazy(() => import("./pages/Birthdays"));

// Composant de loading pour les routes lazy
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
      <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/create" component={CreateBouquet} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/scanner" component={Scanner} />
        <Route path="/history" component={History} />
        <Route path="/birthdays" component={Birthdays} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/loyalty-points" component={LoyaltyPoints} />
        <Route path="/subscriptions" component={Subscriptions} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/account" component={Account} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/configurator" component={BouquetConfigurator} />
        <Route path="/bouquet/:id" component={BouquetDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/cgv" component={CGV} />
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/referral" component={Referral} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/faq" component={FAQ} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      <Footer />
      </div>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
