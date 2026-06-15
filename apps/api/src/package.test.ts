import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller } from './test-utils';
import { packages, destinations } from '@jemeka/db';

describe('Package Router', () => {
  let db: any;
  let caller: any;

  beforeAll(async () => {
    const testDb = await setupTestDb();

    db = testDb.db;
    
    const [dest] = await db.insert(destinations).values({
      name: "Package Dest",
      slug: "package-dest",
      country: "Kenya",
      region: "africa",
      description: "Dest",
    }).returning();

    await db.insert(packages).values([
      {
        title: "Pack 1",
        slug: "pack-1",
        destinationId: dest.id,
        description: "Desc",
        duration: 3,
        maxGroupSize: 10,
        price: "500",
        category: "adventure",
        isFeatured: true,
      },
      {
        title: "Pack 2",
        slug: "pack-2",
        destinationId: dest.id,
        description: "Desc",
        duration: 5,
        maxGroupSize: 5,
        price: "1000",
        category: "luxury",
        isFeatured: false,
      }
    ]);

    caller = await createTestCaller(db);
  });

  it('should list all packages', async () => {
    const results = await caller.package.list();
    expect(results.length).toBe(2);
  });

  it('should filter by category', async () => {
    const results = await caller.package.list({ category: "adventure" });
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe("pack-1");
  });

  it('should get package by slug', async () => {
    const result = await caller.package.getBySlug({ slug: "pack-2" });
    expect(result).toBeDefined();
    expect(result?.title).toBe("Pack 2");
    expect(result?.destination).toBeDefined();
  });

  it('should get featured packages', async () => {
    const results = await caller.package.featured();
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe("pack-1");
  });

  it('should get categories', async () => {
    const categories = await caller.package.categories();
    expect(categories.length).toBeGreaterThan(0);
  });
});
