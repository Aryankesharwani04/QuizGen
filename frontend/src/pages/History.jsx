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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-dark">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Quiz History</h1>

      {error && (
        <div className="mb-6 p-4 bg-ocean-green border border-accent rounded-lg">
          <p className="text-sm text-bg-dark">{error}</p>
        </div>
      )}

      {/* Statistics Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-bg-light rounded-lg shadow p-6">
            <p className="text-sm text-primary-dark mb-2">Total Quizzes</p>
            <p className="text-3xl font-bold text-primary">{stats.total_attempts || 0}</p>
          </div>
          <div className="bg-bg-light rounded-lg shadow p-6">
            <p className="text-sm text-primary-dark mb-2">Average Score</p>
            <p className="text-3xl font-bold text-accent">
              {stats.average_score ? stats.average_score.toFixed(1) : 'N/A'}%
            </p>
          </div>
          <div className="bg-bg-light rounded-lg shadow p-6">
            <p className="text-sm text-primary-dark mb-2">Best Score</p>
            <p className="text-3xl font-bold text-accent-dark">{stats.best_score || 0}%</p>
          </div>
          <div className="bg-bg-light rounded-lg shadow p-6">
            <p className="text-sm text-primary-dark mb-2">Total Time</p>
            <p className="text-3xl font-bold text-ocean-green">
              {stats.total_time_minutes || 0}m
            </p>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="bg-bg-light rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent-light border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Quiz</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Category</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Score</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((attempt, index) => (
                <tr key={index} className="hover:bg-accent-light transition">
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {attempt.quiz_name || 'Unnamed Quiz'}
                  </td>
                  <td className="px-6 py-4 text-primary-dark">
                    {attempt.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-text-primary font-semibold">
                      {attempt.score || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-primary-dark">
                    {attempt.time_taken ? `${attempt.time_taken}m` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-primary-dark text-sm">
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
          <p className="text-primary-dark text-lg mb-4">No quiz attempts yet</p>
          <p className="text-primary-dark text-sm">Start your first quiz to build your history!</p>
        </div>
      )}
    </div>
  );
}
