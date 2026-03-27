import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AddLog from "./pages/AddLog.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthHandshake } from "@/components/AuthHandshake";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthHandshake />
        <Routes>
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/token" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/add" element={<AuthGuard><AddLog /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
