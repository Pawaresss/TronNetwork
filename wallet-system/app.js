const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const cors = require('cors');
const bs58 = require('bs58');
const TronWeb = require('tronweb');

app.use(cors());


const fullNode = 'https://nile.trongrid.io';
const solidityNode = 'https://nile.trongrid.io';
const eventServer = 'https://nile.trongrid.io';
const privateKey = ''; // คีย์ส่วนตัวของคุณ

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

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
  
