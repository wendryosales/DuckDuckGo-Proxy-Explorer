import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Duck Search API')
    .setDescription(
      'API for Duck Search. This API is used to search for information.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/api-json',
    swaggerOptions: {
      filter: true,
    },
  });
}
