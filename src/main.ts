import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";

async function bootstrap() {
  // Matikan parser bawaan NestJS
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // ✅ CORS yang lebih aman (untuk Vercel nanti)
  app.enableCors({
    origin: [
      "http://localhost:3000", // lokal development
      "https://NAMA-FRONTEND-KAMU.vercel.app", // nanti ganti dengan URL Vercel kamu
    ],
    credentials: true,
  });

  // ✅ Parser manual dengan limit 50MB (sesuai kebutuhan kamu)
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  // ✅ Port dinamis untuk Bonto (WAJIB!)
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Shaman Backend berjalan di port ${port}`);
}
bootstrap();
