import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { DatabaseService } from '@/modules/database/database.service';

function looksLikeJwt(token: unknown): token is string {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

describe('AuthController (integration)', () => {
  let app: INestApplication;

  const email = 'creator@test.com';
  const password = 'creatorTest!';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const db=app.get(DatabaseService)
    await app.close();
    await db.$disconnect();
  });

  it('POST /auth/login -> returns accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'User logged in successfully',
        data: expect.objectContaining({
          accessToken: expect.any(String),
        }),
      }),
    );

    expect(looksLikeJwt(res.body.data.accessToken)).toBe(true);
  });

  it('POST /auth/login with wrong password -> 400', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'wrong_password' })
      .expect(400);
  });

  it('GET /auth -> returns list payload shape', async () => {
    const res = await request(app.getHttpServer()).get('/auth').expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
      }),
    );
  });
});
