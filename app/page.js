'use client';
import Image from 'next/image'
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import PartisiaSdk from 'partisia-sdk';

export default function Home() {
  const sdk = new PartisiaSdk();  

  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState();
  const [score, setScore] = useState();
  const [connected, setConnected] = useState(false);

  //const [connectStatus, setconnectStatus] = useState("");

  const { unityProvider, sendMessage, addEventListener, removeEventListener} = useUnityContext({
    loaderUrl: "build/PartisiaRunner.loader.js",
    dataUrl: "build/PartisiaRunner.data",
    frameworkUrl: "build/PartisiaRunner.framework.js",
    codeUrl: "build/PartisiaRunner.wasm",
  });


 

  //Unity2React Messages
  const handleGameOver = useCallback((userName, score) => {
    setIsGameOver(true);
    setUserName(userName);
    setScore(score);
  }, []);
  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);


  const handleConnectWallet = useCallback(() => {
    console.log("Handling wallet connection");
    handleWalletConnection();
  }, []);
  useEffect(() => {
    addEventListener("ConnectWallet", handleConnectWallet);
    return () => {
      removeEventListener("ConnectWallet", handleConnectWallet);
    };
  }, [addEventListener, removeEventListener, handleConnectWallet]);

  async function handleWalletConnection(){       
    const res = await sdk.connect({
    chainId: 'Partisia Blockchain',
    permissions: ['sign'],
    dappName: 'Partisia Runner',
    }
    ).then(()=>{
      console.log(sdk.isConnected);
      console.log(sdk.connection?.account.address);
      sendDataToUnity("PartisiaManager","SuccessConnection",sdk.connection?.account.address);
      setConnected(true);
      
    },()=>{
      console.log(sdk.isConnected);
      console.log("Rejected!");
      sendDataToUnity("PartisiaManager","RejectConnection","");
      setConnected(false);
    })
    
  };
  //React2Unity Messages 
  function sendDataToUnity(gameobject,method,message)
  {
    if(unityProvider)
    sendMessage(gameobject,method,message);    
  }

  return (
    <main >
      <Fragment>
          <div>
            <Unity
            unityProvider={unityProvider}
            style={{width: '100%',height: '100%', justifySelf: 'center' }}
            />          
            <div className=" relative bottom-[150px] place-self-center m-auto text-center">
            {connected ? <p></p>: 
            <button className="m-auto align-middle justify-self-center text-center font-bold text-3xl" onClick={handleWalletConnection}>
            Play
            </button>
            }                
            </div>
          </div>
        </Fragment>      w
    </main>
  );
}
