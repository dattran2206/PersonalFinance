import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import WalletCard from '@/components/WalletCard';
import TransactionCard from '@/components/TransactionCard';
import { Plus, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '@/constants/currency';

interface Wallet {
    id: string;
    name: string;
    balance: number;
    type: 'cash' | 'bank' | 'momo' | 'card';
}

interface Transaction {
    id: string;
    amount: number;
    category: string;
    wallet: string;
    type: 'income' | 'expense' | 'transfer';
    note: string;
    date: string;
}

interface SavingGoal {
    id: string;
    name: string;
    target: number;
    saved: number;
}

const Dashboard = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);

    useEffect(() => {
        // Initialize sample data if not exists
        const savedWallets = localStorage.getItem('wallets');
        const savedTransactions = localStorage.getItem('transactions');
        const savedGoals = localStorage.getItem('savingGoals');

        if (!savedWallets) {
            const initialWallets: Wallet[] = [
                { id: '1', name: 'Tiền mặt', balance: 500, type: 'cash' },
                { id: '2', name: 'Techcombank', balance: 2500, type: 'bank' },
                { id: '3', name: 'Vietcombank', balance: 150, type: 'bank' },
                { id: '4', name: 'Momo', balance: 150, type: 'momo' },
            ];
            localStorage.setItem('wallets', JSON.stringify(initialWallets));
            setWallets(initialWallets);
        } else {
            setWallets(JSON.parse(savedWallets));
        }

        if (!savedTransactions) {
            const initialTransactions: Transaction[] = [
                {
                    id: '1',
                    amount: -25,
                    category: 'Food',
                    wallet: 'Cash',
                    type: 'expense',
                    note: 'Lunch at restaurant',
                    date: new Date().toISOString(),
                },
                {
                    id: '2',
                    amount: -15,
                    category: 'Transport',
                    wallet: 'MoMo Wallet',
                    type: 'expense',
                    note: 'Grab ride to office',
                    date: new Date(Date.now() - 86400000).toISOString(),
                },
                {
                    id: '3',
                    amount: 1000,
                    category: 'Salary',
                    wallet: 'Bank Account',
                    type: 'income',
                    note: 'Monthly salary',
                    date: new Date(Date.now() - 172800000).toISOString(),
                },
            ];
            localStorage.setItem('transactions', JSON.stringify(initialTransactions));
            setTransactions(initialTransactions);
        } else {
            setTransactions(JSON.parse(savedTransactions));
        }

        if (!savedGoals) {
            const initialGoals: SavingGoal[] = [
                { id: '1', name: 'Mua Laptop', target: 1500, saved: 600 },
                { id: '2', name: 'Đi du lịch với eiu', target: 2000, saved: 350 },
                { id: '3', name: 'Mua điện thoại', target: 5000, saved: 1200 },
            ];
            localStorage.setItem('savingGoals', JSON.stringify(initialGoals));
            setSavingGoals(initialGoals);
        } else {
            setSavingGoals(JSON.parse(savedGoals));
        }
    }, []);

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const recentTransactions = transactions.slice(0, 5);

    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate spending by category
    const categorySpending = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            return acc;
        }, {} as Record<string, number>);

    return (
        <div className="md:ml-72 p-6 space-y-6 mt-20 md:mt-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Chào mừng bạn trở lại! Dưới đây là tổng quan về tài chính của bạn.</p>
                </div>
                <Link to="/add-transaction">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm giao dịch
                    </Button>
                </Link>
            </div>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Tổng số dư</p>
                            <p className="text-3xl font-bold text-blue-800">{totalBalance.toLocaleString()} {CURRENCY_SYMBOLS}</p>
                        </div>
                        <div className="p-3 bg-blue-200 rounded-full">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Thu nhập hàng tháng</p>
                            <p className="text-3xl font-bold text-green-800">{monthlyIncome.toLocaleString()} {CURRENCY_SYMBOLS}</p>
                        </div>
                        <div className="p-3 bg-green-200 rounded-full">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Chi phí hàng tháng</p>
                            <p className="text-3xl font-bold text-red-800">{monthlyExpenses.toLocaleString()} {CURRENCY_SYMBOLS}</p>
                        </div>
                        <div className="p-3 bg-red-200 rounded-full">
                            <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wallets */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Ví của bạn</h2>
                    <div className="space-y-3">
                        {wallets.map((wallet) => (
                            <WalletCard key={wallet.id} wallet={wallet} />
                        ))}
                    </div>
                </Card>

                {/* Spending by Category */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiêu theo mục</h2>
                    <div className="space-y-4">
                        {Object.entries(categorySpending).map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between">
                                <span className="text-gray-700">{category}</span>
                                <span className="font-semibold text-red-600">{amount.toLocaleString()} {CURRENCY_SYMBOLS}</span>
                            </div>
                        ))}
                        {Object.keys(categorySpending).length === 0 && (
                            <p className="text-gray-500 text-center py-4">Không có dữ liệu chi tiêu nào có sẵn</p>
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Giao dịch gần đây</h2>
                        <Link to="/add-transaction">
                            <Button variant="outline" size="sm">Xem tất cả</Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                            <TransactionCard key={transaction.id} transaction={transaction} />
                        ))}
                        {recentTransactions.length === 0 && (
                            <p className="text-gray-500 text-center py-4">Chưa có giao dịch nào</p>
                        )}
                    </div>
                </Card>

                {/* Saving Goals Preview */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Mục tiêu tiết kiệm</h2>
                        <Link to="/saving-goals">
                            <Button variant="outline" size="sm">
                                <Target className="h-4 w-4 mr-1" />
                                Xem tất cả
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {savingGoals.slice(0, 3).map((goal) => (
                            <div key={goal.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-800">{goal.name}</span>
                                    <span className="text-sm text-gray-600">
                                        {goal.saved.toLocaleString()} {CURRENCY_SYMBOLS} / {goal.target.toLocaleString()} {CURRENCY_SYMBOLS}
                                    </span>
                                </div>
                                <Progress value={(goal.saved / goal.target) * 100} className="h-2" />
                            </div>
                        ))}
                        {savingGoals.length === 0 && (
                            <p className="text-gray-500 text-center py-4">Không có mục tiêu tiết kiệm</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;