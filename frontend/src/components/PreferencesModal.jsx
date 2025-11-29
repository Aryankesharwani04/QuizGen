import { useState } from 'react';
import { updateProfile } from '../api/authService';
import { useAuth } from '../hooks/useAuth';

export default function PreferencesModal({ isOpen, onClose, initialPreferences = [] }) {
    const { refreshProfile } = useAuth();
    const [selectedPreferences, setSelectedPreferences] = useState(initialPreferences);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const preferencesList = [
        { id: 'art', name: 'Art', icon: '🎨' },
        { id: 'gaming', name: 'Gaming', icon: '🎮' },
        { id: 'facts', name: 'Facts', icon: '📚' },
        { id: 'science', name: 'Science', icon: '🔬' },
        { id: 'history', name: 'History', icon: '📜' },
        { id: 'geography', name: 'Geography', icon: '🌍' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'movies', name: 'Movies', icon: '🎬' },
    ];

    const togglePreference = (id) => {
        setSelectedPreferences(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateProfile({ preferences: { categories: selectedPreferences } });
            if (response.success) {
                await refreshProfile();
                onClose();
            } else {
                setError(response.message || 'Failed to save preferences');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-light rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        What are you interested in?
                    </h2>
                    <p className="text-primary-dark">
                        Select topics to personalize your quiz feed
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-h-60 overflow-y-auto">
                    {preferencesList.map(pref => (
                        <button
                            key={pref.id}
                            onClick={() => togglePreference(pref.id)}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${selectedPreferences.includes(pref.id)
                                    ? 'border-accent bg-accent-light text-text-primary'
                                    : 'border-gray-200 hover:border-accent-light text-primary-dark'
                                }`}
                        >
                            <span className="text-xl">{pref.icon}</span>
                            <span className="font-medium text-sm">{pref.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-primary-dark font-medium hover:bg-gray-100 rounded-lg transition"
                        disabled={loading}
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-primary text-text-on-dark font-bold rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
}
