import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import axios from 'axios';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS.split(',');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useStaticAssets(join(__dirname, '..', 'static'));

  app.enableCors({
    origin: ALLOWED_HOSTS,
    credentials: true,
  });
  // const payload = {
  //   attachments: [
  //     {
  //       color: '#36a64f',
  //       title: 'Server Start',
  //       text: `ONF Server is being started with latest build at ${new Date()}`,
  //     },
  //   ],
  // };
  // const options = {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   data: payload,
  //   baseURL:
  //     'https://hooks.slack.com/services/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',
  // };
  // await axios.request(options);
  await app.listen(Number(process.env.SERVER_PORT));
}
bootstrap();
