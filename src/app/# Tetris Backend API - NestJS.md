# Tetris Backend API - NestJS

## Stack technique

- **NestJS** - Framework Node.js progressif
- **TypeScript** - Typage fort
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne
- **Docker** - Conteneurisation
- **Swagger** - Documentation API automatique

## Pourquoi NestJS ?

- ✅ Architecture modulaire et scalable
- ✅ TypeScript natif
- ✅ Dependency Injection intégré
- ✅ Compatible avec Express/Fastify
- ✅ Documentation Swagger automatique
- ✅ Testable (Jest intégré)

---

## Installation

### Prérequis

- Node.js >= 18
- npm ou yarn
- Docker (recommandé pour PostgreSQL)

### Commandes d'initialisation

```bash
# Installation globale de NestJS CLI
npm install -g @nestjs/cli

# Création du projet
nest new tetris-backend
# ? Which package manager would you ❤️ to use? npm

cd tetris-backend

# Installation des dépendances
npm install @prisma/client
npm install -D prisma

# Installation Swagger
npm install @nestjs/swagger swagger-ui-express

# Installation validation
npm install class-validator class-transformer

# Installation config
npm install @nestjs/config
```

---

## Structure du projet

```bash
tetris-backend
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── scores
│   │   ├── dto
│   │   │   ├── create-score.dto.ts
│   │   │   └── update-score.dto.ts
│   │   ├── entities
│   │   │   └── score.entity.ts
│   │   ├── scores.controller.ts
│   │   ├── scores.module.ts
│   │   └── scores.service.ts
│   └── players
│       ├── dto
│       │   ├── create-player.dto.ts
│       │   └── update-player.dto.ts
│       ├── entities
│       │   └── player.entity.ts
│       ├── players.controller.ts
│       ├── players.module.ts
│       └── players.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .gitignore
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── prisma.schema
└── tsconfig.json
```

---

## Commandes utiles

```bash
# Démarrer le serveur en mode développement
npm run start:dev

# Démarrer le serveur en mode production
npm run start:prod

# Exécuter les migrations Prisma
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Ouvrir le studio Prisma
npx prisma studio

# Lancer les tests
npm run test
```

---

## Documentation API

La documentation de l'API est générée automatiquement par Swagger.

- URL de la documentation : [http://localhost:3000/api](http://localhost:3000/api)

---

## Environnement de développement

Pour un développement optimal, utilisez les outils suivants :

- **Postman** ou **Insomnia** pour tester l'API
- **Docker** pour la base de données
- **VSCode** avec les extensions recommandées dans le fichier `.vscode/extensions.json`

---

## Déploiement

Pour déployer l'application, suivez ces étapes :

1. Construire l'image Docker : `docker build -t tetris-backend .`
2. Lancer les conteneurs : `docker-compose up -d`
3. Exécuter les migrations : `docker-compose exec api npx prisma migrate deploy`
4. Générer le client Prisma : `docker-compose exec api npx prisma generate`
5. Accéder à l'application sur `http://localhost:3000`

---

## Aide et support

Pour toute question ou problème, ouvrez une issue sur le dépôt GitHub ou contactez le support.

---

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le dépôt
2. Crée une branche pour votre fonctionnalité : `git checkout -b ma-fonctionnalite`
3. Committez vos changements : `git commit -m 'Ajoute une nouvelle fonctionnalité'`
4. Poussez vers le dépôt distant : `git push origin ma-fonctionnalite`
5. Ouvrez une pull request

---

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

Merci d'avoir choisi le backend Tetris avec NestJS ! Amusez-vous bien à coder et à jouer !