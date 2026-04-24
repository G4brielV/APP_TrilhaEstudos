import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../src/theme/colors';
import { AuthService } from '../../src/services/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({
        email: email.trim().toLowerCase(),
        senha: senha,
      });
      // Login bem-sucedido — navegar para a tela principal
      router.replace('/(app)' as any);
    } catch (error: any) {
      Alert.alert('Erro no login', error.message || 'Não foi possível realizar o login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo & Branding */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>TrilhaEstudos</Text>
          <Text style={styles.appTagline}>Organize sua jornada de aprendizado</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>Acesse sua conta para continuar</Text>

          {/* Campo E-mail */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused,
            ]}>
              <Feather name="mail" size={18} color={emailFocused ? THEME.primary : THEME.textSecondary} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={THEME.textSecondary + '60'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={[
              styles.inputContainer,
              senhaFocused && styles.inputContainerFocused,
            ]}>
              <Feather name="lock" size={18} color={senhaFocused ? THEME.primary : THEME.textSecondary} />
              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="Sua senha"
                placeholderTextColor={THEME.textSecondary + '60'}
                secureTextEntry={!showPassword}
                onFocus={() => setSenhaFocused(true)}
                onBlur={() => setSenhaFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={THEME.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Feather name="log-in" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>Entrar</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Link para Cadastro */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/register' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              Não tem conta? <Text style={styles.secondaryButtonHighlight}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 210, 135, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 135, 0.15)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appTagline: {
    fontSize: 15,
    color: THEME.textSecondary,
    letterSpacing: 0.2,
  },
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: 28,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
  inputContainerFocused: {
    borderColor: THEME.primary + '60',
    backgroundColor: THEME.surface + 'F0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: THEME.textPrimary,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  separatorText: {
    color: THEME.textSecondary,
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: THEME.textSecondary,
    fontSize: 15,
  },
  secondaryButtonHighlight: {
    color: THEME.primary,
    fontWeight: '700',
  },
});
