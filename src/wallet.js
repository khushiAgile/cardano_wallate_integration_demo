import React, { useState } from 'react';
import { Button, Alert } from 'antd';
import {Address, Value} from '@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.js';



function ConnectCardanoWallet() {

    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    let api,wallet;

    const WalletConnect = async (walletName) => {
        try{     
            if(walletName === "nami"){
                wallet = window.cardano.nami;
            }  
            if(walletName === "yoroi"){
                wallet = window.cardano.yoroi;
            }
            if (window.cardano && wallet){
                console.log("Here")
                api = await wallet.enable().catch((e) => {
                    setIsError(true);
                    setErrorMessage("Please give access to use wallet!");
                    return
                })
            } else {
                setIsError(true);
                setErrorMessage("Please get the wallet extension!");
                return
            }
            if (api) {
                let apiNetwork = await api.getNetworkId()
                console.log("API : ", api);
                if (apiNetwork !== 0) {
                    setIsError(true);
                    setErrorMessage("Please connect to preview testnet!");
                    return
                }

                const add = (await api.getUsedAddresses())[0];                 
                const bech32Address = Address.from_hex(add).to_bech32();
                setAddress(bech32Address);

                let value = await api.getBalance()
                value = Value.from_hex(value).to_js_value();
                value = value.coin / 1000000;
                setBalance(value);

                setIsLogin(true);


            } 
        }
        catch(error){
            setIsError(true);
            setErrorMessage("Please get the wallet extension!");
            console.log(error.message);
            return
        }
    }

    return (
        <div>
            {isError === true && (
                <Alert
                message="Info Text"
                description= {errorMessage} 
                type="info"
                showIcon
                closable
                onClose={(onClick) => setIsError(false)}
                />
            )}
            {isLogin === true && (
                <div>  
                    <h1>You are logged in !</h1>
                    <h2>Address : {address}</h2>
                    <h2>Balance : {balance} Ada</h2>
                </div>
                
            )}
            {isLogin === false && (
                <div> 
                    <div style={{padding : "10px"}}>
                        <Button type='primary' onClick={() => WalletConnect("nami")}>Login with nami wallet</Button>
                    </div>
                    <div style={{padding : "10px"}}>
                        <Button type='primary' onClick={() => WalletConnect("yoroi")}>Login with yoroi wallet</Button>
                    </div>                                  
                </div>
                
            )}
            
        </div>        
    );
    }


export default ConnectCardanoWallet;