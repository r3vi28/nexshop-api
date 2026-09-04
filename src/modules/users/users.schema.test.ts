import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from './users.schema.js';

describe('registerSchema', () => {
  const validRegistration = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securepass123',
  };

  it('accepts a valid registration payload', () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it('rejects a name shorter than two characters', () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, name: 'J' }).success,
    ).toBe(false);
  });

  it('rejects an invalid email address', () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, email: 'not-an-email' }).success,
    ).toBe(false);
  });

  it('rejects a password shorter than eight characters', () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, password: 'short' }).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    expect(
      loginSchema.safeParse({
        email: 'jane@example.com',
        password: 'securepass123',
      }).success,
    ).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(
      loginSchema.safeParse({ email: 'jane@example.com', password: '' }).success,
    ).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('accepts a payload with either editable field', () => {
    expect(updateProfileSchema.safeParse({ name: 'Janet Doe' }).success).toBe(true);
    expect(updateProfileSchema.safeParse({ email: 'janet@example.com' }).success).toBe(
      true,
    );
  });

  it('rejects an empty update payload', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(false);
  });

  it('rejects invalid values in an update payload', () => {
    expect(updateProfileSchema.safeParse({ name: 'J' }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});
