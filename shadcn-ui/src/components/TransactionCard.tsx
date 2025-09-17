import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    Car,
    Home,
    Coffee,
    Gamepad2,
    Heart,
    DollarSign,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

interface TransactionCardProps {
    transaction: {
        id: string;
        amount: number;
        category: string;
        wallet: string;
        type: 'income' | 'expense' | 'transfer';
        note: string;
        date: string;
    };
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'food':
                return <Coffee className="h-4 w-4" />;
            case 'transport':
                return <Car className="h-4 w-4" />;
            case 'bills':
                return <Home className="h-4 w-4" />;
            case 'entertainment':
                return <Gamepad2 className="h-4 w-4" />;
            case 'health':
                return <Heart className="h-4 w-4" />;
            case 'shopping':
                return <ShoppingCart className="h-4 w-4" />;
            default:
                return <DollarSign className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'income':
                return 'text-green-600';
            case 'expense':
                return 'text-red-600';
            case 'transfer':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowUp className="h-4 w-4 text-green-600" />;
            case 'expense':
                return <ArrowDown className="h-4 w-4 text-red-600" />;
            default:
                return <ArrowUp className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800">{transaction.category}</h3>
                            <Badge variant="secondary" className="text-xs">
                                {transaction.wallet}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{transaction.note}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default TransactionCard;