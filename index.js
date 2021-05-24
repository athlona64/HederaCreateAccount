const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, Mnemonic} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    //กระเป๋าที่มี hbar สำรหับเอาไว้เปิดกระเป๋าให้กับคนใหม่
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    //เลือก network testnet/mainnet
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    // const newAccountPrivateKey = await PrivateKey.generate(); 

    //สร้าง 24 คำมาใหม่แบบ random
    const generateMnemonic = await Mnemonic.generate();
    console.log('generate random mnemonic24 ' + generateMnemonic);

    //สร้าง 12 คำมาใหหม่แบบ random
    const generateMnemonic12 = await Mnemonic.generate12();
    console.log('generate random mnemonic12 ' + generateMnemonic12);

    //ใช้ seed 24 words ที่มีอยู่แล้ว หรือ 12 คำก็ได้
    const mnemonicFix = 'field identify eager kite mesh frame cheap pilot few globe tail put';
  	console.log('seed 24 words : ' + mnemonicFix);


  	//เอา 24 คำมาสร้าง private key
    const newAccountPrivateKey = await PrivateKey.fromMnemonic(generateMnemonic); 
    
    console.log('privatekey : ' + newAccountPrivateKey.toString());
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    console.log('publickey : ' + newAccountPublicKey.toString());
    //Create a new account with 1,000 tinybar starting balance
    //สร้างกระเป๋าใหม่ และเปิดกระเป๋าด้วย hbar 1000tinybard (หน่วยเล็ก ๆ)
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    //รับเลข id account ใหม่นี้
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    //ตรวจยอด hbar
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

}
main();