import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { DatabaseService } from '@/modules/database/database.service';

describe('IssuesController (integration)', () => {
  let app: INestApplication;
  let db: DatabaseService;

  const creatorEmail = 'creator@test.com';
  const assigneeEmail = 'assignee@test.com';
  const creatorPassword = 'creatorTest!';
  const assigneePassword = 'assigneeTest!';

  let creatorToken = '';
  let creatorId = '';
  let assigneeId = '';
  let createdIssueId = '';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    db = app.get(DatabaseService);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: creatorEmail, password: creatorPassword })
      .expect(201);

    creatorToken = loginRes.body?.data?.accessToken ?? '';

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: assigneeEmail, password: assigneePassword })
      .expect(201);
    const creator = await db.user.findUnique({
      where: { email: creatorEmail },
      select: { id: true },
    });
    const assignee = await db.user.findUnique({
      where: { email: assigneeEmail },
      select: { id: true },
    });

    creatorId = creator?.id ?? '';
    assigneeId = assignee?.id ?? '';
  });

  afterAll(async () => {
    await app.close();
    await db.$disconnect();
  });

  it('GET /issues -> returns list payload shape', async () => {
    const res = await request(app.getHttpServer()).get('/issues').expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          issues: expect.any(Array),
        }),
      }),
    );
  });

  it('POST /issues -> creates issue', async () => {
    const body = {
      title: 'E2E Issue',
      description: 'E2E created issue',
      status: 'todo',
      priority: 'medium',
      assignee_id: assigneeId,
      labels: [],
    };

    const res = await request(app.getHttpServer())
      .post('/issues')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send(body)
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Created',
      }),
    );

    const listRes = await request(app.getHttpServer())
      .get('/issues')
      .expect(200);

    const issues = listRes.body?.data?.issues ?? [];
    const created = issues.find((issue: any) => issue.title === body.title);
    console.log("HERE CREATED",{created})
    expect(issues).toEqual(expect.any(Array));
    expect(created).toBeDefined();

    createdIssueId = created?.id ?? '';
  });

  it('PUT /issues -> updates issue', async () => {
    expect(createdIssueId).not.toBe('');

    const body = {
      id: createdIssueId,
      title: 'E2E Issue Updated',
      description: 'E2E updated issue',
      status: 'cancelled',
      priority: 'high',
      assignee_id: assigneeId,
      labels: [],
    };

    const res = await request(app.getHttpServer())
      .put('/issues')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send(body)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Updated',
      }),
    );
  });

  it('DELETE /issues -> deletes issue', async () => {
    // expect(createdIssueId).not.toBe('');

    const res = await request(app.getHttpServer())
      .delete('/issues')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ id: createdIssueId })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Deleted',
      }),
    );
  });
});
