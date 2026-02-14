import { ValidationPipe } from "@nestjs/common";

export const ValidationConfig = new ValidationPipe({
  whitelist: true, //removes unknows fields
  forbidNonWhitelisted: true, //throws 400 on unknows fields
  transform: true, //transforms payloads to DTO classes
  transformOptions: { enableImplicitConversion: true },
});