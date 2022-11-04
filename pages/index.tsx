import * as web3 from '@solana/web3.js'
import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [isExecutable, setIsExecutable] = useState(false);

  const addressSubmittedHandler = (address: string) => {
    // first thing we wanna do here is convert the address from string to public key. Remember - the address isn't actually a string, we just represent it as one in JS.
    try{
    const key=new web3.PublicKey(address);
    // We're setting the address with key.toBase58. This is the encoding of Solana addresses as strings
    setAddress(key.toBase58())
    // to use the key, we'll make a new connection to the JSON RPC. With the connection, we'll use the getBalance function and set the result with setBalance
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    // We're converting the balance from Lamports to SOL - the balance is returned in Lamports, not SOL.
    connection.getBalance(key).then(balance => {
      setBalance(balance / web3.LAMPORTS_PER_SOL)
    })
    connection.getAccountInfo(key).then(accountInfo => {
      setIsExecutable(accountInfo?.executable ?? false);
    })

  } catch (error){
    setAddress('')
      setBalance(0)
      alert(error)
  }
 }

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is it executable? ${isExecutable ? 'Yes' : 'No'}`}</p>
      </header>
    </div>
  )
}

export default Home
