import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  const port = process.env.PORT || 8080;
  await app.listen(port, "0.0.0.0");

  console.log(`Shaman Backend running on port ${port}`);
}

bootstrap();
