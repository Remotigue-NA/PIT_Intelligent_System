/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ShoppingCart, 
  Tag, 
  Hash,
  ChevronDown,
  X,
  PlusCircle,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Category = 'Produce' | 'Dairy' | 'Meat' | 'Bakery' | 'Frozen' | 'Pantry' | 'Household' | 'Other';

interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  quantity: string;
  isCompleted: boolean;
  createdAt: number;
}

const CATEGORIES: Category[] = [
  'Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 'Pantry', 'Household', 'Other'
];

// --- Main Component ---

export default function App() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Produce' as Category,
    quantity: '1'
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('freshcart_items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('freshcart_items', JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const item: GroceryItem = {
      id: crypto.randomUUID(),
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: newItem.quantity || '1',
      isCompleted: false,
      createdAt: Date.now()
    };

    setItems([item, ...items]);
    setNewItem({ name: '', category: 'Produce', quantity: '1' });
    setIsAdding(false);
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.isCompleted));
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filter === 'active') return !item.isCompleted;
      if (filter === 'completed') return item.isCompleted;
      return true;
    });
  }, [items, filter]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, GroceryItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FreshCart</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Offline Grocery List</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* Stats & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          {items.some(i => i.isCompleted) && (
            <button 
              onClick={clearCompleted}
              className="text-sm text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              Clear Completed
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && !isAdding && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ListTodo size={40} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Your list is empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Start adding items you need to buy for your next grocery trip.
            </p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-6 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
            >
              Add First Item
            </button>
          </div>
        )}

        {/* Grocery List */}
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <section key={category} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Tag size={14} className="text-slate-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {category}
                </h2>
                <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  {catItems.length}
                </span>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {catItems.map((item, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id}
                    className={`flex items-center gap-4 p-4 group transition-colors ${
                      idx !== catItems.length - 1 ? 'border-b border-slate-100' : ''
                    } ${item.isCompleted ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={`flex-shrink-0 transition-colors ${
                        item.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      {item.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-grow min-w-0">
                      <p className={`font-medium transition-all truncate ${
                        item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Hash size={10} />
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Add Item</h2>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={addItem} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                    <input 
                      autoFocus
                      type="text"
                      placeholder="e.g. Whole Milk"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                      <input 
                        type="text"
                        placeholder="1"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        value={newItem.quantity}
                        onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          value={newItem.category}
                          onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={!newItem.name.trim()}
                      className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={20} />
                      Add to List
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="max-w-2xl mx-auto px-4 py-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-medium">
          FreshCart • All data is saved locally on your device.
        </p>
      </footer>
    </div>
  );
}

