import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiProvider } from "@/lib/sui-provider";
import { DemoWalletProvider } from "@/lib/demo-wallet-context";
import Index from "./pages/Index";
import Guardians from "./pages/Guardians";
import Recovery from "./pages/Recovery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SuiProvider>
      <DemoWalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/guardians" element={<Guardians />} />
              <Route path="/recovery" element={<Recovery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DemoWalletProvider>
    </SuiProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
