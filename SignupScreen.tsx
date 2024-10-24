import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SignupScreenProps {
    onSignup: (data: { nome: string, dataNascimento: string, cpf: string, sexo: string, empresa: string }) => void;
    onGoBack: () => void; // Adicione esta prop para lidar com o retorno
}


const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup }) => {
    const [nome, setNome] = React.useState('');
    const [dataNascimento, setDataNascimento] = React.useState('');
    const [cpf, setCpf] = React.useState('');
    const [sexo, setSexo] = React.useState('');
    const [empresa, setEmpresa] = React.useState('');

    const handleSignup = () => {
        const data = { nome, dataNascimento, cpf, sexo, empresa };
        console.log('Cadastro:', data);
        onSignup(data);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#fff"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                placeholderTextColor="#fff"
                value={dataNascimento}
                onChangeText={setDataNascimento}
            />
            <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="#fff"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Sexo"
                placeholderTextColor="#fff"
                value={sexo}
                onChangeText={setSexo}
            />
            <TextInput
                style={styles.input}
                placeholder="Empresa"
                placeholderTextColor="#fff"
                value={empresa}
                onChangeText={setEmpresa}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Cadastrar</Text>
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
