/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
// import BluetoothClassic from 'react-native-bluetooth-classic';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const UUID_SERVICE = "0000ffff-0000-1000-8000-00805f9b34fb";
const UUID_CHARACTERISTIC = "0000ff01-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  copilotAnswer: String;
  sendCommandToDevice(device:Device, command:String): Promise<void>;
  receiveData(device:Device):Promise<void>;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager =  useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [copilotAnswer, setCopilotAnswer] = useState<String>('');

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    console.log('Iniciando escaneamento de dispositivos...');
    // const devices = BluetoothClassic.list();
    // console.log(devices);
    bleManager.startDeviceScan(null, null, (error, device) => {

      if (error) {
        console.log('Erro no escaneamento:', error);
        return;
      }
      
      if (device && device.name?.includes("VIRTEC")) {
        console.log('Dispositivo encontrado:', device.name);
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log(`Conectando ao dispositivo ${device.name || device.id}...`);
    
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
  
    
      const services = await deviceConnection.discoverAllServicesAndCharacteristics();
    
      const discoveredServices = await deviceConnection.services();
      console.log("Serviços descobertos:", discoveredServices);
  
      for (const service of discoveredServices) {
        const characteristics = await service.characteristics();
        console.log(`Serviço UUID: ${service.uuid}`);
  
        for (const characteristic of characteristics) {
          console.log(` - Característica UUID: ${characteristic.uuid}`);
        }
      }
  
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
  
    } catch (e) {
      console.log("Falha ao conectar ou descobrir características:", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setCopilotAnswer('');
    }
  };

  const onCopilotAnswerUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log('onCopilotAnswerUpdate',error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    console.log('recebendo dados')

    const rawData = base64.decode(characteristic.value);
    console.log(rawData);

    // if (rawData.includes('RVR')){
    //   sendCommandToDevice(device)
    // }

    setCopilotAnswer(rawData);
  };

  const sendCommandToDevice = async (device: Device, command:string) => {
    try {
      await device.writeCharacteristicWithResponseForService(
        UUID_SERVICE,
        UUID_CHARACTERISTIC,
        base64.encode(command)
      );
      console.log("Comando enviado com sucesso!");
    } catch (e) {
      console.log("Erro ao enviar comando:", e);
    }
  };


  const receiveData = async (device:Device) =>{
      console.log(device.name);
      device.monitorCharacteristicForService(
        UUID_SERVICE,
        UUID_CHARACTERISTIC,
        onCopilotAnswerUpdate
      );
  }


  const startStreamingData = async (device: Device) => {
    if (device) {
      console.log(device.name);
      await sendCommandToDevice(device, ">QRU00<");
      device.monitorCharacteristicForService(
        UUID_SERVICE,
        UUID_CHARACTERISTIC,
        onCopilotAnswerUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    copilotAnswer,
    sendCommandToDevice,
    receiveData
  };
}

export default useBLE;
