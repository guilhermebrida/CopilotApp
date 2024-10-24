import React, { useState, useEffect  } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { PulseIndicator } from "./PulseIndicator";
import useBLE from "./useBLE";
import LoginScreen from "./login";
import { setupDatabase, insertUser, getUsers, getUserByCPF} from './db';
import Terminal from "./terminal";
import FetchAPI from "./api"

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    copilotAnswer,
    disconnectFromDevice,
    sendCommandToDevice,
    receiveData
  } = useBLE();


  const {getCredentialToken, token} = FetchAPI()

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<String>('');
  const [retornoSelect, setRetornoSelect] = useState<any[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [token2, setToken] = useState('');

  useEffect(() => {
    setupDatabase();

    const fetchToken = async () => {
      const fetchedToken = await getCredentialToken(); 
      console.log(`Token obtido: ${fetchedToken}`);
      
    };
    fetchToken();

  }, []);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const sendCommandOnConnection = async () => {
      console.log('sendCommandOnConnection ',copilotAnswer);
      if (connectedDevice && copilotAnswer) {
        try {
          await sleep(2000);
          const command = `>RFID:${users}<`
          await sendCommandToDevice(connectedDevice, command);
          await receiveData(connectedDevice);
          console.log(`Comando ${command} enviado com sucesso`);
        } catch (error) {
          console.error('Erro ao enviar comando:', error);
        }
      }
    };

    sendCommandOnConnection();
  }, [copilotAnswer]);

  const handleInsertUser = () => {
    insertUser('John', 'Doe', '12345678900');
    fetchUsers();
  };

  const fetchUsers = () => {
    getUsers(setRetornoSelect);
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log('iniciando scan');
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

  const handleLogin = (userCPF) => {
    setUsers(userCPF);
    getUserByCPF(userCPF, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      else{
        console.log(userCPF,users);
        insertUser('John', 'Doe', userCPF);
        fetchUsers();
      }
    });
    // setIsLoggedIn(true);
  };

  const handleTerminal = () => {
    console.log('handleTerminal');
    setShowTerminal(true); 
  };

  // const handleBackPress = () => {
  //   if (showTerminal) {
  //     setShowTerminal(false); 
  //     return true; 
  //   }
  //   return false; 
  // };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  //   return () => backHandler.remove();
  // }, [showTerminal]);


  if (showTerminal) {
    return <Terminal />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Anwser</Text>
            <Text style={styles.heartRateText}>{copilotAnswer} </Text>
            {/* <TouchableOpacity onPress={openModal}>
              <Text style={styles.ctaButtonText}>{"QSN"}</Text>
            </TouchableOpacity> */}
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Copilot
          </Text>
        )}
      </View>
      <TouchableOpacity
          onPress={() => handleTerminal()}
          style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {"Terminal"}
        </Text>
      </TouchableOpacity>
      
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
