import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
const Buffer = require("buffer").Buffer;


const FetchAPI = () => {
    const URL_API_TOKEN     = 'https://openid-provider.crearecloud.com.br/auth/v1/token?lang=pt-BR'
    const URL_API_FROTA     = 'https://api.crearecloud.com.br/frotalog/basic-services/v3'
    const API_CLIENT_ID     = '39347'
    const API_CLIENT_SECRET = 'R@39347'


    const [token,         setToken        ] = useState('')
    const [vehiclePlates, setVehiclePlates] = useState([]);

    const getCredentialToken = async () => {
      console.log('getCredentialToken');
      try {
        const response = await fetch(URL_API_TOKEN,{
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

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }

        const result = await response.json();
        console.log(result);
        console.log(`getCredentialToken -> ${result['id_token']}`);
        setToken(result.id_token);
        return result.id_token; 

      } catch (error) {
        console.error(error);
      } 
    };

    const getFrotaVehicles = async () => {
      console.log('getFrotaVehicles');
      try{
        // const response = await fetch(`${URL_API_FROTA}/vehicles?recursive=true&customerId=1`,{
        const response = await fetch('https://api.crearecloud.com.br/frotalog/basic-services/v3/vehicles/578419',{
        // const response = await fetch('https://api.crearecloud.com.br/frotalog/basic-services/v3/vehicles?recursive=true&customerId=1',{
        // const response = await fetch('https://api.crearecloud.com.br/frotalog/basic-services/v3/drivers',{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        // if (!response.ok) {
        //   console.error(`HTTP error! Status: ${response.status}`);
        //   return;
        // }
        
  
        const result = await response.json();
        console.log(JSON.stringify(result, null, 2));
      }
      catch (error) {
        console.error(error);
      } 

    }



    return {
      getCredentialToken,
      getFrotaVehicles,
      token
    }


}


export default FetchAPI