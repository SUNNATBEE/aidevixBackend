/** Realistic mock data for API interception */

export const MOCK_COURSES = {
  success: true,
  data: {
    courses: [
      {
        _id: 'course-1',
        title: 'React Asoslari',
        description: 'React frameworkini noldan o\'rganing',
        category: 'react',
        level: 'beginner',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        rating: 4.5,
        ratingCount: 120,
        viewCount: 5400,
        videoCount: 24,
        duration: '12 soat',
        instructor: 'Aidevix Team',
        createdAt: '2024-06-01T00:00:00Z',
      },
      {
        _id: 'course-2',
        title: 'JavaScript Pro',
        description: 'JavaScript tilini chuqur o\'rganing',
        category: 'javascript',
        level: 'intermediate',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
        rating: 4.8,
        ratingCount: 200,
        viewCount: 8200,
        videoCount: 36,
        duration: '20 soat',
        instructor: 'Aidevix Team',
        createdAt: '2024-05-15T00:00:00Z',
      },
      {
        _id: 'course-3',
        title: 'Node.js Backend',
        description: 'Backend dasturlashni Node.js bilan o\'rganing',
        category: 'nodejs',
        level: 'intermediate',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample3.jpg',
        rating: 4.6,
        ratingCount: 90,
        viewCount: 3500,
        videoCount: 18,
        duration: '15 soat',
        instructor: 'Aidevix Team',
        createdAt: '2024-07-01T00:00:00Z',
      },
    ],
    total: 3,
    page: 1,
    pages: 1,
  },
};

export const MOCK_TOP_COURSES = {
  success: true,
  data: {
    courses: MOCK_COURSES.data.courses.slice(0, 2),
  },
};

export const MOCK_VIDEOS = {
  success: true,
  data: {
    videos: [
      {
        _id: 'video-1',
        title: 'React Hooks — useState va useEffect',
        description: 'React Hooks haqida to\'liq tushuntirish',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/video1.jpg',
        duration: 1800,
        viewCount: 1200,
        rating: 4.7,
        ratingCount: 45,
        course: { _id: 'course-1', title: 'React Asoslari' },
        createdAt: '2024-06-15T00:00:00Z',
      },
      {
        _id: 'video-2',
        title: 'JavaScript Closures tushuncha',
        description: 'Closures va scope chain haqida',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/video2.jpg',
        duration: 2400,
        viewCount: 890,
        rating: 4.9,
        ratingCount: 60,
        course: { _id: 'course-2', title: 'JavaScript Pro' },
        createdAt: '2024-06-20T00:00:00Z',
      },
    ],
    total: 2,
    page: 1,
    pages: 1,
  },
};

export const MOCK_TOP_VIDEOS = {
  success: true,
  data: {
    videos: MOCK_VIDEOS.data.videos,
  },
};

export const MOCK_USER = {
  _id: 'user-test-123',
  username: 'testuser',
  email: 'test@aidevix.uz',
  role: 'user',
  avatar: '',
  subscriptions: {
    telegram: { username: 'testuser_tg', verified: true },
    instagram: { username: 'testuser_ig', verified: true },
  },
  xp: 1250,
  streak: 7,
  rankTitle: 'INTERMEDIATE',
  referralCode: 'TEST123',
  referralsCount: 3,
  createdAt: '2024-01-15T00:00:00Z',
};

export const MOCK_USER_STATS = {
  success: true,
  data: {
    xp: 1250,
    level: 5,
    badges: ['first_video', 'streak_7', 'quiz_master'],
    videosWatched: 42,
    bio: 'Dasturlashni sevaman',
    skills: ['React', 'JavaScript', 'Node.js'],
    avatar: '',
    rankTitle: 'INTERMEDIATE',
    streak: 7,
  },
};

export const MOCK_SUBSCRIPTION_STATUS = {
  success: true,
  data: {
    telegram: { verified: true, username: 'testuser_tg' },
    instagram: { verified: true, username: 'testuser_ig' },
    allVerified: true,
  },
};

export const MOCK_SUBSCRIPTION_UNVERIFIED = {
  success: true,
  data: {
    telegram: { verified: false, username: '' },
    instagram: { verified: false, username: '' },
    allVerified: false,
  },
};

export const MOCK_LEADERBOARD = {
  success: true,
  data: {
    rankings: [
      { _id: 'u1', username: 'champion', xp: 5000, rankTitle: 'LEGEND', avatar: '' },
      { _id: 'u2', username: 'pro_coder', xp: 3800, rankTitle: 'EXPERT', avatar: '' },
      { _id: 'u3', username: 'testuser', xp: 1250, rankTitle: 'INTERMEDIATE', avatar: '' },
      { _id: 'u4', username: 'beginner1', xp: 200, rankTitle: 'AMATEUR', avatar: '' },
    ],
    total: 4,
  },
};

export const MOCK_CATEGORIES = {
  success: true,
  data: {
    categories: ['all', 'react', 'javascript', 'nodejs', 'html', 'css', 'typescript', 'ai'],
  },
};

export const MOCK_AUTH_LOGIN_SUCCESS = {
  success: true,
  message: 'Muvaffaqiyatli kirdingiz!',
  data: {
    user: MOCK_USER,
    accessToken: 'mock-access-token-xyz',
  },
};

export const MOCK_AUTH_LOGIN_FAIL = {
  success: false,
  message: 'Email yoki parol noto\'g\'ri',
};

export const MOCK_AUTH_REGISTER_SUCCESS = {
  success: true,
  message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!',
  data: {
    user: MOCK_USER,
    accessToken: 'mock-access-token-abc',
  },
};
