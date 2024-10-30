import React, { useState, useEffect }                             from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeviceModal                                                from "./DeviceConnectionModal";
import { PulseIndicator }                                         from "./PulseIndicator";
import useBLE                                                     from "./useBLE";
import LoginScreen                                                from "./login";
import { setupDatabase, insertUser, getUsers, getUserByCPF }      from './db';
import SignupScreen                                               from './SignupScreen'; 
import Icon                                                       from 'react-native-vector-icons/Ionicons'; 
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


  const {getCredentialToken, getFrotaVehicles, token} = FetchAPI()
  
  const [isModalVisible,  setIsModalVisible ] = useState<boolean>(false);
  const [isLoggedIn,      setIsLoggedIn     ] = useState<boolean>(false);
  const [users,           setUsers          ] = useState<String>('');
  const [retornoSelect,   setRetornoSelect  ] = useState<any[]>([]);
  const [showSignup,      setShowSignup     ] = useState(false); 
  const [token2,          setToken          ] = useState('');
  const [showTerminal,    setShowTerminal   ] = useState(false)

  useEffect(() => {
    setupDatabase();

    const fetchToken = async () => {
      const fetchedToken = await getCredentialToken(); 
      console.log(`Token obtido: ${fetchedToken}`);
      fetchVehicles();
    };
    const fetchVehicles = async () =>{
      const fetchedVehicles = await getFrotaVehicles();
      console.log(`fetchedVehicles: ${fetchedVehicles}`);
    }
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
    if (showSignup) {
        return <SignupScreen onSignup={handleSignup} onGoBack={() => setShowSignup(false)} />;
    }
    return <LoginScreen onLogin={handleLogin} onSignup={() => setShowSignup(true)} />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
          onPress={() => setIsLoggedIn(false)} 
          style={styles.backButton}>
            <Icon 
              name="arrow-back" 
              size={30} 
              color="#fff"/>
        </TouchableOpacity>

      <View 
        style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Anwser</Text>
            <Text style={styles.heartRateText}>{copilotAnswer} </Text>
          </>) : 
            (
          <Text style={styles.heartRateTitleText}>Please Connect to a Copilot</Text>
            )}
      </View>
      {/* <TouchableOpacity
          onPress={() => handleTerminal()}
          style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {"Terminal"}
        </Text>
      </TouchableOpacity> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={connectedDevice ? disconnectFromDevice : openModal}
          style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>
            {connectedDevice ? "Disconnect" : "Connect"}
          </Text>
        </TouchableOpacity>
      </View>

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
    flex            : 1,
    backgroundColor : "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex            : 1,
    justifyContent  : "center",
    alignItems      : "center",
  },
  heartRateTitleText: {
    fontSize          : 30,
    fontWeight        : "bold",
    textAlign         : "center",
    marginHorizontal  : 20,
    color             : "black",
  },
  heartRateText: {
    fontSize  : 25,
    marginTop : 15,
  },
  buttonContainer: {
    flexDirection   : 'row',
    justifyContent  : 'space-around',
    // marginBottom    : 20,
  },
  ctaButton: {
    backgroundColor : "#FF6060",
    justifyContent  : "center",
    alignItems      : "center",
    height          : 50,
    width           : 140,
    borderRadius    : 8,
  },
  ctaButtonText: {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "white",
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
});

export default App;
