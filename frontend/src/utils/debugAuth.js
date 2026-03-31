// Debug utility for local auth
import { localAuth } from './localAuth';

export const debugAuth = {
  // Barcha userlarni console ga chiqarish
  logAllUsers() {
    const users = localAuth.getAllUsers();
    console.log('=== ALL REGISTERED USERS ===');
    console.log(JSON.stringify(users, null, 2));
    console.log('Total users:', Object.keys(users).length);
    return users;
  },

  // Ma'lum bir userni tekshirish
  checkUser(email) {
    const normalized = email?.trim().toLowerCase();
    const users = localAuth.getAllUsers();
    const user = users[normalized];
    
    console.log(`=== USER CHECK: ${normalized} ===`);
    if (user) {
      console.log('User found:', user);
      console.log('Password:', user.password);
    } else {
      console.log('User NOT found');
    }
    return user;
  },

  // Parolni test qilish
  testPassword(email, password) {
    const normalized = email?.trim().toLowerCase();
    const users = localAuth.getAllUsers();
    const user = users[normalized];
    
    console.log(`=== PASSWORD TEST: ${normalized} ===`);
    console.log('Input password:', password);
    console.log('Stored password:', user?.password);
    console.log('Match:', user?.password === password);
    
    return user?.password === password;
  },

  // Barcha userlarni o'chirish (reset)
  clearAllUsers() {
    localStorage.removeItem('aidevix_local_users');
    console.log('All users cleared');
  }
};

// Global scope ga qo'shish (browser console dan foydalanish uchun)
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
