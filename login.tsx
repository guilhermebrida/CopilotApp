import React, { useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

interface LoginScreenProps {
    onLogin: (user: string) => void;
    onSignup: () => void; // Função para navegar para a tela de cadastro
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup }) => {
    const [cpf, setCpf] = React.useState('');

    const handleLogin = () => {
        console.log('CPF:', cpf);
        onLogin(cpf);
    };

    const authenticateWithBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate with Biometrics',
                fallbackLabel: 'Use Password',
            });

            if (result.success) {
                console.log('Biometric authentication successful');
                onLogin(cpf); // Chama a função de login após autenticação bem-sucedida
            } else {
                Alert.alert('Authentication failed', 'Please try again.');
            }
        } else {
            Alert.alert('Biometric authentication not available', 'Please enroll your biometrics or use another method.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('./assets/logoCreare.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <TextInput
                style={styles.input}
                placeholder="Digite seu CPF"
                placeholderTextColor="#fff"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
            />
            {/* Botão de Login */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            
            {/* Botão de Cadastro */}
            <TouchableOpacity style={styles.signupButton} onPress={onSignup}>
                <Text style={styles.buttonText}>Cadastrar-se</Text>
            </TouchableOpacity>

            {/* Botão de Biometria */}
            <TouchableOpacity style={styles.biometri} onPress={authenticateWithBiometrics}>
                <Text style={styles.buttonText}>Login com Biometria</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#343434',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        height: 50,
        width: '80%',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 7,
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF6060',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50, // Mantenha uma altura fixa
        width: '80%',
        borderRadius: 5,
        marginBottom: 10,
    },
    signupButton: {
        backgroundColor: '#FF6060',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50, // Mantenha uma altura fixa
        width: '80%',
        borderRadius: 5,
        marginBottom: 10,
    },
    biometri: {
        backgroundColor: '#FF6060',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '80%',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '80%',
        height: 100,
        marginBottom: 30,
    },
});

export default LoginScreen;
