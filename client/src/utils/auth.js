// Generate a salt and hash the password
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Verify password against stored hash
export async function verifyPassword(password, storedHash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === storedHash;
}

// Initialize development user with hashed password
export async function initDevUser() {
  const devUsers = localStorage.getItem('devUsers');
  
  if (!devUsers) {
    // Hash the development password: mapua@1925
    const hashedPassword = await hashPassword('mapua@1925');
    
    const users = [
      {
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('devUsers', JSON.stringify(users));
  }
}

// Find user by username
export function findUser(username) {
  const users = JSON.parse(localStorage.getItem('devUsers') || '[]');
  return users.find(user => user.username === username);
}

// Add new user (for future registration feature)
export async function addUser(username, password, role = 'user') {
  const users = JSON.parse(localStorage.getItem('devUsers') || '[]');
  
  // Check if user already exists
  if (users.some(user => user.username === username)) {
    throw new Error('Username already exists');
  }
  
  const hashedPassword = await hashPassword(password);
  
  const newUser = {
    username,
    passwordHash: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('devUsers', JSON.stringify(users));
  
  return { username, role };
}