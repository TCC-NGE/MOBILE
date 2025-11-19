const { execSync } = require('child_process');

const packagesToUpdate = [
  { name: '@react-native-async-storage/async-storage', version: '1.23.1' },
  { name: 'expo-constants', version: '~17.0.8' },
  { name: 'expo-device', version: '~7.0.3' },
  { name: 'expo-notifications', version: '~0.29.14' },
  { name: 'react-native', version: '0.76.9' },
  { name: 'react-native-safe-area-context', version: '4.12.0' },
  { name: 'react-native-screens', version: '~4.4.0' }
];

console.log('Atualizando pacotes...');

packagesToUpdate.forEach(pkg => {
  console.log(`Atualizando ${pkg.name} para a versão ${pkg.version}`);
  try {
    execSync(`npx expo install ${pkg.name}@${pkg.version}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Erro ao atualizar ${pkg.name}:`, error.message);
  }
});

console.log('Atualização concluída. Por favor, execute: npx expo start --clear');
