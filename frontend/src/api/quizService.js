// Mock quiz data
const MOCK_QUIZZES = [
  {
    id: '10001',
    title: 'Famous Artists of the Renaissance',
    description: 'Test your knowledge about Renaissance art and artists',
    category: 'Art',
    preference: 'art',
    difficulty: 'medium',
    questions_count: 10,
    estimated_time: 5,
    image: null,
  },
  {
    id: '10002',
    title: 'Video Game Trivia',
    description: 'Can you name these popular video games?',
    category: 'Gaming',
    preference: 'gaming',
    difficulty: 'easy',
    questions_count: 8,
    estimated_time: 4,
    image: null,
  },
  {
    id: '10003',
    title: 'Random Facts Challenge',
    description: 'Think you know random facts? Prove it!',
    category: 'Facts',
    preference: 'facts',
    difficulty: 'hard',
    questions_count: 15,
    estimated_time: 10,
    image: null,
  },
  {
    id: '10004',
    title: 'Biology Basics',
    description: 'Test your knowledge of fundamental biology',
    category: 'Science',
    preference: 'science',
    difficulty: 'medium',
    questions_count: 12,
    estimated_time: 8,
    image: null,
  },
  {
    id: '10005',
    title: 'World History Quiz',
    description: 'Major events and dates in world history',
    category: 'History',
    preference: 'history',
    difficulty: 'hard',
    questions_count: 20,
    estimated_time: 12,
    image: null,
  },
];

export const fetchQuizzes = async (params = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...MOCK_QUIZZES];

  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter(quiz => 
      quiz.title.toLowerCase().includes(term) ||
      quiz.description.toLowerCase().includes(term)
    );
  }

  if (params.category) {
    filtered = filtered.filter(quiz => quiz.category === params.category);
  }
  
  if (params.preferences && params.preferences.length > 0) {
      filtered = filtered.filter(quiz => params.preferences.includes(quiz.preference));
  }

  return {
    success: true,
    data: filtered,
  };
};

export const fetchFeaturedQuizzes = async (preferences = []) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...MOCK_QUIZZES];
    
    if (preferences.length > 0) {
        filtered = filtered.filter(quiz => preferences.includes(quiz.preference));
    }
    
    return {
        success: true,
        data: filtered
    };
};

export const verifyQuizCode = async (code) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const quiz = MOCK_QUIZZES.find(q => q.id === code);
    
    if (quiz) {
        return { success: true, data: quiz };
    } else {
        return { success: false, message: 'Invalid quiz code' };
    }
};

export const startQuiz = async (quizId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const quiz = MOCK_QUIZZES.find(q => q.id === quizId);
    
    if (quiz) {
        return { success: true, data: { sessionId: 'session_' + Date.now(), quiz } };
    } else {
        return { success: false, message: 'Quiz not found' };
    }
};
