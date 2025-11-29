export default function AboutSection() {
    return (
        <section className="bg-bg-light py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left - Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-4">
                            About QuizGen
                        </h2>
                        <p className="text-primary-dark mb-4 text-lg">
                            QuizGen is your ultimate platform for creating, sharing, and taking interactive quizzes on any topic you're passionate about.
                        </p>
                        <ul className="space-y-3 text-primary-dark">
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">✨</span>
                                <span>Create custom quizzes in minutes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">📊</span>
                                <span>Track your progress and scores</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <span>Learn from various categories</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-2xl">🌟</span>
                                <span>Share with friends and compete</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right - Features */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary text-text-on-dark p-6 rounded-lg text-center">
                            <div className="text-4xl mb-2">🎓</div>
                            <h3 className="font-bold mb-2">Learn</h3>
                            <p className="text-sm">Expand your knowledge</p>
                        </div>
                        <div className="bg-accent text-text-primary p-6 rounded-lg text-center">
                            <div className="text-4xl mb-2">🏆</div>
                            <h3 className="font-bold mb-2">Compete</h3>
                            <p className="text-sm">Challenge yourself</p>
                        </div>
                        <div className="bg-ocean-green text-bg-dark p-6 rounded-lg text-center">
                            <div className="text-4xl mb-2">👥</div>
                            <h3 className="font-bold mb-2">Share</h3>
                            <p className="text-sm">Share with friends</p>
                        </div>
                        <div className="bg-accent-light text-text-primary p-6 rounded-lg text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <h3 className="font-bold mb-2">Track</h3>
                            <p className="text-sm">Monitor progress</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
