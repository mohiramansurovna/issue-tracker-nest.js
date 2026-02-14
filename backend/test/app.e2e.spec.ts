import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/app.controller';

describe('AppController (integration)', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('get() returns health payload', async () => {
    const result = await controller.get();

    expect(result).toEqual({ ok: true });
  });
});
