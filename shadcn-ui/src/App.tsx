import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Index from '@/pages/Index';
import AddTransaction from '@/pages/AddTransaction';
import Transfer from '@/pages/Transfer';
import SavingGoals from '@/pages/SavingGoals';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/add-transaction" element={<AddTransaction />} />
                        <Route path="/transfer" element={<Transfer />} />
                        <Route path="/saving-goals" element={<SavingGoals />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;