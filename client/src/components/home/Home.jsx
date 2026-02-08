import React from 'react';
import { ArrowRight, Star, Users, Globe, CheckCircle, Sparkles, Trophy, Zap, BookOpen } from 'lucide-react';

export function Home({ onStart }) {
    const learningPaths = [
        {
            id: 'beginner',
            title: 'Beginner',
            level: 'A1-A2',
            lessons: 24,
            duration: '3 months',
            color: 'from-green-400 to-emerald-500',
            icon: '🌱',
            description: 'Start your English journey with basics'
        },
        {
            id: 'intermediate',
            title: 'Intermediate',
            level: 'B1-B2',
            lessons: 36,
            duration: '4 months',
            color: 'from-blue-400 to-cyan-500',
            icon: '🚀',
            description: 'Build confidence in conversations'
        },
        {
            id: 'advanced',
            title: 'Advanced',
            level: 'C1-C2',
            lessons: 48,
            duration: '6 months',
            color: 'from-purple-400 to-pink-500',
            icon: '👑',
            description: 'Master fluency and nuanced expression'
        }
    ];

    const features = [
        {
            icon: Sparkles,
            title: 'Interactive Lessons',
            description: 'Engaging exercises that adapt to your level',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: Trophy,
            title: 'Gamified Learning',
            description: 'Earn badges, maintain streaks, level up',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            icon: Zap,
            title: 'Instant Feedback',
            description: 'Get immediate corrections and explanations',
            color: 'bg-orange-50 text-orange-600'
        },
        {
            icon: Globe,
            title: 'Real-World Context',
            description: 'Learn English you can actually use',
            color: 'bg-green-50 text-green-600'
        }
    ];

    const stats = [
        { value: '2M+', label: 'Active Learners' },
        { value: '150+', label: 'Countries' },
        { value: '4.8/5', label: 'Average Rating' },
        { value: '95%', label: 'Success Rate' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">Trusted by 2M+ learners worldwide</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Master English
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Your Way
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                Learn English naturally with personalized lessons, interactive exercises, and real-world practice.
                                From beginner to advanced, we've got you covered.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onStart}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Start Learning Free
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <div
                                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-not-allowed opacity-75"
                                >
                                    View Demo
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMG9ubGluZSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzA1NDk5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Students learning English online"
                                    className="w-full h-[400px] md:h-[500px] object-cover"
                                />
                            </div>
                            {/* Floating cards */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-bounce">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Great job!</div>
                                        <div className="text-xs text-gray-600">Lesson completed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Visual Vocab?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to achieve fluency in English, backed by science and loved by learners
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all"
                                >
                                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Learning Paths Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Choose Your Learning Path
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Structured courses designed for every level, from complete beginner to advanced speaker
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {learningPaths.map((path) => (
                            <div
                                key={path.id}
                                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all group"
                            >
                                <div className={`h-32 bg-gradient-to-br ${path.color} flex items-center justify-center`}>
                                    <span className="text-6xl">{path.icon}</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900">{path.title}</h3>
                                            <span className="text-sm font-semibold text-gray-500">{path.level}</span>
                                        </div>
                                        <p className="text-gray-600">{path.description}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{path.lessons} lessons</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{path.duration}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onStart}
                                        className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600"
                                    >
                                        Start Now
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join millions of learners achieving their English goals every day
                    </p>
                    <button
                        onClick={onStart}
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>
        </div>
    );
}
