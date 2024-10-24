import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
const Buffer = require("buffer").Buffer;


const FetchAPI = () => {
    const URL_API_FROTA = 'https://openid-provider.crearecloud.com.br/auth/v1/token?lang=pt-BR'
    const API_CLIENT_ID = '53309'
    const API_CLIENT_SECRET = '7lh3G~qj~4-H'


    const [token, setToken] = useState('')
    const [vehiclePlates, setVehiclePlates] = useState([]);

    const getCredentialToken = async () => {
      console.log('getCredentialToken');
      try {
        const response = await fetch(URL_API_FROTA,{
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${API_CLIENT_ID}:${API_CLIENT_SECRET}`).toString('base64'), 
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                grant_type: 'client_credentials' 
              }),
            }
        );

        const result = await response.json();
        console.log(result);
        console.log(`getCredentialToken -> ${result['id_token']}`);
        setToken(result.id_token);
        return result.id_token; 

      } catch (error) {
        console.error(error);
      } 
    };

    // const getFrotaVehicles = async () => {
    //   console.log('getFrotaVehicles');
    //   try{
    //     const response = await fetch(`${URL_API_FROTA}/vehicles`),{
    //       methods: 'GET',


    //     }

    //   }
    //   catch{

    //   }

    // }



    return {
      getCredentialToken,
      token
    }


}


export default FetchAPI