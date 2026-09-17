import { env } from '../config/env.js'
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    role: 'CUSTOMER' | 'ADMIN';
}

function buildOptions(expiresIn: string): SignOptions {
    return {
        expiresIn: expiresIn as SignOptions['expiresIn'],
    };
}

export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
        { ...payload, tokenType: 'access' },
        env.JWT_ACCESS_SECRET,
        buildOptions(env.JWT_ACCESS_EXPIRES_IN ?? '15m'),
    );
}

export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
        { ...payload, tokenType: 'refresh'},
        env.JWT_REFRESH_SECRET,
        buildOptions(env.JWT_REFRESH_EXPIRES_IN ?? '7d'),
    );
}

export function verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (
        typeof decoded !== 'object' ||
        decoded === null ||
        typeof (decoded as any).userId !== 'string' ||
        !(decoded as any).userId ||
        !['CUSTOMER', 'ADMIN'].includes((decoded as any).role) ||
        (decoded as any).tokenType !== 'access'
    ) {
        throw new Error('Invalid token payload');
    }

    return {
        userId: (decoded as any).userId,
        role: (decoded as any).role as TokenPayload['role'],
    };
}

export function verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & {tokenType: string};

    if (
        typeof decoded !== 'object' ||
        decoded === null ||
        typeof (decoded as any).userId !== 'string' ||
        !(decoded as any).userId ||
        !['CUSTOMER', 'ADMIN'].includes((decoded as any).role) ||
        (decoded as any).tokenType !== 'refresh'
    ) {
        throw new Error('Invalid token payload');
    }

    return { userId: decoded.userId, role: decoded.role};
}