# NGE Mobile - App React Native

> Aplicativo mobile para usuários do sistema NGE Transportes

## Stack

- React Native
- Expo 
- React Navigation 
- Firebase Authentication
- Firebase Firestore

## Features

- Cadastro e login de usuários
- Carteira digital (comum, estudante, escolar, universitário, idoso)
- Recarga de saldo
- Validação de viagens
- Histórico de transações
- Notificações push
- Perfil de usuário

## Setup

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

Copie os exemplos:
```bash
cp src/config/firebaseConfig.example.js src/config/firebaseConfig.js
cp src/services/authService.example.js src/services/authService.js
cp src/services/firestoreService.example.js src/services/firestoreService.js
```

Edite `src/config/firebaseConfig.js` com suas credenciais do Firebase.

### 3. Rodar o App

```bash
# Desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios
```
## API Backend

O app se conecta ao backend NGE em:
- Desenvolvimento: `http://localhost:3000`

Configure em `src/config/api.js`

## Equipe

- Nicolas Santos
- Erik Tanaka
- Giovanni Noveli
- Guilhobel Freitas

ETEC Bento Quirino - Campinas - 2025

