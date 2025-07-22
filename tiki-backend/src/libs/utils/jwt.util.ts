import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import type { AuthPayloadType } from '../schemas/common.shema';

const generateToken = (payload: AuthPayloadType, expiresIn: SignOptions['expiresIn'] = 7 * 24 * 60 * 60): string => {
  const secret = (process.env.SECRET_KEY as Secret) || 'DEFAULT_SECRET';
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload as unknown as JwtPayload, secret, options);
};

const verifyToken = (token: string): AuthPayloadType => {
  try {
    const secret = (process.env.JWT_SECRET_KEY as Secret) || 'DEFAULT_SECRET';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token payload');
    }

    return {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };
  } catch (error: any) {
    console.error('Token verification error:', error.message);
    throw new Error('Invalid token');
  }
};

export { generateToken, verifyToken };
