import { Card } from '@/components/ui/card';
import { Wallet, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface WalletCardProps {
    wallet: {
        id: string;
        name: string;
        balance: number;
        type: 'cash' | 'bank' | 'momo' | 'card';
    };
}

const WalletCard = ({ wallet }: WalletCardProps) => {
    const getWalletIcon = (type: string) => {
        switch (type) {
            case 'cash':
                return <Banknote className="h-6 w-6" />;
            case 'bank':
                return <CreditCard className="h-6 w-6" />;
            case 'momo':
                return <Smartphone className="h-6 w-6" />;
            default:
                return <Wallet className="h-6 w-6" />;
        }
    };

    const getWalletColor = (type: string) => {
        switch (type) {
            case 'cash':
                return 'text-green-600 bg-green-50';
            case 'bank':
                return 'text-blue-600 bg-blue-50';
            case 'momo':
                return 'text-purple-600 bg-purple-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getWalletColor(wallet.type)}`}>
                        {getWalletIcon(wallet.type)}
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800">{wallet.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{wallet.type}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                        ${wallet.balance.toLocaleString()}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default WalletCard;