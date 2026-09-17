import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt.js';

const payload = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  role: 'CUSTOMER' as const,
};

describe('JWT utility', () => {
  it('creates and verifies an access token with the user identity', () => {
    const token = generateAccessToken(payload);

    expect(verifyAccessToken(token)).toMatchObject(payload);
  });

  it('creates and verifies a refresh token with the user identity', () => {
    const token = generateRefreshToken(payload);

    expect(verifyRefreshToken(token)).toMatchObject(payload);
  });

  it('rejects a refresh token when an access token is required', () => {
    expect(() => verifyAccessToken(generateRefreshToken(payload))).toThrow();
  });

  it('rejects an access token when a refresh token is required', () => {
    expect(() => verifyRefreshToken(generateAccessToken(payload))).toThrow();
  });

  it('rejects a refresh-type token signed with the access secret', () => {
    const token = jwt.sign(
      { ...payload, tokenType: 'refresh' },
      env.JWT_ACCESS_SECRET,
    );

    expect(() => verifyAccessToken(token)).toThrow();
  });

  it('rejects an access-type token signed with the refresh secret', () => {
    const token = jwt.sign(
      { ...payload, tokenType: 'access' },
      env.JWT_REFRESH_SECRET,
    );

    expect(() => verifyRefreshToken(token)).toThrow();
  });

  it('rejects a signed token without a complete user identity', () => {
    const accessToken = jwt.sign(
      { tokenType: 'access' },
      env.JWT_ACCESS_SECRET,
    );
    const refreshToken = jwt.sign(
      { tokenType: 'refresh' },
      env.JWT_REFRESH_SECRET,
    );

    expect(() => verifyAccessToken(accessToken)).toThrow();
    expect(() => verifyRefreshToken(refreshToken)).toThrow();
  });

  it('rejects a malformed token', () => {
    expect(() => verifyAccessToken('not-a-token')).toThrow();
  });
});
