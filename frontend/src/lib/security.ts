import bcrypt from 'bcryptjs';

// Constants for security settings
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = 3600; // 1 hour in seconds

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error); // Debug log
    throw new SecurityError('Error hashing password');
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error); // Debug log
    throw new SecurityError('Error verifying password');
  }
}

// Rate limiting implementation
const attempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userAttempts = attempts.get(identifier);

  if (!userAttempts) {
    attempts.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (now - userAttempts.timestamp > LOCKOUT_DURATION) {
    attempts.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (userAttempts.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((LOCKOUT_DURATION - (now - userAttempts.timestamp)) / 1000);
    throw new SecurityError(`Too many attempts. Please try again in ${timeLeft} seconds`);
  }

  attempts.set(identifier, {
    count: userAttempts.count + 1,
    timestamp: userAttempts.timestamp,
  });
  return true;
}

export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

export function clearRateLimit(identifier: string): void {
  attempts.delete(identifier);
}
