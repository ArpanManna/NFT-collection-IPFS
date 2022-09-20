return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="VI punks Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <div className={styles.main}>
       <div>
        <img className={styles.image} src="./home.jpeg" />
      </div>
      <div>
      <h1 className={styles.title}>Welcome to VI Punks!</h1>
      <div className={styles.description}>
        Its a unique collection of {totalSupply} VI NFTs 
      </div>
      <div className={styles.description}>
        {tokenMinted}/{totalSupply} NFTs have been minted
      </div>
      {renderConnectButton()}
      
      {renderMint()}
    </div>
      <div>
        <button onClick={getURI} className={styles.button}>TokenURI</button>
        Minted NFT details
      </div> 
     </div>
      
      <footer className={styles.footer}>
        Made with &#10084; by Veritas Interactive
      </footer>
    </div>
  )
}