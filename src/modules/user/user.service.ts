import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from '../auth/auth.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
    private redisService: RedisService,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }

  async forgotPassword(email: string): Promise<{message:string}> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.authService.generateOtp();
    await this.redisService.setOtp(email, otp);
    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully to your email' };

  }

  async verifyOtp(email: string, otp: string, newPassword: string): Promise<{message:string}> {
    const storedOtp = await this.redisService.getOtp(email);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await this.authService.hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    await this.redisService.deleteOtp(email);
    return { message: 'Password changed successfully' };

  }

  async resendOtp(email: string): Promise<{message:string}> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.authService.generateOtp();
    await this.redisService.setOtp(email, otp);
    await this.emailService.sendOtpEmail(email, otp);
    return { message: 'New OTP sent successfully' };

  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }

    if (updateProfileDto.profilePicture) {
      if (user.profilePicture) {
        const publicId = user.profilePicture.split('/').pop()?.split('.')[0];
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId);
        }
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        updateProfileDto.profilePicture,
      );
      user.profilePicture = uploadResult.secure_url;
    }

    await user.save();

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
} 