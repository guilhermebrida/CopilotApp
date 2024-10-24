import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { PulseIndicator } from "./PulseIndicator";
import useBLE from "./useBLE";
import LoginScreen from "./login";
import { setupDatabase, insertUser, getUsers, getUserByCPF } from './db';
import SignupScreen from './SignupScreen'; // Tela de cadastro

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    sendCommandToDevice
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<String>('');
  const [retornoSelect, setRetornoSelect] = useState<any[]>([]);
  const [showSignup, setShowSignup] = useState(false); // Estado para alternar telas

  useEffect(() => {
    setupDatabase();
  }, []);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const sendCommandOnConnection = async () => {
      if (connectedDevice && heartRate) {
        try {
          await sleep(2000);
          const command = `>RFID:${users}11111<`
          await sendCommandToDevice(connectedDevice, command);
          console.log(`Comando ${command} enviado com sucesso`);
        } catch (error) {
          console.error('Erro ao enviar comando:', error);
        }
      }
    };

    sendCommandOnConnection();
  }, [heartRate]);

  const handleLogin = (userCPF) => {
    setUsers(userCPF);
    getUserByCPF(userCPF, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        insertUser('John', 'Doe', userCPF);
        fetchUsers();
      }
    });
  };

  const handleSignup = (userData) => {
    const { nome, dataNascimento, cpf } = userData;
    insertUser(nome, dataNascimento, cpf);
    setShowSignup(false); 
};


  const fetchUsers = () => {
    getUsers(setRetornoSelect);
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  // Verifica qual tela exibir
  if (!isLoggedIn) {
    if (showSignup) {
      return <SignupScreen onSignup={handleSignup} onGoBack={() => setShowSignup(false)} />;
    }
    return <LoginScreen onLogin={handleLogin} onSignup={() => setShowSignup(true)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Anwser</Text>
            <Text style={styles.heartRateText}>{heartRate} </Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>Please Connect to a Copilot</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
