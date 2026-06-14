import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createAuthenticatedTestCaller, createTestCaller } from './test-utils';
import { users } from '@jemeka/db';

describe('Auth Router', () => {
  let db: any;
  let testUser: any;
  let authenticatedCaller: any;
  let unauthenticatedCaller: any;

  beforeAll(async () => {
    db = await setupTestDb();
    
    [testUser] = await db.insert(users).values({
      name: "Auth Test User",
      email: "authtest@example.com",
      role: "user",
    }).returning();

    authenticatedCaller = await createAuthenticatedTestCaller(testUser);
    unauthenticatedCaller = await createTestCaller();
  });

  it('should allow public ping', async () => {
    const result = await unauthenticatedCaller.auth.ping();
    expect(result).toEqual({ ok: true });
  });

  it('should deny unauthenticated getSession', async () => {
    await expect(unauthenticatedCaller.auth.getSession()).rejects.toThrow(/UNAUTHORIZED/);
  });

  it('should return user for authenticated getSession', async () => {
    const result = await authenticatedCaller.auth.getSession();
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(testUser.id);
    expect(result.user.email).toBe("authtest@example.com");
  });
});
