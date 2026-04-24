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

export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nomeFocused, setNomeFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);
  const [confirmarFocused, setConfirmarFocused] = useState(false);

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
      });
      Alert.alert(
        'Conta criada!',
        'Seu cadastro foi realizado com sucesso. Faça login para continuar.',
        [{ text: 'Fazer Login', onPress: () => router.replace('/(auth)/login' as any) }]
      );
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message || 'Não foi possível realizar o cadastro.');
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
          <Text style={styles.appTagline}>Crie sua conta e comece a aprender</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Criar Conta</Text>
          <Text style={styles.formSubtitle}>Preencha os dados para se cadastrar</Text>

          {/* Campo Nome */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome</Text>
            <View style={[
              styles.inputContainer,
              nomeFocused && styles.inputContainerFocused,
            ]}>
              <Feather name="user" size={18} color={nomeFocused ? THEME.primary : THEME.textSecondary} />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor={THEME.textSecondary + '60'}
                autoCapitalize="words"
                onFocus={() => setNomeFocused(true)}
                onBlur={() => setNomeFocused(false)}
              />
            </View>
          </View>

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
                placeholder="Mínimo 6 caracteres"
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

          {/* Campo Confirmar Senha */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={[
              styles.inputContainer,
              confirmarFocused && styles.inputContainerFocused,
            ]}>
              <Feather name="shield" size={18} color={confirmarFocused ? THEME.primary : THEME.textSecondary} />
              <TextInput
                style={styles.input}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Repita sua senha"
                placeholderTextColor={THEME.textSecondary + '60'}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setConfirmarFocused(true)}
                onBlur={() => setConfirmarFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={THEME.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicador de força da senha */}
          {senha.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBars}>
                <View style={[styles.strengthBar, senha.length >= 1 && styles.strengthBarWeak]} />
                <View style={[styles.strengthBar, senha.length >= 4 && styles.strengthBarMedium]} />
                <View style={[styles.strengthBar, senha.length >= 8 && styles.strengthBarStrong]} />
              </View>
              <Text style={styles.strengthText}>
                {senha.length < 4 ? 'Fraca' : senha.length < 8 ? 'Média' : 'Forte'}
              </Text>
            </View>
          )}

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Feather name="user-plus" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>Criar Conta</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Link para Login */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              Já tem conta? <Text style={styles.secondaryButtonHighlight}>Faça login</Text>
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
    marginBottom: 36,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 210, 135, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 135, 0.15)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
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
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 18,
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
    paddingVertical: 15,
    color: THEME.textPrimary,
    fontSize: 16,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  strengthBarWeak: {
    backgroundColor: '#FF6B6B',
  },
  strengthBarMedium: {
    backgroundColor: '#FFB84D',
  },
  strengthBarStrong: {
    backgroundColor: THEME.primary,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textSecondary,
    width: 40,
  },
  submitButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
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
    marginVertical: 24,
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
