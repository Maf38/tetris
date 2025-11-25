# PostgreSQL avec Prisma

## Objectif

Créer et gérer la base de données PostgreSQL pour stocker les scores du Tetris.

---

## 1. Installation

```bash
npm install prisma @prisma/client
npm install -D prisma
```

---

## 2. Initialisation Prisma

```bash
npx prisma init
```

Cela crée :
- `prisma/schema.prisma` - Schéma de la base
- `.env` - Variables d'environnement

---

## 3. Configuration

### .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tetris?schema=public"
```

### prisma/schema.prisma
```prisma
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
}
```

---

## 4. Migrations

```bash
# Créer et appliquer la migration
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

---

## 5. Utilisation dans le code

```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Connexion au démarrage
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Déconnexion propre
export async function disconnectDatabase() {
  await prisma.$disconnect();
}
```

---

## 6. Requêtes courantes

```typescript
// src/services/score.service.ts
import { prisma } from '../config/database';

export class ScoreService {
  // Créer un score
  async createScore(data: {
    playerId: string;
    value: number;
    level: number;
    lines: number;
  }) {
    return prisma.score.create({
      data,
      include: { player: true }
    });
  }

  // Leaderboard
  async getLeaderboard(limit = 10) {
    return prisma.score.findMany({
      take: limit,
      orderBy: { value: 'desc' },
      include: {
        player: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });
  }

  // Scores d'un joueur
  async getPlayerScores(playerId: string) {
    return prisma.score.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  // Statistiques
  async getPlayerStats(playerId: string) {
    const scores = await prisma.score.findMany({
      where: { playerId },
      select: { value: true, level: true, lines: true }
    });

    return {
      gamesPlayed: scores.length,
      bestScore: Math.max(...scores.map(s => s.value)),
      averageScore: scores.reduce((sum, s) => sum + s.value, 0) / scores.length,
      totalLines: scores.reduce((sum, s) => sum + s.lines, 0)
    };
  }
}
```

---

## 7. Docker Compose pour PostgreSQL

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: tetris-db
    environment:
      POSTGRES_USER: tetris
      POSTGRES_PASSWORD: tetris123
      POSTGRES_DB: tetris
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Démarrage :
```bash
docker-compose up -d
```

---

## 8. Prisma Studio (GUI)

```bash
npx prisma studio
```

Ouvre http://localhost:5555 pour gérer visuellement les données.

---

## 9. Seeds (données de test)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer un joueur de test
  const player = await prisma.player.create({
    data: {
      name: 'TestPlayer',
      avatar: 'default'
    }
  });

  // Créer des scores de test
  await prisma.score.createMany({
    data: [
      { playerId: player.id, value: 5000, level: 5, lines: 20 },
      { playerId: player.id, value: 3000, level: 3, lines: 12 },
      { playerId: player.id, value: 8000, level: 8, lines: 35 }
    ]
  });

  console.log('✅ Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
// package.json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
npm run seed
```

---

## 10. Best Practices

### ✅ À faire
- Utiliser les transactions pour les opérations multiples
- Indexer les colonnes fréquemment requêtées
- Valider les données avant insertion
- Gérer les erreurs de contraintes (unique, foreign key)

### ❌ À éviter
- Laisser des connexions ouvertes
- Exposer les erreurs SQL directement
- Oublier les migrations en production

---

## Exercice

Crée les fonctions suivantes :
- [ ] `getTopScoresByGameMode(mode: string, limit: number)`
- [ ] `deleteOldScores(days: number)` - Supprime les scores > X jours
- [ ] `updatePlayerAvatar(playerId: string, avatar: string)`

---

## Prochaine étape

👉 Intègre l'API dans Angular : [tetris/cours/07-http-state/05-backend-integration](../../tetris/cours/07-http-state/05-backend-integration/README.md)
