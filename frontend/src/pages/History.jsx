import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizHistory, deleteQuizHistory } from '../api/quizService';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchQuizHistory();
      if (response.success) {
        setHistory(response.data || []);
      } else {
        setError(response.message || 'Failed to load history');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (attempt) => {
    navigate('/quiz/result', {
      state: {
        score: attempt.score,
        total: attempt.total_questions,
        answers: attempt.user_answers,
        questions: attempt.questions,
        quizTitle: attempt.quiz_title
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(history.map(h => h.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDelete = async (deleteAll = false) => {
    if (!deleteAll && selectedItems.size === 0) return;

    const message = deleteAll
      ? "Are you sure you want to delete ALL quiz history? This cannot be undone."
      : `Are you sure you want to delete ${selectedItems.size} selected item(s)?`;

    if (!window.confirm(message)) return;

    try {
      const response = await deleteQuizHistory(
        deleteAll ? [] : Array.from(selectedItems),
        deleteAll
      );

      if (response.success) {
        setSelectedItems(new Set());
        loadHistory(); // Reload to reflect changes
      } else {
        alert(response.message || "Failed to delete history");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("An error occurred while deleting");
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-primary">Quiz History</h1>
        <div className="space-x-4">
          {selectedItems.size > 0 && (
            <button
              onClick={() => handleDelete(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete Selected ({selectedItems.size})
            </button>
          )}
          {history.length > 0 && (
            <button
              onClick={() => handleDelete(true)}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
            >
              Clear All History
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-ocean-green border border-accent rounded-lg">
          <p className="text-sm text-bg-dark">{error}</p>
        </div>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="bg-bg-light rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent-light border-b">
              <tr>
                <th className="px-6 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={history.length > 0 && selectedItems.size === history.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Score</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-text-primary">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((attempt, index) => (
                <tr key={index} className="hover:bg-accent-light transition">
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(attempt.id)}
                      onChange={() => handleSelectItem(attempt.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {attempt.quiz_title || 'Unnamed Quiz'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-accent text-text-primary font-semibold text-sm">
                      {attempt.score} / {attempt.total_questions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-primary-dark text-sm">
                    {attempt.completed_at
                      ? new Date(attempt.completed_at).toLocaleDateString()
                      : 'Incomplete'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleReview(attempt)}
                      className="text-primary hover:text-primary-dark font-semibold underline"
                    >
                      Review
                    </button>
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
