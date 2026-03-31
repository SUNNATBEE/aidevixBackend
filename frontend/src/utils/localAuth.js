// Local authentication system - frontend only
const LOCAL_USERS_KEY = 'aidevix_local_users';

const normalizeEmail = (email) => email?.trim().toLowerCase() || '';

export const localAuth = {
  // Register yangi user
  registerUser(email, password) {
    const normalized = normalizeEmail(email);
    const users = this.getAllUsers();
    
    if (users[normalized]) {
      throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
    }
    
    users[normalized] = {
      email: normalized,
      password: password, // Real projectda hash qilish kerak
      createdAt: Date.now(),
    };
    
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return true;
  },

  // Login - email va parolni tekshirish
  loginUser(email, password) {
    const normalized = normalizeEmail(email);
    const users = this.getAllUsers();
    const user = users[normalized];
    
    if (!user) {
      throw new Error('Bu email ro\'yxatdan o\'tmagan');
    }
    
    if (user.password !== password) {
      throw new Error('Parol noto\'g\'ri');
    }
    
    return { email: user.email };
  },

  // Parolni yangilash
  updatePassword(email, newPassword) {
    const normalized = normalizeEmail(email);
    const users = this.getAllUsers();
    
    if (!users[normalized]) {
      throw new Error('Bu email ro\'yxatdan o\'tmagan');
    }
    
    users[normalized].password = newPassword;
    users[normalized].updatedAt = Date.now();
    
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return true;
  },

  // User mavjudligini tekshirish
  userExists(email) {
    const normalized = normalizeEmail(email);
    const users = this.getAllUsers();
    return !!users[normalized];
  },

  // Barcha userlarni olish (internal)
  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || {};
    } catch {
      return {};
    }
  },
};
