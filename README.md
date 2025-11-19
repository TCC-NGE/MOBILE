# NGE Mobile - App React Native

> Aplicativo mobile para usuários do sistema NGE Transportes

## Stack

- React Native 0.76.7
- Expo 52
- React Navigation 7
- Firebase Authentication
- Firebase Firestore
- Firebase Cloud Messaging (FCM)
- Axios

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

## Estrutura

```
src/
├── config/
│   └── firebaseConfig.js         # Config Firebase
├── constants/
│   └── colors.js                 # Cores do tema
├── screens/
│   ├── Login.js                  # Tela de login
│   ├── SignUp.js                 # Tela de cadastro
│   ├── HomeScreen.js             # Home com menu
│   ├── Card.js                   # Carteira digital
│   └── Logo.js                   # Logo do app
├── services/
│   ├── authService.js            # Serviço de autenticação
│   └── firestoreService.js       # Serviço do Firestore
└── utils/
    └── validacoes.js             # Validações comuns
```

## API Backend

O app se conecta ao backend NGE em:
- Desenvolvimento: `http://localhost:3000`
- Produção: `https://nge-backend.railway.app`

Configure em `src/config/api.js`

## Deploy

### Expo EAS Build

```bash
# Login no Expo
npx expo login

# Build para Android
npx eas build --platform android

# Build para iOS
npx eas build --platform ios
```

## Documentação

Ver documentação completa no repositório principal:
https://github.com/wendelmax/NGE

## Equipe

- Nicolas Santos
- Erik Tanaka
- Giovanni Noveli

ETEC Bento Quirino - Campinas - 2025

