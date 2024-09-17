import React, { useState } from "react";
import { Button, Alert } from "antd";
import { Lucid, Blockfrost } from "lucid-cardano";

const lucid = await Lucid.new(
    new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        "preprodKd0Kgt9gHYFt62L1Ofk7kVNle77tKAzW"
    ),
    "Preprod"
);

function ConnectCardanoLucidWallet() {
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    let api, walletApi, enableWallet;

    const WalletConnect = async (walletName) => {
        try {
            if (walletName === "nami") {
                enableWallet = window.cardano.nami;
            }
            if (walletName === "yoroi") {
                enableWallet = window.cardano.yoroi;
            }
            if (window.cardano && enableWallet) {
                console.log("Here");
                api = await enableWallet.enable().catch((e) => {
                    setIsError(true);
                    setErrorMessage("Please give access to use wallet!");
                    return;
                });
            } else {
                setIsError(true);
                setErrorMessage("Please get the wallet extension!");
                return;
            }
            walletApi = lucid.selectWallet(api);
            console.log("Wallet API : ", walletApi);
            if (api) {
                let apiNetwork = await walletApi.network;
                if (apiNetwork !== "Preprod") {
                    setIsError(true);
                    setErrorMessage("Please connect to preview testnet!");
                    return;
                }

                const address = await walletApi.wallet.address();
                setAddress(address);

                let value = await walletApi.wallet.getUtxos();
                console.log(value[0].assets.lovelace);
                value = Number(value[0].assets.lovelace);
                value = value / 1000000;
                setBalance(value);

                // const tx = await lucid.newTx()
                //     .payToAddress("addr_test1qq6p3958e6jxw6xmxt5qdmyztfarck7q2hae6f9t56mtau000ucwyfzu4usecfhha408ehcfjejpeqky2p7n9qn75uuqlylzkj", { lovelace: 5000000n })
                //     .complete();

                // console.log("Transaction Object : ", tx);

                // const signedTx = await tx.sign().complete();

                // const txHash = await signedTx.submit();

                // console.log(txHash);

                setIsLogin(true);
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage("Please get the wallet extension!");
            console.log(error.message);
            return;
        }
    };

    return (
        <div>
            {isError && (
                <Alert
                    message="Info Text"
                    description={errorMessage}
                    type="info"
                    showIcon
                    closable
                    onClose={(onClick) => setIsError(false)}
                />
            )}
            {isLogin ? (
                <div>
                    <h1>You are logged in !</h1>
                    <h2>Address : {address}</h2>
                    <h2>Balance : {balance} Ada</h2>
                </div>
            ) : (
                <div>
                    <div style={{ padding: "10px" }}>
                        <Button type="primary" onClick={() => WalletConnect("nami")}>
                            Login with lucid nami
                        </Button>
                    </div>
                    <div style={{ padding: "10px" }}>
                        <Button type="primary" onClick={() => WalletConnect("yoroi")}>
                            Login with lucid yoroi
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConnectCardanoLucidWallet;
