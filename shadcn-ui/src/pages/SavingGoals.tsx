import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Target, Plus, TrendingUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SavingGoal {
    id: string;
    name: string;
    target: number;
    saved: number;
}

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

const SavingGoals = () => {
    const navigate = useNavigate();
    const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);

    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const [contributeAmount, setContributeAmount] = useState('');
    const [contributeWallet, setContributeWallet] = useState('');

    useEffect(() => {
        const savedGoals = localStorage.getItem('savingGoals');
        const savedWallets = localStorage.getItem('wallets');
        const savedTransactions = localStorage.getItem('transactions');

        if (savedGoals) {
            setSavingGoals(JSON.parse(savedGoals));
        }

        if (savedWallets) {
            setWallets(JSON.parse(savedWallets));
        }

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    }, []);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newGoalName || !newGoalTarget) {
            toast.error('Please fill in all fields');
            return;
        }

        const newGoal: SavingGoal = {
            id: Date.now().toString(),
            name: newGoalName,
            target: parseFloat(newGoalTarget),
            saved: 0,
        };

        const updatedGoals = [...savingGoals, newGoal];
        setSavingGoals(updatedGoals);
        localStorage.setItem('savingGoals', JSON.stringify(updatedGoals));

        toast.success('Saving goal added successfully!');

        setNewGoalName('');
        setNewGoalTarget('');
        setIsAddDialogOpen(false);
    };

    const handleContribute = (e: React.FormEvent) => {
        e.preventDefault();

        if (!contributeAmount || !contributeWallet || !selectedGoal) {
            toast.error('Please fill in all fields');
            return;
        }

        const walletObj = wallets.find(w => w.id === contributeWallet);
        if (!walletObj) {
            toast.error('Please select a valid wallet');
            return;
        }

        const amount = parseFloat(contributeAmount);

        if (walletObj.balance < amount) {
            toast.error('Insufficient balance in selected wallet');
            return;
        }

        // Update saving goal
        const updatedGoals = savingGoals.map(goal => {
            if (goal.id === selectedGoal.id) {
                return { ...goal, saved: Math.min(goal.saved + amount, goal.target) };
            }
            return goal;
        });

        // Update wallet balance
        const updatedWallets = wallets.map(wallet => {
            if (wallet.id === contributeWallet) {
                return { ...wallet, balance: wallet.balance - amount };
            }
            return wallet;
        });

        // Add transaction record
        const newTransaction: Transaction = {
            id: Date.now().toString(),
            amount: -amount,
            category: 'Savings',
            wallet: walletObj.name,
            type: 'expense',
            note: `Contribution to ${selectedGoal.name}`,
            date: new Date().toISOString(),
        };

        const updatedTransactions = [newTransaction, ...transactions];

        // Save to localStorage
        setSavingGoals(updatedGoals);
        setWallets(updatedWallets);
        setTransactions(updatedTransactions);
        localStorage.setItem('savingGoals', JSON.stringify(updatedGoals));
        localStorage.setItem('wallets', JSON.stringify(updatedWallets));
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

        toast.success(`Contributed $${amount} to ${selectedGoal.name}!`);

        setContributeAmount('');
        setContributeWallet('');
        setSelectedGoal(null);
        setIsContributeDialogOpen(false);
    };

    const handleDeleteGoal = (goalId: string) => {
        const updatedGoals = savingGoals.filter(goal => goal.id !== goalId);
        setSavingGoals(updatedGoals);
        localStorage.setItem('savingGoals', JSON.stringify(updatedGoals));
        toast.success('Saving goal deleted');
    };

    const openContributeDialog = (goal: SavingGoal) => {
        setSelectedGoal(goal);
        setIsContributeDialogOpen(true);
    };

    return (
        <div className="md:ml-72 p-6 mt-20 md:mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Saving Goals</h1>
                            <p className="text-gray-600">Track your progress towards financial goals</p>
                        </div>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Saving Goal</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddGoal} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="goalName">Goal Name *</Label>
                                    <Input
                                        id="goalName"
                                        placeholder="e.g., Buy Laptop, Travel Fund"
                                        value={newGoalName}
                                        onChange={(e) => setNewGoalName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goalTarget">Target Amount *</Label>
                                    <Input
                                        id="goalTarget"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={newGoalTarget}
                                        onChange={(e) => setNewGoalTarget(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                    Create Goal
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Goals Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Total Goals</p>
                                <p className="text-3xl font-bold text-green-800">{savingGoals.length}</p>
                            </div>
                            <div className="p-3 bg-green-200 rounded-full">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Saved</p>
                                <p className="text-3xl font-bold text-blue-800">
                                    ${savingGoals.reduce((sum, goal) => sum + goal.saved, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-200 rounded-full">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Total Target</p>
                                <p className="text-3xl font-bold text-purple-800">
                                    ${savingGoals.reduce((sum, goal) => sum + goal.target, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-200 rounded-full">
                                <Target className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Saving Goals List */}
                <div className="space-y-4">
                    {savingGoals.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No saving goals yet</h3>
                            <p className="text-gray-500 mb-4">Start by creating your first saving goal</p>
                            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Goal
                            </Button>
                        </Card>
                    ) : (
                        savingGoals.map((goal) => {
                            const progress = (goal.saved / goal.target) * 100;
                            const isCompleted = goal.saved >= goal.target;

                            return (
                                <Card key={goal.id} className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{goal.name}</h3>
                                            <p className="text-gray-600">
                                                ${goal.saved.toLocaleString()} of ${goal.target.toLocaleString()} saved
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!isCompleted && (
                                                <Button
                                                    onClick={() => openContributeDialog(goal)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Contribute
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                                {progress.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.min(progress, 100)}
                                            className={`h-3 ${isCompleted ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'}`}
                                        />
                                        {isCompleted && (
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2">
                                                <Target className="h-4 w-4" />
                                                Goal Completed! 🎉
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Contribute Dialog */}
                <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Contribute to {selectedGoal?.name}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedGoal && (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-between text-sm text-blue-700">
                                        <span>Current Progress</span>
                                        <span>
                                            ${selectedGoal.saved.toLocaleString()} / ${selectedGoal.target.toLocaleString()}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(selectedGoal.saved / selectedGoal.target) * 100}
                                        className="mt-2 h-2"
                                    />
                                    <p className="text-xs text-blue-600 mt-1">
                                        ${(selectedGoal.target - selectedGoal.saved).toLocaleString()} remaining
                                    </p>
                                </div>

                                <form onSubmit={handleContribute} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contributeAmount">Amount *</Label>
                                        <Input
                                            id="contributeAmount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={contributeAmount}
                                            onChange={(e) => setContributeAmount(e.target.value)}
                                            max={selectedGoal.target - selectedGoal.saved}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contributeWallet">From Wallet *</Label>
                                        <Select value={contributeWallet} onValueChange={setContributeWallet} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select wallet" />
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

                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Contribute ${contributeAmount || '0'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default SavingGoals;