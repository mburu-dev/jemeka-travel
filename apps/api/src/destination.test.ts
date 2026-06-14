import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller } from './test-utils';
import { destinations } from '@jemeka/db';

describe('Destination Router', () => {
  let db: any;
  let caller: any;

  beforeAll(async () => {
    db = await setupTestDb();
    
    await db.insert(destinations).values([
      {
        name: "Test Dest 1",
        slug: "test-dest-1",
        country: "Kenya",
        region: "africa",
        description: "Desc 1",
        isFeatured: true,
      },
      {
        name: "Test Dest 2",
        slug: "test-dest-2",
        country: "Tanzania",
        region: "africa",
        description: "Desc 2",
        isFeatured: false,
      }
    ]);

    caller = await createTestCaller();
  });

  it('should list all destinations', async () => {
    const results = await caller.destination.list();
    expect(results.length).toBe(2);
  });

  it('should get destination by slug', async () => {
    const result = await caller.destination.getBySlug({ slug: "test-dest-1" });
    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Dest 1");
  });

  it('should get featured destinations', async () => {
    const results = await caller.destination.featured();
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe("test-dest-1");
  });
});
