# 📝 TODO App - Full Stack

Application de gestion de tâches avec Node.js, Express, MySQL, Sequelize et React.

## 🎯 Objectif du Projet

Ce projet est une **application TODO classique et simple** dans sa fonctionnalité, mais son véritable objectif est de servir de **terrain d'exploration pour les architectures Cloud Native**.

### Pourquoi ce projet ?

L'application en elle-même est volontairement basique pour se concentrer sur les aspects suivants :

- ✅ **Conteneurisation** avec Docker
- ✅ **Orchestration** avec Docker Compose
- ✅ **CI/CD** avec GitHub Actions
- ✅ **Déploiement Cloud** sur AWS EC2
- ✅ **Architecture microservices** (Backend/Frontend séparés)
- ✅ **Bonnes pratiques DevOps** et Infrastructure as Code

Le but n'est pas la complexité de l'application, mais la **maîtrise des technologies Cloud Native** et des **workflows modernes de développement et déploiement**.

---

## 🚀 Technologies

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM

### Frontend
- React.js
- Axios
- CSS3

### DevOps & Cloud
- Docker & Docker Compose
- Kubernetes (K8s)
- GitHub Actions (CI/CD)
- AWS EC2
- Docker Hub

---

## 📦 Installation Locale

### Prérequis
- Node.js v16+
- MySQL 8.0+
- npm ou yarn

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Base de données
```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE todo_db;
```

### Variables d'environnement
Créez un fichier `.env` à la racine du projet backend :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=todo_db
DB_PORT=3306
PORT=5000
```

### Démarrage
```bash
# Backend
cd backend
npm start

# Frontend (dans un autre terminal)
cd frontend
npm start
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

---

## 🐳 Docker

### Dockerfile Backend
```dockerfile
# Utiliser l'image officielle de Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendance
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers de l'application
COPY . .

# Exposer le port
EXPOSE 5000

# Lancer l'application
CMD ["npm", "start"]
```

### Dockerfile Frontend
```dockerfile
# Utiliser l'image officielle de Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendance
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=3306
    depends_on:
      - mysql
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    restart: always

volumes:
  mysql_data:
```

### Lancement avec Docker Compose
```bash
# Construire et démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

---

## 🔄 CI/CD avec GitHub Actions

### Configuration du Pipeline

Fichier : `.github/workflows/deploy.yml`

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker images
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/todo-app-backend:latest ./backend
          docker build -t ${{ secrets.DOCKER_USERNAME }}/todo-app-frontend:latest ./frontend
          docker push ${{ secrets.DOCKER_USERNAME }}/todo-app-backend:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/todo-app-frontend:latest

      - name: Deploy to EC2
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_PRIVATE_KEY }}
          source: "docker-compose.yml,.env"
          target: "/home/ec2-user/todo-app/"

      - name: Run Docker Compose on EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_PRIVATE_KEY }}
          script: |
            cd /home/ec2-user/todo-app
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### Secrets à configurer dans GitHub

Dans votre repository GitHub, allez dans **Settings → Secrets and variables → Actions** et ajoutez :

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKER_PASSWORD` | Mot de passe Docker Hub |
| `EC2_HOST` | Adresse IP publique de votre instance EC2 |
| `EC2_USERNAME` | Nom d'utilisateur SSH (généralement `ec2-user` ou `ubuntu`) |
| `EC2_PRIVATE_KEY` | Clé privée SSH (contenu du fichier `.pem`) |

---

## ☁️ Déploiement sur AWS EC2

### 1. Créer une instance EC2
- Type : t2.micro (eligible free tier)
- OS : Amazon Linux 2 ou Ubuntu
- Security Group : Ouvrir les ports 22 (SSH), 80 (HTTP), 3000, 5000

### 2. Se connecter à l'instance
```bash
ssh -i votre-cle.pem ec2-user@votre-ip-publique
```

### 3. Installer Docker sur EC2
```bash
# Amazon Linux 2
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Le déploiement automatique
À chaque push sur `main`, GitHub Actions va :
1. ✅ Construire les images Docker
2. ✅ Les pousser sur Docker Hub
3. ✅ Se connecter à EC2
4. ✅ Déployer l'application

---

## 📚 Apprentissages Cloud Native

Ce projet permet d'explorer :

### 1. **Conteneurisation**
- Création de Dockerfiles optimisés
- Multi-stage builds
- Gestion des volumes et réseaux

### 2. **Orchestration**
- Docker Compose pour orchestrer plusieurs services
- Gestion des dépendances entre services
- Configuration des réseaux et volumes

### 3. **CI/CD**
- Pipeline automatisé avec GitHub Actions
- Build, test et déploiement automatiques
- Intégration avec Docker Hub

### 4. **Cloud Deployment**
- Déploiement sur AWS EC2
- Configuration de la sécurité (Security Groups)
- Gestion des secrets et variables d'environnement

### 5. **Best Practices**
- Séparation des environnements (dev/prod)
- Configuration via variables d'environnement
- Logs et monitoring
- Zero-downtime deployment

---

## 🛠️ Commandes Utiles

### Docker
```bash
# Construire une image
docker build -t nom-image .

# Lister les images
docker images

# Lister les conteneurs en cours
docker ps

# Voir les logs d'un conteneur
docker logs -f nom-conteneur

# Nettoyer les ressources inutilisées
docker system prune -a
```

### Docker Compose
```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose build

# Voir les logs
docker-compose logs -f

# Exécuter une commande dans un service
docker-compose exec backend sh
```

---

## 📝 Roadmap

- [ ] Ajouter Kubernetes (K8s) pour l'orchestration
- [ ] Implémenter un service mesh (Istio/Linkerd)
- [ ] Ajouter monitoring avec Prometheus + Grafana
- [ ] Mettre en place du logging centralisé (ELK Stack)
- [ ] Ajouter des tests automatisés dans le pipeline
- [ ] Implémenter une stratégie de déploiement Blue/Green
- [ ] Ajouter un reverse proxy (Nginx)
- [ ] Migrer vers une architecture serverless (AWS Lambda)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

## 📄 Licence

MIT

---

## 👤 Auteur

[GitHub](https://github.com/BAMBA-FALL)

---

## 📖 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Cloud Native Computing Foundation](https://www.cncf.io/)
