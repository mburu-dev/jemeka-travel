import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, testCaller } from './test-utils';
import { getDb } from './queries/connection';
import { destinations, packages, bookings } from '@db/schema';
import { eq } from 'drizzle-orm';

describe('Booking Router Integration', () => {
  let db: any;
  let testPackageId: number;

  beforeAll(async () => {
    db = await setupTestDb();
    
    // Seed a destination
    const [dest] = await db.insert(destinations).values({
      name: "Test Destination",
      slug: "test-destination",
      country: "Tanzania",
      region: "africa",
      description: "A beautiful test destination",
    }).returning();

    // Seed a package
    const [pkg] = await db.insert(packages).values({
      title: "Test Safari",
      slug: "test-safari",
      destinationId: dest.id,
      description: "An amazing test safari",
      duration: 5,
      maxGroupSize: 10,
      price: "1500.00",
      category: "adventure",
    }).returning();

    testPackageId = pkg.id;
  });

  it('should create a new booking', async () => {
    const bookingData = {
      packageId: testPackageId,
      travelDate: new Date().toISOString(),
      adults: 2,
      children: 1,
      totalPrice: "3750.00",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+123456789",
      specialRequests: "Window seat please",
    };

    const result = await testCaller.booking.create(bookingData);
    
    expect(result).toBeDefined();
    
    // Verify in DB
    const bookingInDb = await db.query.bookings.findFirst({
      where: eq(bookings.customerEmail, "john@example.com"),
    });

    expect(bookingInDb).toBeDefined();
    expect(bookingInDb.customerName).toBe("John Doe");
    expect(bookingInDb.bookingReference).toMatch(/^JMK-/);
    expect(bookingInDb.status).toBe("pending");
  });

  it('should fetch a booking by reference', async () => {
    const bookingData = {
      packageId: testPackageId,
      travelDate: new Date().toISOString(),
      adults: 1,
      totalPrice: "1500.00",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
    };

    const created = await testCaller.booking.create(bookingData);
    
    // Get the reference from DB since create doesn't return the full object in current impl
    const bookingInDb = await db.query.bookings.findFirst({
      where: eq(bookings.customerEmail, "jane@example.com"),
    });

    const result = await testCaller.booking.getByReference({ 
      reference: bookingInDb.bookingReference 
    });

    expect(result).toBeDefined();
    expect(result?.customerName).toBe("Jane Smith");
  });
});
