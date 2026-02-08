import React, { useState } from 'react';
import { BookOpen, BarChart3, Cloud, Menu, X, Flame, Award, Gamepad, Box, Home } from 'lucide-react';

export function Navigation({ activeTab, onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Map tabs to icons and labels
    const navItems = [
        { id: 'home', label: 'Trang chủ', icon: Home },
        { id: 'learn', label: 'Học từ', icon: BookOpen },
        { id: 'review', label: 'Kho từ vựng', icon: Box }, // BoxArchive equivalent
        { id: 'games', label: 'Trò chơi', icon: Gamepad },
        { id: 'stats', label: 'Kết quả', icon: BarChart3 },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 group cursor-pointer"
                        onClick={() => onNavigate('home')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Visual Vocab
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* User Stats & Profile (Mock Data for Visual) */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-semibold text-orange-700">7 ngày</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                            <Award className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-semibold text-purple-700">Học viên</span>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                            <div className="pt-4 mt-2 border-t flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <span className="font-semibold text-orange-700">7 ngày streak</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                                    <Award className="w-5 h-5 text-purple-500" />
                                    <span className="font-semibold text-purple-700">Học viên Level 1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
