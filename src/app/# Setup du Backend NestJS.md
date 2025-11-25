# Setup du Backend NestJS

## Objectif

Initialiser un projet backend NestJS avec PostgreSQL et Prisma pour l'API Tetris.

---

## 1. Installation de NestJS CLI

```bash
# Installation globale
npm install -g @nestjs/cli

# Vérification
nest --version
```

---

## 2. Création du projet

```bash
# Créer le projet
nest new tetris-backend

# Choix du package manager
? Which package manager would you ❤️ to use? npm

# Naviguer dans le projet
cd tetris-backend

# Vérifier que tout fonctionne
npm run start:dev
```

✅ Ouvre http://localhost:3000 → Tu devrais voir "Hello World!"

---

## 3. Installation des dépendances

### Prisma (ORM)

```bash
npm install @prisma/client
npm install -D prisma
```

### Swagger (Documentation API)

```bash
npm install @nestjs/swagger swagger-ui-express
```

### Validation

```bash
npm install class-validator class-transformer
```

### Configuration

```bash
npm install @nestjs/config
```

---

## 4. Initialisation de Prisma

```bash
npx prisma init
```

Cela crée :
- `prisma/schema.prisma`
- `.env`

### Configuration du schema.prisma

```prisma
// filepath: prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Player {
  id        String   @id @default(uuid())
  name      String   @unique
  avatar    String?  @default("default")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  scores    Score[]

  @@map("players")
}

model Score {
  id        String   @id @default(uuid())
  playerId  String
  player    Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
  value     Int
  level     Int
  lines     Int
  gameMode  String   @default("classic")
  createdAt DateTime @default(now())

  @@index([playerId])
  @@index([value])
  @@index([createdAt])
  @@map("scores")
}
```

---

## 5. Configuration Docker pour PostgreSQL

### docker-compose.yml

```yaml
# filepath: docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: tetris-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: tetris
      POSTGRES_PASSWORD: tetris123
      POSTGRES_DB: tetris
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tetris"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
    driver: local
```

### Démarrage

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Vérifier que le conteneur fonctionne
docker ps

# Voir les logs
docker-compose logs -f postgres
```

---

## 6. Configuration des variables d'environnement

### .env

```env
# filepath: .env
# Database
DATABASE_URL="postgresql://tetris:tetris123@localhost:5432/tetris?schema=public"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200

# Swagger
SWAGGER_TITLE="Tetris API"
SWAGGER_DESCRIPTION="API REST pour le jeu Tetris"
SWAGGER_VERSION="1.0"
```

### .env.example

```env
# filepath: .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/tetris?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

---

## 7. Génération de la base de données

```bash
# Créer la migration initiale
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

---

## 8. Configuration du module Prisma dans NestJS

### Créer le service Prisma

```bash
nest generate module prisma
nest generate service prisma
```

### Code du service

```typescript
// filepath: src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
  }
}
```

### Module Prisma

```typescript
// filepath: src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 9. Configuration Swagger dans main.ts

```typescript
// filepath: src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Tetris API')
    .setDescription('API REST pour le jeu Tetris')
    .setVersion('1.0')
    .addTag('players')
    .addTag('scores')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation on http://localhost:${port}/api`);
}

bootstrap();
```

---

## 10. Import du PrismaModule dans AppModule

```typescript
// filepath: src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 11. Création des modules Players et Scores

```bash
# Module Players
nest generate resource players
# ? What transport layer do you use? REST API
# ? Would you like to generate CRUD entry points? Yes

# Module Scores
nest generate resource scores
# ? What transport layer do you use? REST API
# ? Would you like to generate CRUD entry points? Yes
```

---

## 12. Scripts package.json

```json
// filepath: package.json (extrait)
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 13. Seed de données de test

```typescript
// filepath: prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer des joueurs de test
  const player1 = await prisma.player.create({
    data: {
      name: 'PlayerOne',
      avatar: 'avatar1',
    },
  });

  const player2 = await prisma.player.create({
    data: {
      name: 'ProGamer',
      avatar: 'avatar2',
    },
  });

  // Créer des scores de test
  await prisma.score.createMany({
    data: [
      {
        playerId: player1.id,
        value: 5000,
        level: 5,
        lines: 20,
        gameMode: 'classic',
      },
      {
        playerId: player1.id,
        value: 3000,
        level: 3,
        lines: 12,
        gameMode: 'classic',
      },
      {
        playerId: player2.id,
        value: 8000,
        level: 8,
        lines: 35,
        gameMode: 'classic',
      },
      {
        playerId: player2.id,
        value: 12000,
        level: 12,
        lines: 50,
        gameMode: 'marathon',
      },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Exécution du seed

```bash
npm run prisma:seed
```

---

## 14. Vérification finale

### Checklist

- [ ] Docker PostgreSQL fonctionne (`docker ps`)
- [ ] Prisma migré (`npx prisma migrate dev`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Seed exécuté (`npm run prisma:seed`)
- [ ] Serveur NestJS démarre (`npm run start:dev`)
- [ ] Swagger accessible (http://localhost:3000/api)
- [ ] Prisma Studio fonctionne (`npx prisma studio`)

---

## 15. Commandes utiles

```bash
# Prisma Studio (GUI pour la base)
npx prisma studio

# Voir les logs Docker
docker-compose logs -f

# Arrêter Docker
docker-compose down

# Réinitialiser la base
npx prisma migrate reset

# Générer une nouvelle migration
npx prisma migrate dev --name add_new_field
```

---

## Prochaine étape

✅ Ton backend est maintenant configuré !

👉 Passe à [02-api-design](../02-api-design/README.md) pour implémenter les endpoints.
