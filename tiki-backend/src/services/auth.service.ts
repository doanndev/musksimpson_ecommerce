import { v4 as uuidv4 } from 'uuid';
import { prisma } from '~/configs/database.config';
import redisClient from '~/configs/redis.config';
import { MESSAGES } from '~/libs/constants/messages.constant';
import {
  ForgotPasswordRequestSchema,
  type ForgotPasswordRequestType,
  LoginRequestSchema,
  type LoginRequestType,
  LoginResponseSchema,
  type LoginResponseType,
  RegisterRequestSchema,
  type RegisterRequestType,
  RegisterResponseSchema,
  type RegisterResponseType,
  ResetPasswordRequestSchema,
  type ResetPasswordRequestType,
  SocialLoginRequestSchema,
  type SocialLoginRequestType,
  TwoFactorRequestSchema,
  type TwoFactorRequestType,
} from '~/libs/schemas/auth.schema';
import { UserResponseDataSchema, type UserResponseDataType } from '~/libs/schemas/user.schema';
import { generateResetPasswordEmail, sendEmail } from '~/libs/utils/email.util';
import { comparePassword } from '~/libs/utils/hashPassword.util';
import { generateToken, verifyToken } from '~/libs/utils/jwt.util';
import { getRequestUser } from '~/libs/utils/requestContext.util';
import UserRepository from '../repositories/user.repository';

class AuthService {
  async login(data: LoginRequestType): Promise<LoginResponseType> {
    const parsedData = LoginRequestSchema.parse(data);

    // Handle social login
    if (parsedData.provider && parsedData.provider !== 'email') {
      return this.socialLogin({
        email: parsedData.email!,
        fullName: parsedData.fullName || '',
        avatar: parsedData.avatar,
        provider: parsedData.provider,
        providerId: parsedData.providerId!,
      });
    }

    // Handle email/password login
    const user = await UserRepository.findByAttributes(
      {
        username: parsedData.username,
        email: parsedData.email,
        // provider: 'email',
      },
      'AND'
    );

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    if (!parsedData.password) {
      throw new Error(MESSAGES.PASSWORD_REQUIRED);
    }

    const isPasswordValid = comparePassword(parsedData.password, user.password!);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.INCORRECT_PASSWORD);
    }

    // if (user.two_factor_enabled) {
    //   if (!parsedData.twoFactorCode) {
    //     const twoFactorCode = Math.floor(
    //       100000 + Math.random() * 900000,
    //     ).toString()
    //     await redisClient.setEx(`2fa:${user.uuid}`, 600, twoFactorCode)
    //     await sendEmail(generateTwoFactorEmail(user.email, twoFactorCode))
    //     return LoginResponseSchema.parse({
    //       ...user,
    //       twoFactorRequired: true,
    //     })
    //   }

    //   const storedCode = await redisClient.get(`2fa:${user.uuid}`)
    //   if (storedCode !== parsedData.twoFactorCode) {
    //     throw new Error(MESSAGES.TWO_FACTOR_REQUIRED)
    //   }
    // }

    // Update last login
    await UserRepository.update(user.uuid, { last_login: new Date() });

    const accessToken = generateToken({
      userId: user.uuid,
      roleId: user.role_id,
    });
    const refreshToken = uuidv4();
    await redisClient.setEx(`refresh:${user.uuid}:${refreshToken}`, 7 * 24 * 60 * 60, accessToken);

    return LoginResponseSchema.parse({
      token: accessToken,
      refreshToken,
    });
  }

  async socialLogin(data: SocialLoginRequestType): Promise<LoginResponseType> {
    const parsedData = SocialLoginRequestSchema.parse(data);

    let user = await UserRepository.findByAttributes(
      {
        email: parsedData.email,
        provider: parsedData.provider,
      },
      'AND'
    );

    if (!user) {
      const existingUser = await UserRepository.findByAttributes({
        email: parsedData.email,
      });

      if (existingUser && existingUser.provider !== parsedData.provider) {
        throw new Error(
          `Account exists with ${existingUser.provider} login. Please use ${existingUser.provider} to sign in.`
        );
      }

      const username = parsedData.email.split('@')[0];
      user = await UserRepository.create({
        username,
        email: parsedData.email,
        full_name: parsedData.fullName,
        avatar: parsedData.avatar,
        provider: parsedData.provider,
        provider_id: parsedData.providerId,
        role_id: 2,
        email_verified_at: new Date(),
        is_activated: true,
      });
    } else {
      user = await UserRepository.update(user.uuid, {
        full_name: parsedData.fullName,
        avatar: parsedData.avatar,
        last_login: new Date(),
      });
    }

    const accessToken = generateToken({
      userId: user.uuid,
      roleId: user.role_id,
    });

    const refreshToken = uuidv4();
    await redisClient.setEx(`refresh:${user.uuid}:${refreshToken}`, 7 * 24 * 60 * 60, accessToken);

    return LoginResponseSchema.parse({
      token: accessToken,
      refreshToken,
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const storedAccessToken = await redisClient.get(`refresh:${userId}:${refreshToken}`);

    if (!storedAccessToken) {
      throw new Error(MESSAGES.SESSION_EXPIRED);
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const newAccessToken = generateToken({
      userId: user.uuid,
      roleId: user.role_id,
    });
    await redisClient.setEx(`refresh:${user.uuid}:${refreshToken}`, 7 * 24 * 60 * 60, newAccessToken);

    return { accessToken: newAccessToken, refreshToken };
  }

  async register(data: RegisterRequestType): Promise<RegisterResponseType> {
    const parsedData = RegisterRequestSchema.parse(data);

    if (parsedData.provider === 'email') {
      const existingUser = await UserRepository.findByAttributes(
        {
          username: parsedData.username,
          email: parsedData.email,
        },
        'OR'
      );

      if (existingUser) {
        throw new Error(MESSAGES.ACCOUNT_ALREADY_EXISTS);
      }

      const userData = {
        ...parsedData,
        role_id: 2,
        provider: 'email' as const,
      };
      const user = await UserRepository.create(userData);

      const accessToken = generateToken({
        userId: user.uuid,
        roleId: user.role_id,
      });
      const refreshToken = uuidv4();
      await redisClient.setEx(`refresh:${user.uuid}:${refreshToken}`, 7 * 24 * 60 * 60, accessToken);

      return RegisterResponseSchema.parse({
        token: accessToken,
        refreshToken,
      });
    } else {
      // Social registration (same as social login)
      return this.socialLogin({
        email: parsedData.email,
        fullName: parsedData.fullName || '',
        avatar: parsedData.avatar,
        provider: parsedData.provider,
        providerId: parsedData.providerId!,
      });
    }
  }

  async logout(userId: string, refreshToken: string) {
    await redisClient.del(`refresh:${userId}:${refreshToken}`);
    // await redisClient.del(`refresh:${userId}:*`)
  }

  async logoutAllDevices(userId: string) {
    const keys = await redisClient.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }

  async forgotPassword(data: ForgotPasswordRequestType) {
    const parsedData = ForgotPasswordRequestSchema.parse(data);
    const user = await UserRepository.findByAttributes({
      email: parsedData.email,
    });

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const token = generateToken(
      {
        userId: user.uuid,
        roleId: user.role_id,
      },
      Math.floor(Date.now() / 1000) + 5 * 60
    );
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.reset_password_token.create({
      data: {
        user_id: user.uuid,
        token,
        expires_at: expiresAt,
      },
    });

    const emailOptions = generateResetPasswordEmail(user.uuid, token, user.role_id === 1);
    emailOptions.to = parsedData.email;

    await sendEmail(emailOptions);

    return {
      email: parsedData.email,
      expiresAt: expiresAt.getTime(),
      userId: user.uuid,
      token,
    };
  }

  async resetPassword(userId: string, token: string, data: ResetPasswordRequestType): Promise<UserResponseDataType> {
    const parsedData = ResetPasswordRequestSchema.parse(data);
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const tokenRecord = await prisma.reset_password_token.findFirst({
      where: {
        user_id: userId,
        token,
        expires_at: { gte: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new Error(MESSAGES.INVALID_TOKEN);
    }

    try {
      const decoded = verifyToken(token);
      if (decoded.userId !== userId) {
        throw new Error(MESSAGES.INVALID_TOKEN);
      }
    } catch (error) {
      console.log({ error });
      throw new Error(MESSAGES.INVALID_TOKEN);
    }

    const updatedUser = await UserRepository.update(userId, {
      password: parsedData.password,
    });

    await prisma.reset_password_token.deleteMany({
      where: { user_id: userId, token },
    });

    return UserResponseDataSchema.parse(updatedUser);
  }

  async verifyToken(userId: string, token: string) {
    const tokenRecord = await prisma.reset_password_token.findFirst({
      where: {
        user_id: userId,
        token,
        expires_at: { gte: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new Error(MESSAGES.INVALID_TOKEN);
    }

    return { expiresAt: tokenRecord.expires_at.getTime() };
  }

  async enableTwoFactor(userId: string): Promise<UserResponseDataType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId || reqUser.userId !== userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const updatedUser = await UserRepository.update(userId, {
      two_factor_enabled: true,
    });

    return UserResponseDataSchema.parse(updatedUser);
  }

  async verifyTwoFactor(data: TwoFactorRequestType): Promise<UserResponseDataType> {
    const parsedData = TwoFactorRequestSchema.parse(data);
    const user = await UserRepository.findByAttributes({
      email: parsedData.email,
    });

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const storedCode = await redisClient.get(`2fa:${user.uuid}`);
    if (storedCode !== parsedData.twoFactorCode) {
      throw new Error(MESSAGES.TWO_FACTOR_INVALID);
    }

    const accessToken = generateToken({
      userId: user.uuid,
      roleId: user.role_id,
    });
    const refreshToken = uuidv4();
    await redisClient.setEx(`refresh:${user.uuid}:${refreshToken}`, 7 * 24 * 60 * 60, accessToken);

    return UserResponseDataSchema.parse({
      ...user,
      token: accessToken,
    });
  }
}

export default new AuthService();
