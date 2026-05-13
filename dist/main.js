"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    // Matikan parser bawaan NestJS
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    // ✅ CORS yang lebih aman (untuk Vercel nanti)
    app.enableCors({
        origin: [
            "http://localhost:3000", // lokal development
            "https://NAMA-FRONTEND-KAMU.vercel.app", // nanti ganti dengan URL Vercel kamu
        ],
        credentials: true,
    });
    // ✅ Parser manual dengan limit 50MB (sesuai kebutuhan kamu)
    app.use((0, express_1.json)({ limit: "50mb" }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: "50mb" }));
    // ✅ Port dinamis untuk Bonto (WAJIB!)
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Shaman Backend berjalan di port ${port}`);
}
bootstrap();
