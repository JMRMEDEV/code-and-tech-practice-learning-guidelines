import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import * as fc from 'fast-check';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema, UserDocument } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('Auth Property Tests', () => {
  let module: TestingModule;
  let authService: AuthService;
  let authController: AuthController;
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              jwt: {
                secret: 'test-secret-key-for-property-testing',
                expiresIn: '1h',
              },
              database: {
                uri,
              },
            }),
          ],
        }),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri,
          }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('jwt.secret'),
            signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  /**
   * **Feature: cms-api, Property 1: Authentication round trip**
   * **Validates: Requirements 1.1, 1.2, 1.4**
   */
  it('should maintain authentication round trip consistency', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid email and password combinations
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
        }),
        async (credentials) => {
          // Clean up any existing user with this email before test
          await userModel.deleteOne({ email: credentials.email });

          // Step 1: Register user
          const registerDto: RegisterDto = {
            email: credentials.email,
            password: credentials.password,
          };

          const registerResponse = await authController.register(registerDto);

          // Verify registration response structure
          expect(registerResponse).toHaveProperty('access_token');
          expect(registerResponse).toHaveProperty('user');
          expect(registerResponse.user).toHaveProperty('id');
          expect(registerResponse.user).toHaveProperty('email', credentials.email);
          expect(typeof registerResponse.access_token).toBe('string');
          expect(registerResponse.access_token.length).toBeGreaterThan(0);

          // Step 2: Login with same credentials
          const loginDto: LoginDto = {
            email: credentials.email,
            password: credentials.password,
          };

          const loginResponse = await authController.login(loginDto);

          // Verify login response structure
          expect(loginResponse).toHaveProperty('access_token');
          expect(loginResponse).toHaveProperty('user');
          expect(loginResponse.user).toHaveProperty('id');
          expect(loginResponse.user).toHaveProperty('email', credentials.email);
          expect(typeof loginResponse.access_token).toBe('string');
          expect(loginResponse.access_token.length).toBeGreaterThan(0);

          // Step 3: Verify JWT token can be used to validate user
          const jwtService = module.get(JwtService);
          const decodedToken = jwtService.verify(loginResponse.access_token);
          
          expect(decodedToken).toHaveProperty('sub');
          expect(decodedToken).toHaveProperty('email', credentials.email);

          // Step 4: Verify user can be validated using the token payload
          const validatedUser = await authService.validateUser(decodedToken.sub);
          expect(validatedUser).toBeTruthy();
          expect(validatedUser.email).toBe(credentials.email);
          expect(validatedUser.password).toBeUndefined(); // Password should be excluded

          // Clean up after test
          await userModel.deleteOne({ email: credentials.email });
        }
      ),
      { numRuns: 100, timeout: 10000 }
    );
  }, 180000);
});