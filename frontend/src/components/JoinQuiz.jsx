import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyQuizCode, startQuiz } from '../api/quizService';
import { useAuth } from '../hooks/useAuth';

export default function JoinQuiz() {
    const [quizCode, setQuizCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleJoinQuiz = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!quizCode.trim()) return;

        setJoinError('');
        try {
            const response = await verifyQuizCode(quizCode);
            if (response.success) {
                const startResponse = await startQuiz(response.data.id);
                if (startResponse.success) {
                    console.log('Starting quiz:', startResponse.data);
                    // Navigate to quiz player or similar (mock for now)
                    alert(`Starting quiz: ${response.data.title}`);
                }
            } else {
                setJoinError(response.message);
            }
        } catch (error) {
            setJoinError('Failed to join quiz');
        }
    };

    return (
        <div className="bg-bg-light p-8 rounded-xl shadow-2xl w-full max-w-md text-text-primary">
            <h2 className="text-2xl font-bold mb-2 text-center">Join Game?</h2>
            <p className="text-primary-dark text-center mb-6 text-sm">
                Enter the 5-digit PIN to join instantly.
            </p>

            <div className="flex flex-col gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="123 456"
                        value={quizCode}
                        onChange={(e) => setQuizCode(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-full text-center text-lg tracking-widest focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent uppercase font-bold text-gray-500 placeholder-gray-300"
                        maxLength={7} // Allowing for space if needed, though logic might need adjustment
                    />
                </div>

                {joinError && (
                    <p className="text-red-500 text-sm text-center">{joinError}</p>
                )}
                <button
                    onClick={handleJoinQuiz}
                    className="w-full px-6 py-3 bg-primary text-text-on-dark rounded-full hover:bg-primary-dark transition font-bold text-lg shadow-md"
                >
                    Enter
                </button>
            </div>
        </div>
    );
}
