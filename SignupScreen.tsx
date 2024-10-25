import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

interface SignupScreenProps {
    onSignup: (data: { nome: string, dataNascimento: string, cpf: string, sexo: string, empresa: string }) => void;
    onGoBack: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({onGoBack }) => {
    const [nome, setNome] = React.useState('');
    const [cpf, setCpf] = React.useState('');
    const [empresa, setEmpresa] = React.useState('');

    const formatCpf = (input: string) => {
        const onlyDigits = input.replace(/\D/g, '');
        const limitedInput = onlyDigits.substring(0, 11);
        if (limitedInput.length <= 3) return limitedInput;
        if (limitedInput.length <= 5) return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3)}`;
        if (limitedInput.length <= 8) return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3, 5)}.${limitedInput.slice(5)}`;
        return `${limitedInput.slice(0, 3)}.${limitedInput.slice(3, 6)}.${limitedInput.slice(6, 9)}-${limitedInput.slice(9, 11)}`;
    };

    const handleSignup = () => {
        const data = { nome, cpf, empresa };
        console.log('Cadastro:', data);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={onGoBack}>
                <Icon 
                    name="arrow-back" 
                    size={30} 
                    color="#fff"/>
            </TouchableOpacity>

            <Image
                source={require('./assets/logoCreare.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#fff"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="#fff"
                value={cpf}
                onChangeText={(text) => setCpf(formatCpf(text))}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Empresa"
                placeholderTextColor="#fff"
                value={empresa}
                onChangeText={setEmpresa}
            />
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignup}>
                <Text 
                    style={styles.buttonText}>Cadastrar
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
    image: {
        width           : 100,
        height          : 100,
        marginBottom    : 20,
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
        marginTop       : 60,
    },
    backButton: {
        position        : 'absolute',
        top             : 40,
        left            : 20,
        zIndex          : 1,
        backgroundColor : '#FF6060',
        justifyContent  : 'center',
        alignItems      : 'center',
        width           : 40,
        height          : 40,
        borderRadius    : 25,

    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
