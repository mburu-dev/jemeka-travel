import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller, createAuthenticatedTestCaller } from './test-utils';
import { enquiries, users } from '@jemeka/db';
import { eq } from 'drizzle-orm';

describe('Enquiry Router', () => {
  let db: any;
  let caller: any;
  let adminCaller: any;

  beforeAll(async () => {
    const testDb = await setupTestDb();

    db = testDb.db;
    
    const [testAdmin] = await db.insert(users).values({
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
    }).returning();

    caller = await createTestCaller(db);
    adminCaller = await createAuthenticatedTestCaller(testAdmin, db);
  });

  it('should create an enquiry', async () => {
    const result = await caller.enquiry.create({
      name: "Enquiry User",
      email: "enquiry@example.com",
      message: "Hello world testing enquiry",
    });

    expect(result).toBeDefined();
    
    const saved = await db.query.enquiries.findFirst({
      where: eq(enquiries.email, "enquiry@example.com")
    });
    expect(saved).toBeDefined();
    expect(saved.status).toBe("new");
  });

  it('should list enquiries for admin', async () => {
    const result = await adminCaller.enquiry.list({ limit: 10 });
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result.items[0].email).toBe("enquiry@example.com");
  });

  it('should update enquiry status', async () => {
    const saved = await db.query.enquiries.findFirst({
      where: eq(enquiries.email, "enquiry@example.com")
    });

    await adminCaller.enquiry.updateStatus({
      id: saved.id,
      status: "read"
    });

    const updated = await db.query.enquiries.findFirst({
      where: eq(enquiries.id, saved.id)
    });
    expect(updated.status).toBe("read");
  });

  it('should delete enquiry', async () => {
    const saved = await db.query.enquiries.findFirst({
      where: eq(enquiries.email, "enquiry@example.com")
    });

    await adminCaller.enquiry.delete({ id: saved.id });

    const deleted = await db.query.enquiries.findFirst({
      where: eq(enquiries.id, saved.id)
    });
    expect(deleted).toBeUndefined();
  });
});
