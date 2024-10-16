import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image } from 'react-native';

interface LoginScreenProps {
    onLogin: (user:String) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [cpf, setCpf] = React.useState('');

    const handleLogin = () => {
        console.log('CPF:', cpf);
        onLogin(cpf);
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
            {/* Contêiner para os botões Biometria e Facial lado a lado */}
            <View style={styles.buttonRow}>
                {/* Botão de Biometria */}
                {/* <TouchableOpacity style={styles.biometri} onPress={handleLogin}>
                    <Image
                        source={require('./assets/biometria.png')}
                        style={styles.imageb}
                    />
                </TouchableOpacity> */}
                {/* Botão Facial */}
                {/* <TouchableOpacity style={styles.facial} onPress={handleLogin}>
                    <Image
                        source={require('./assets/facial.png')}
                        style={styles.imagef}
                    />
                </TouchableOpacity> */}
            </View>
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
    buttonRow: {
        flexDirection: 'row', // Alinha os botões lado a lado
        width: '80%', // Largura do contêiner
        justifyContent: 'center', // Espaçamento entre os botões
    },
    biometri: {
        backgroundColor: '#FF6060',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%',
        width: '25%',
        borderRadius: 5,
    },
    facial: {
        backgroundColor: '#FF6060',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%',
        width: '25%',
        borderRadius: 5,
        marginLeft: 10, // Espaçamento entre os botões
    },
    imageb: {
        width: '70%', // Ajuste conforme necessário
        height: '70%', // Ajuste conforme necessário
        resizeMode: 'contain', // Mantém a proporção da imagem
    },
    imagef: {
        width: '70%', // Ajuste conforme necessário
        height: '70%', // Ajuste conforme necessário
        resizeMode: 'contain', // Mantém a proporção da imagem
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
