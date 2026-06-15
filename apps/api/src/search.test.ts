import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller } from './test-utils';
import { packages, destinations } from '@jemeka/db';

describe('Search Router', () => {
  let db: any;
  let caller: any;

  beforeAll(async () => {
    const testDb = await setupTestDb();

    db = testDb.db;
    
    const [dest] = await db.insert(destinations).values({
      name: "Zanzibar Special",
      slug: "zanzibar-special",
      country: "Tanzania",
      region: "africa",
      description: "A beautiful island",
    }).returning();

    await db.insert(packages).values({
      title: "Zanzibar Safari",
      slug: "zanzibar-safari",
      destinationId: dest.id,
      description: "Safari in Zanzibar",
      duration: 3,
      maxGroupSize: 10,
      price: "500",
      category: "adventure",
      isFeatured: true,
    });

    caller = await createTestCaller(db);
  });

  it('should return matching packages and destinations', async () => {
    const result = await caller.search.global({ q: "Zanzibar" });
    expect(result.packages.length).toBe(1);
    expect(result.packages[0].title).toBe("Zanzibar Safari");
    expect(result.destinations.length).toBe(1);
    expect(result.destinations[0].name).toBe("Zanzibar Special");
  });

  it('should return empty arrays for no match', async () => {
    const result = await caller.search.global({ q: "Mars" });
    expect(result.packages.length).toBe(0);
    expect(result.destinations.length).toBe(0);
  });
});
