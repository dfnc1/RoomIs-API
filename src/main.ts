import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConsoleLogger, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            json: true,
        }),
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
    console.error(err)
});
