import { describe, it, expect } from 'vitest';

function generateBookingRef() {
  const prefix = "JMK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

describe('Booking Reference Generation', () => {
  it('should generate a reference with JMK prefix', () => {
    const ref = generateBookingRef();
    expect(ref.startsWith('JMK-')).toBe(true);
  });

  it('should be of reasonable length', () => {
    const ref = generateBookingRef();
    // JMK- (4) + timestamp (approx 8-10) + random (3)
    expect(ref.length).toBeGreaterThan(10);
    expect(ref.length).toBeLessThan(25);
  });

  it('should generate unique references', () => {
    const ref1 = generateBookingRef();
    const ref2 = generateBookingRef();
    expect(ref1).not.toBe(ref2);
  });
});
