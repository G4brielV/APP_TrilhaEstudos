import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { AuthService } from '../src/services/auth';
import { THEME } from '../src/theme/colors';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  // Redireciona com base na existência de um token salvo
  if (isAuthenticated) {
    return <Redirect href={"/(app)" as any} />;
  }

  return <Redirect href={"/(auth)/login" as any} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
});