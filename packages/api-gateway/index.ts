import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestLogger } from '@shitake/utils-logger/nest.logger';

import { ApplicationModule } from './module';

import { profileClientOptions } from '@shitake/microservice-profile/infrastructure';
import { authClientOptions } from '@shitake/microservice-auth/infrastructure';

declare const module: any;

export async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { logger: new NestLogger() });

  app.connectMicroservice(profileClientOptions);
  app.connectMicroservice(authClientOptions);

  await app.startAllMicroservicesAsync();

  const options = new DocumentBuilder()
    .setTitle('Shitake')
    .setDescription('A CRQS Test')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
