import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Home,
    Plus,
    ArrowLeftRight,
    Target,
    Wallet,
    Menu,
    X
} from 'lucide-react';

const Navigation = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/add-transaction', icon: Plus, label: 'Add Transaction' },
        { path: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
        { path: '/saving-goals', icon: Target, label: 'Saving Goals' },
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <Card className="hidden md:block fixed left-4 top-4 bottom-4 w-64 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-8">
                    <Wallet className="h-8 w-8 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">Finance Manager</h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </Card>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Card className="fixed top-4 left-4 right-4 p-4 shadow-lg z-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-6 w-6 text-blue-600" />
                            <h1 className="text-lg font-bold text-gray-800">Finance Manager</h1>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>

                    {isMobileMenuOpen && (
                        <nav className="mt-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button
                                            variant={isActive ? "default" : "ghost"}
                                            className={`w-full justify-start gap-3 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Navigation;