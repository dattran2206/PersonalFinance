import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Coffee, Car, Home, Gamepad2, ShoppingCart, Heart, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

const AddTransaction = () => {
    const navigate = useNavigate();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [note, setNote] = useState('');

    const quickExpenses = [
        { name: 'Coffee', amount: 5, category: 'Food', icon: Coffee },
        { name: 'Lunch', amount: 15, category: 'Food', icon: Coffee },
        { name: 'Transport', amount: 10, category: 'Transport', icon: Car },
        { name: 'Rent', amount: 800, category: 'Bills', icon: Home },
    ];

    const categories = [
        { name: 'Food', icon: Coffee },
        { name: 'Transport', icon: Car },
        { name: 'Bills', icon: Home },
        { name: 'Entertainment', icon: Gamepad2 },
        { name: 'Shopping', icon: ShoppingCart },
        { name: 'Health', icon: Heart },
    ];

    const templates = [
        { name: 'Grab ride', category: 'Transport', amount: 12, note: 'Ride to destination' },
        { name: 'Netflix subscription', category: 'Entertainment', amount: 15, note: 'Monthly subscription' },
        { name: 'Grocery shopping', category: 'Food', amount: 50, note: 'Weekly groceries' },
        { name: 'Coffee break', category: 'Food', amount: 6, note: 'Morning coffee' },
    ];

    useEffect(() => {
        const savedWallets = localStorage.getItem('wallets');
        const savedTransactions = localStorage.getItem('transactions');

        if (savedWallets) {
            setWallets(JSON.parse(savedWallets));
        }

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    }, []);

    const handleQuickExpense = (expense: typeof quickExpenses[0]) => {
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setTransactionType('expense');
        setNote(`Quick ${expense.name.toLowerCase()}`);
    };

    const handleTemplate = (template: typeof templates[0]) => {
        setAmount(template.amount.toString());
        setCategory(template.category);
        setNote(template.note);
        setTransactionType('expense');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category || !selectedWallet) {
            toast.error('Please fill in all required fields');
            return;
        }

        const selectedWalletObj = wallets.find(w => w.id === selectedWallet);
        if (!selectedWalletObj) {
            toast.error('Please select a valid wallet');
            return;
        }

        const transactionAmount = transactionType === 'expense' ? -parseFloat(amount) : parseFloat(amount);

        // Check if wallet has sufficient balance for expenses
        if (transactionType === 'expense' && selectedWalletObj.balance < parseFloat(amount)) {
            toast.error('Insufficient balance in selected wallet');
            return;
        }

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            amount: transactionAmount,
            category,
            wallet: selectedWalletObj.name,
            type: transactionType,
            note: note || `${transactionType === 'expense' ? 'Expense' : 'Income'} - ${category}`,
            date: new Date().toISOString(),
        };

        // Update wallet balance
        const updatedWallets = wallets.map(wallet => {
            if (wallet.id === selectedWallet) {
                return { ...wallet, balance: wallet.balance + transactionAmount };
            }
            return wallet;
        });

        // Update transactions
        const updatedTransactions = [newTransaction, ...transactions];

        // Save to localStorage
        localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

        toast.success(`${transactionType === 'expense' ? 'Expense' : 'Income'} added successfully!`);

        // Reset form
        setAmount('');
        setCategory('');
        setSelectedWallet('');
        setNote('');

        // Navigate back to dashboard
        navigate('/');
    };

    return (
        <div className="md:ml-72 p-6 mt-20 md:mt-0">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Add Transaction</h1>
                        <p className="text-gray-600">Record your income or expenses quickly</p>
                    </div>
                </div>

                {/* Transaction Type Toggle */}
                <Card className="p-6">
                    <div className="flex gap-2 mb-4">
                        <Button
                            variant={transactionType === 'expense' ? 'default' : 'outline'}
                            onClick={() => setTransactionType('expense')}
                            className={transactionType === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                            Expense
                        </Button>
                        <Button
                            variant={transactionType === 'income' ? 'default' : 'outline'}
                            onClick={() => setTransactionType('income')}
                            className={transactionType === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            Income
                        </Button>
                    </div>
                </Card>

                {/* Quick Expense Buttons */}
                {transactionType === 'expense' && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Expenses</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {quickExpenses.map((expense) => {
                                const Icon = expense.icon;
                                return (
                                    <Button
                                        key={expense.name}
                                        variant="outline"
                                        className="h-20 flex-col gap-2 hover:bg-blue-50"
                                        onClick={() => handleQuickExpense(expense)}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="text-sm">{expense.name}</span>
                                        <Badge variant="secondary" className="text-xs">${expense.amount}</Badge>
                                    </Button>
                                );
                            })}
                        </div>
                    </Card>
                )}

                {/* Templates */}
                {transactionType === 'expense' && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Templates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {templates.map((template) => (
                                <Button
                                    key={template.name}
                                    variant="outline"
                                    className="justify-start p-4 h-auto hover:bg-gray-50"
                                    onClick={() => handleTemplate(template)}
                                >
                                    <div className="text-left">
                                        <div className="font-medium">{template.name}</div>
                                        <div className="text-sm text-gray-500">${template.amount} • {template.category}</div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Transaction Form */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-lg"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <Button
                                            key={cat.name}
                                            type="button"
                                            variant={category === cat.name ? 'default' : 'outline'}
                                            className="h-16 flex-col gap-1"
                                            onClick={() => setCategory(cat.name)}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span className="text-xs">{cat.name}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                            {category && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-600">Selected:</span>
                                    <Badge>{category}</Badge>
                                </div>
                            )}
                        </div>

                        {/* Wallet */}
                        <div className="space-y-2">
                            <Label htmlFor="wallet">Wallet *</Label>
                            <Select value={selectedWallet} onValueChange={setSelectedWallet} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet.id} value={wallet.id}>
                                            {wallet.name} (${wallet.balance.toLocaleString()})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Note */}
                        <div className="space-y-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Add a note about this transaction..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className={`w-full ${transactionType === 'expense'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add {transactionType === 'expense' ? 'Expense' : 'Income'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AddTransaction;