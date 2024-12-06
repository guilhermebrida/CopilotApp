import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon from 'react-native-vector-icons/Ionicons'; 

interface LoginScreenProps {
    onLogin: (user: string) => void;
    onSignup: () => void;
}



const formatCpf = (input: string) => {
    const onlyDigits = input.replace(/\D/g, '');
    const limitedInput = onlyDigits.substring(0, 11);
    if (limitedInput.length <= 3) return limitedInput;
    if (limitedInput.length <= 5) return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3)}`;
    if (limitedInput.length <= 8) return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3, 5)}.${limitedInput.slice(5)}`;
    return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3, 6)}.${limitedInput.slice(6, 9)}-${limitedInput.slice(9, 11)}`;
};



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
                onLogin(cpf);
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
                source      = {require('./assets/logoCreare.png')}
                style       = {styles.image}
                resizeMode  = "contain"
            />
            <TextInput
                style                   = {styles.input}
                placeholder             = "CPF"
                placeholderTextColor    = "#fff"
                value                   = {cpf}
                onChangeText            = {(text) => setCpf(formatCpf(text))}
                keyboardType            = "numeric"
            />
            <TouchableOpacity 
                style={styles.button}
                onPress={handleLogin}>
                    <Text 
                        style={styles.buttonText}>Entrar
                    </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.biometri} 
                onPress={authenticateWithBiometrics}>
                    <Icon name="finger-print" size={30} color="#fff"/>  
            </TouchableOpacity> 

            <TouchableOpacity 
                style={styles.signupButton} 
                onPress={onSignup}>
                <Text 
                    style={styles.buttonRegister}>Cadastrar
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex            : 1,
        backgroundColor : '#343434',
        justifyContent  : 'center',
        alignItems      : 'center',
        padding         : 16,
    },
    input: {
        height              : 50,
        width               : '80%',
        borderColor         : '#fff',
        borderWidth         : 1,
        borderRadius        : 5,
        paddingHorizontal   : 7,
        color               : '#fff',
        marginBottom        : 20,
    },
    button: {
        backgroundColor : '#FF6060',
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : 50,
        width           : '80%',
        borderRadius    : 5,
        marginBottom    : 10,
    },
    signupButton: {
        backgroundColor : '#FFF',
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : 50,
        width           : '80%',
        borderRadius    : 5,
        marginBottom    : 10,
        marginTop       : 60,
    },
    biometri: {
        backgroundColor : '#FF6060',
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : 50,
        width           : '80%',
        borderRadius    : 5,
        marginTop       : 10,
        marginBottom    : 100,
    },
    buttonText: {
        color       : '#fff',
        fontSize    : 18,
        fontWeight  : 'bold',
    },
    buttonRegister: {
        color       : '#FF6060',
        fontSize    : 18,
        fontWeight  : 'bold',
    },

    image: {
        width           : '80%',
        height          : 100,
        marginBottom    : 30,
    },
});

export default LoginScreen;
