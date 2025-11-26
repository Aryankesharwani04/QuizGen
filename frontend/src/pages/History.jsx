import { useState, useEffect } from 'react';
import { getHistory } from '../api/authService';

export default function History() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getHistory();

        if (response.success) {
          setHistory(response.data.scores || []);
          setStats(response.data.stats || null);
        } else {
          setError(response.message || 'Failed to load history');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Quiz History</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Statistics Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Quizzes</p>
            <p className="text-3xl font-bold text-primary-600">{stats.total_attempts || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Average Score</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.average_score ? stats.average_score.toFixed(1) : 'N/A'}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Best Score</p>
            <p className="text-3xl font-bold text-green-600">{stats.best_score || 0}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Time</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.total_time_minutes || 0}m
            </p>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quiz</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((attempt, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {attempt.quiz_name || 'Unnamed Quiz'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {attempt.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-semibold">
                      {attempt.score || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {attempt.time_taken ? `${attempt.time_taken}m` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {attempt.attempted_at
                      ? new Date(attempt.attempted_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No quiz attempts yet</p>
          <p className="text-gray-400 text-sm">Start your first quiz to build your history!</p>
        </div>
      )}
    </div>
  );
}
