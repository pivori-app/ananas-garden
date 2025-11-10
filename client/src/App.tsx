import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CreateBouquet from "./pages/CreateBouquet";
import BouquetDetail from "./pages/BouquetDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Catalog from "./pages/Catalog";
import Scanner from "./pages/Scanner";
import Favorites from "./pages/Favorites";
import LoyaltyPoints from "./pages/LoyaltyPoints";
import CGV from "./pages/CGV";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Contact from "./pages/Contact";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/create" component={CreateBouquet} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/scanner" component={Scanner} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/loyalty-points" component={LoyaltyPoints} />
        <Route path="/bouquet/:id" component={BouquetDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/cgv" component={CGV} />
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
        <Route path="/contact" component={Contact} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
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
