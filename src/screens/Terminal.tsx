// Terminal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';


const Terminal = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);

  const sendCommand = () => {

    console.log(`Comando enviado: ${command}`);
    

    const response = `Resposta para: ${command}`; 
    setOutput(prevOutput => [...prevOutput, `> ${command}`, response]);
    
    setCommand(''); // Limpa o campo de entrada
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.outputContainer}>
        {output.map((line, index) => (
          <Text key={index} style={styles.outputText}>{line}</Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={command}
        onChangeText={setCommand}
        placeholder="Digite um comando"
      />
      <Button title="Enviar" onPress={sendCommand} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  outputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  outputText: {
    fontFamily: 'monospace',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default Terminal;