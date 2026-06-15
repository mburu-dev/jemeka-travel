import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller, createAuthenticatedTestCaller } from './test-utils';
import { testimonials, users } from '@jemeka/db';
import { eq } from 'drizzle-orm';

describe('Testimonial Router', () => {
  let db: any;
  let caller: any;
  let adminCaller: any;

  beforeAll(async () => {
    const testDb = await setupTestDb();

    db = testDb.db;
    
    const [testAdmin] = await db.insert(users).values({
      name: "Admin",
      email: "admin-test@example.com",
      role: "admin",
    }).returning();

    caller = await createTestCaller(db);
    adminCaller = await createAuthenticatedTestCaller(testAdmin, db);
  });

  it('should create a testimonial', async () => {
    await caller.testimonial.create({
      name: "John Test",
      email: "john@example.com",
      rating: 5,
      comment: "This was a great trip! Highly recommended.",
    });

    const saved = await db.query.testimonials.findFirst({
      where: eq(testimonials.email, "john@example.com")
    });
    expect(saved).toBeDefined();
    expect(saved.isVerified).toBe(false);
  });

  it('should list only verified and active testimonials to public', async () => {
    // Manually insert one verified and one unverified
    await db.insert(testimonials).values([
      {
        name: "Verified User",
        email: "v@example.com",
        rating: 4,
        comment: "Great experience.",
        isVerified: true,
        isActive: true,
      },
      {
        name: "Unverified User",
        email: "u@example.com",
        rating: 3,
        comment: "Good experience.",
        isVerified: false,
        isActive: true,
      }
    ]);

    const result = await caller.testimonial.list({ verified: true });
    expect(result.items.some((t: any) => t.email === "v@example.com")).toBe(true);
    expect(result.items.some((t: any) => t.email === "u@example.com")).toBe(false);
  });

  it('should list all testimonials for admin', async () => {
    const result = await adminCaller.testimonial.all();
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('should update testimonial status', async () => {
    const saved = await db.query.testimonials.findFirst({
      where: eq(testimonials.email, "john@example.com")
    });

    await adminCaller.testimonial.updateStatus({
      id: saved.id,
      isVerified: true,
    });

    const updated = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, saved.id)
    });
    expect(updated.isVerified).toBe(true);
  });

  it('should delete testimonial', async () => {
    const saved = await db.query.testimonials.findFirst({
      where: eq(testimonials.email, "john@example.com")
    });

    await adminCaller.testimonial.delete({ id: saved.id });

    const deleted = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, saved.id)
    });
    expect(deleted).toBeUndefined();
  });
});
