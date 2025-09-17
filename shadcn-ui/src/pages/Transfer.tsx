import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

const Transfer = () => {
    const navigate = useNavigate();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [sourceWallet, setSourceWallet] = useState('');
    const [targetWallet, setTargetWallet] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !sourceWallet || !targetWallet) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (sourceWallet === targetWallet) {
            toast.error('Source and target wallets cannot be the same');
            return;
        }

        const sourceWalletObj = wallets.find(w => w.id === sourceWallet);
        const targetWalletObj = wallets.find(w => w.id === targetWallet);

        if (!sourceWalletObj || !targetWalletObj) {
            toast.error('Please select valid wallets');
            return;
        }

        const transferAmount = parseFloat(amount);

        if (sourceWalletObj.balance < transferAmount) {
            toast.error('Insufficient balance in source wallet');
            return;
        }

        // Create transfer transactions
        const transferOutTransaction: Transaction = {
            id: Date.now().toString(),
            amount: -transferAmount,
            category: 'Transfer',
            wallet: sourceWalletObj.name,
            type: 'transfer',
            note: note || `Transfer to ${targetWalletObj.name}`,
            date: new Date().toISOString(),
        };

        const transferInTransaction: Transaction = {
            id: (Date.now() + 1).toString(),
            amount: transferAmount,
            category: 'Transfer',
            wallet: targetWalletObj.name,
            type: 'transfer',
            note: note || `Transfer from ${sourceWalletObj.name}`,
            date: new Date().toISOString(),
        };

        // Update wallet balances
        const updatedWallets = wallets.map(wallet => {
            if (wallet.id === sourceWallet) {
                return { ...wallet, balance: wallet.balance - transferAmount };
            }
            if (wallet.id === targetWallet) {
                return { ...wallet, balance: wallet.balance + transferAmount };
            }
            return wallet;
        });

        // Update transactions
        const updatedTransactions = [transferInTransaction, transferOutTransaction, ...transactions];

        // Save to localStorage
        localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

        toast.success('Transfer completed successfully!');

        // Reset form
        setAmount('');
        setSourceWallet('');
        setTargetWallet('');
        setNote('');

        // Navigate back to dashboard
        navigate('/');
    };

    const sourceWalletObj = wallets.find(w => w.id === sourceWallet);
    const targetWalletObj = wallets.find(w => w.id === targetWallet);

    return (
        <div className="md:ml-72 p-6 mt-20 md:mt-0">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Transfer Money</h1>
                        <p className="text-gray-600">Move money between your wallets</p>
                    </div>
                </div>

                {/* Transfer Form */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Source Wallet */}
                        <div className="space-y-2">
                            <Label htmlFor="source">From Wallet *</Label>
                            <Select value={sourceWallet} onValueChange={setSourceWallet} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet.id} value={wallet.id}>
                                            {wallet.name} (${wallet.balance.toLocaleString()})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {sourceWalletObj && (
                                <p className="text-sm text-gray-600">
                                    Available balance: ${sourceWalletObj.balance.toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Transfer Arrow */}
                        <div className="flex justify-center">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <ArrowRight className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>

                        {/* Target Wallet */}
                        <div className="space-y-2">
                            <Label htmlFor="target">To Wallet *</Label>
                            <Select value={targetWallet} onValueChange={setTargetWallet} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets
                                        .filter(wallet => wallet.id !== sourceWallet)
                                        .map((wallet) => (
                                            <SelectItem key={wallet.id} value={wallet.id}>
                                                {wallet.name} (${wallet.balance.toLocaleString()})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {targetWalletObj && (
                                <p className="text-sm text-gray-600">
                                    Current balance: ${targetWalletObj.balance.toLocaleString()}
                                </p>
                            )}
                        </div>

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
                                max={sourceWalletObj?.balance || undefined}
                            />
                            {sourceWalletObj && amount && parseFloat(amount) > sourceWalletObj.balance && (
                                <p className="text-sm text-red-600">
                                    Amount exceeds available balance
                                </p>
                            )}
                        </div>

                        {/* Note */}
                        <div className="space-y-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Add a note about this transfer..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Transfer Summary */}
                        {sourceWalletObj && targetWalletObj && amount && (
                            <Card className="p-4 bg-blue-50">
                                <h3 className="font-semibold text-blue-800 mb-2">Transfer Summary</h3>
                                <div className="space-y-1 text-sm text-blue-700">
                                    <p>From: {sourceWalletObj.name} → {targetWalletObj.name}</p>
                                    <p>Amount: ${parseFloat(amount).toLocaleString()}</p>
                                    <p>
                                        {sourceWalletObj.name} balance after: $
                                        {(sourceWalletObj.balance - parseFloat(amount)).toLocaleString()}
                                    </p>
                                    <p>
                                        {targetWalletObj.name} balance after: $
                                        {(targetWalletObj.balance + parseFloat(amount)).toLocaleString()}
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!sourceWallet || !targetWallet || !amount || parseFloat(amount) > (sourceWalletObj?.balance || 0)}
                        >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Complete Transfer
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Transfer;