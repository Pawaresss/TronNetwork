const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const cors = require('cors');
const bs58 = require('bs58');
const TronWeb = require('tronweb');

app.use(cors());

const fullNode = ('https://nile.trongrid.io/wallet/');
const solidityNode = ('https://nile.trongrid.io/walletsolidity/');
const eventServer = 'https://nile.trongrid.io/';
const jsonrpc = 'https://nile.trongrid.io/jsonrpc/';

const privateKey = 'c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3';
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, jsonrpc, privateKey);



//*********************************************************************************************************** */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wallet_db'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

db.query(`CREATE TABLE IF NOT EXISTS wallet_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  privateKey VARCHAR(255) NOT NULL
)`, (err, result) => {
  if (err) {
    throw err;
  }
  console.log('Table created or already exists');
});

app.get('/create-wallet', (req, res) => {
  const newPrivateKey = generateRandomPrivateKey();
  const newAddress = tronWeb.address.fromPrivateKey(newPrivateKey);

  const sql = 'INSERT INTO wallet_addresses (address, privateKey) VALUES (?, ?)';
  db.query(sql, [newAddress, newPrivateKey], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error creating wallet address' });
    } else {
      console.log('Wallet Address and PrivateKey created and saved to database');
      res.status(200).send({ message: 'Wallet Address created', address: newAddress, privateKey: newPrivateKey });
    }
  });
});

// เพิ่มส่วนดึงข้อมูลบัญชีอื่น ๆ และการส่งเหรียญไปยังบัญชีอื่น ๆ ตรงนี้
// ตัวอย่างการดึงข้อมูลบัญชีโดยใช้ที่อยู่
app.get('/get-account-address/:address', (req, res) => {
    const address = req.params.address;
  
    // ดึงข้อมูลบัญชีจาก TronWeb โดยใช้ address
    tronWeb.trx.getAccount(address).then((account) => {
      if (account) {
        // ส่งข้อมูลบัญชีกลับไปยังเบราว์เซอร์
        res.status(200).json({ account });
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    }).catch((error) => {
      console.error('Error fetching account:', error);
      res.status(500).json({ error: 'Error fetching account' });
    });
  });
  
  // ตัวอย่างการส่ง TRX ไปยังบัญชีอื่น
  app.post('/send-trx', (req, res) => {
    const { from, to, amount } = req.body; // รับข้อมูลจากคำขอ POST
  
    // ทำการส่ง TRX ไปยังบัญชีอื่นโดยใช้ TronWeb
    tronWeb.trx.sendTransaction(to, amount, from).then((response) => {
      console.log('Transaction response:', response);
      res.status(200).json({ message: 'Transaction successful', transaction: response });
    }).catch((error) => {
      console.error('Error sending TRX:', error);
      res.status(500).json({ error: 'Error sending TRX' });
    });
  });
  

// เพิ่มส่วนดึงข้อมูลบัญชีอื่น ๆ และการส่งเหรียญไปยังบัญชีอื่น ๆ ตรงนี้

app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});

function generateRandomPrivateKey() {
    const characters = 'abcdef0123456789';
    let privateKey = '';
    for (let i = 0; i < 64; i++) {
      privateKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return privateKey;
  }
  

  // app.post('/sendCoins', async (req, res) => {
  //   try {
  //     // ตรวจสอบว่ามี private key ที่ถูกต้อง
  //     if (!req.body.privateKey) {
  //       return res.status(400).json({ error: 'Private key is required' });
  //     }
  
  //     // ดึง private key จากข้อมูลที่ส่งมา
  //     const privateKey = req.body.privateKey;
  
  //     // ตรวจสอบว่า private key ถูกต้องตามรูปแบบของ Tron
  //     if (!TronWeb.isAddress(privateKey)) {
  //       return res.status(400).json({ error: 'Invalid private key' });
  //     }
  
  //     // ตรวจสอบความถูกต้องของ toAddress และ fromAddress ตามที่คุณต้องการ
  //     const toAddress = req.body.toAddress;
  //     const fromAddress = req.body.fromAddress;
  
  //     if (!TronWeb.isAddress(toAddress) || !TronWeb.isAddress(fromAddress)) {
  //       return res.status(400).json({ error: 'Invalid address' });
  //     }
  
  //     const trxAmount = tronWeb.toSun(parseFloat(req.body.amount));
  //     const tx = await tronWeb.transactionBuilder.sendTrx(
  //       toAddress,
  //       trxAmount,
  //       fromAddress
  //     );
  
  //     console.log('Transaction:', tx);
  
  //     // ส่งข้อมูลธุรกรรมกลับเป็น JSON response
  //     res.json({ transaction: tx });
  //   } catch (error) {
  //     console.error('Error sending transaction:', error);
  //     res.status(500).json({ error: 'Error sending transaction' });
  //   }
  // });



// async function sendTransaction() {
//   const client = new TronWeb({
//     fullHost: "https://nile.trongrid.io", // Use the Shasta testnet
//     privateKey: "c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3" // Add your private key here
//   });

//   // Create source and destination accounts
//   const fromAccount = client.address.fromPrivateKey("TXXjJcQBc16b5JwVz42DesqLgmko7XLMnM");
//   const toAccount = "TATj6z8xKChiqgUUaH3AXq6VwAvnUQ5S9q";

//   // Build a transaction
//   const tx = await client.transactionBuilder.sendTrx(
//     toAccount,
//     5 * 1e6 // Sending 1 TRX (1 TRX = 1,000,000 Sun)
//   );

//   // Sign the transaction
//   const signedTx = await client.trx.sign(tx);

//   // Send the transaction
//   const receipt = await client.trx.sendRawTransaction(signedTx);

//   // Check the result
//   console.log(receipt);
// }



// สร้างเส้นทาง API POST สำหรับการส่งธุรกรรม TRX
app.post('/send-trx-transaction', async (req, res) => {
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io', // เปลี่ยนเป็นโฮสต์ที่คุณต้องการใช้
    privateKey: 'c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3' // เพิ่มคีย์ส่วนตัวของคุณที่นี่
  });
  try {
    // Create source and destination accounts
    const fromAccount = tronWeb.address.fromPrivateKey('TATj6z8xKChiqgUUaH3AXq6VwAvnUQ5S9q');
    const toAccount = 'TATj6z8xKChiqgUUaH3AXq6VwAvnUQ5S9q';

    // Build a transaction
    const tx = await tronWeb.transactionBuilder.sendTrx(
      toAccount,
      10 * 1e6 // Sending 5 TRX (1 TRX = 1,000,000 Sun)
    );

    // Sign the transaction
    const signedTx = await tronWeb.trx.sign(tx);

    // Send the transaction
    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

    // ส่งข้อมูลการทำธุรกรรมกลับเป็น JSON
    res.json({ transaction: receipt });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    // ส่งข้อผิดพลาดกลับเป็น JSON
    res.status(500).json({ error: error.message });
  }
});

// async function sendTransaction() {
//   const client = new TronWeb({
//     fullHost: "https://nile.trongrid.io", // Use the Shasta testnet
//     privateKey: "c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3" // Add your private key here
//   });

//   // Create source and destination accounts
//   const fromAccount = client.address.fromPrivateKey("TXXjJcQBc16b5JwVz42DesqLgmko7XLMnM");
//   const toAccount = "TATj6z8xKChiqgUUaH3AXq6VwAvnUQ5S9q";

//   // Specify the token contract address (replace with the actual contract address)
//   const tokenContractAddress = "TDP3NSMeLXwmzE7F4iU2Z9pZSf8M6v2aZV";

//   // Specify the amount of tokens you want to send
//   const tokenAmount = 100000000; // Replace with the amount you want to send

//   // Build a transaction to send tokens
//   const tx = await client.transactionBuilder.sendToken(
//     toAccount,
//     tokenAmount,
//     tokenContractAddress
//   );
 
  
//   // Sign the transaction
//   const signedTx = await client.trx.sign(tx);

//   // Send the transaction
//   const receipt = await client.trx.sendRawTransaction(signedTx);

//   // Check the result
//   console.log(receipt);
// }


// // Call the async function
// sendTransaction();


// async function sendTRC20Transaction() {
//   try {
//     const client = new TronWeb({
//       fullHost: "https://nile.trongrid.io",
//       privateKey: 'c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3',
//     });

//     const fromAddress = 'TXXjJcQBc16b5JwVz42DesqLgmko7XLMnM';
//     const toAddress = 'TTh1tfp2DJjMGtPotvm5BAMjmv6qQtLS6f';
//     const contractAddress = 'TDbNcoY2BeUPDr31trZGvGcq1jpSNaurF3'; // ที่อยู่ของสัญญา TRC20
//     const amount = 1; // จำนวนเหรียญที่คุณต้องการโอน

//     // ใช้ TronWeb ในการโหลด ABI ของสัญญา TRC20
//     const contract = await client.contract().at(contractAddress);
//     const decimals = await contract.decimals().call(); // รับจำนวน decimal จากสัญญา TRC20

//     // แปลงจำนวนเหรียญให้อยู่ในรูปแบบที่ถูกต้อง
//     const amountWithDecimals = amount * 2 ** decimals;

//     // เรียกใช้ฟังก์ชันโอนในสัญญา TRC20
//     const transaction = await contract.transfer(toAddress, amountWithDecimals).send({
//       from: fromAddress,
//       feeLimit: 1000000, // ค่าธรรมเนียมการทำธุรกรรม
//     });

//     console.log(transaction);
//   } catch (error) {
//     console.error('เกิดข้อผิดพลาด:', error);
//   }
// }

// sendTRC20Transaction();

app.use(express.json()); 
app.post('/send-trc20-transaction', async (req, res) => {
  try {
    const client = new TronWeb({
      fullHost: "https://nile.trongrid.io",
      privateKey: 'c4ad051c94114884210ceacd69ace6fc5085c97f5e9c1165ea616df4b19a41b3',
    });

    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const contractAddress = req.body.contractAddress;
    const amount = parseFloat(req.body.amount);

    // ใช้ TronWeb ในการโหลด ABI ของสัญญา TRC20
    const contract = await client.contract().at(contractAddress);
    const decimals = await contract.decimals().call(); // รับจำนวน decimal จากสัญญา TRC20

    // แปลงจำนวนเหรียญให้อยู่ในรูปแบบที่ถูกต้อง
    const amountWithDecimals = amount * 1 ** decimals;

    // เรียกใช้ฟังก์ชันโอนในสัญญา TRC20
    const transaction = await contract.transfer(toAddress, amountWithDecimals).send({
      from: fromAddress,
      feeLimit: 1000000, // ค่าธรรมเนียมการทำธุรกรรม
    });

    console.log(transaction);

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});







