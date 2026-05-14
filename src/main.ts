import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get("/", (req, res) => {
    res.status(200).send("OK");
  });

  httpAdapter.get("/kaithheathcheck", (req, res) => {
    res.status(200).send("OK");
  });

  httpAdapter.get("/favicon.ico", (req, res) => {
    res.status(204).send();
  });

  const port = Number(process.env.PORT) || 8080;
  await app.listen(port, "0.0.0.0");

  console.log(`Shaman Backend running on port ${port}`);
}

bootstrap();
