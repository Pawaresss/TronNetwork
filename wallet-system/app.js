const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000; // ใช้ port 3001 สำหรับ Backend

// กำหนดค่าการเชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wallet_db'
});

// เชื่อมต่อฐานข้อมูล MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// สร้างตาราง wallet_addresses ในฐานข้อมูล (ถ้ายังไม่มี)
db.query(`CREATE TABLE IF NOT EXISTS wallet_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL
)`, (err, result) => {
    if (err) {
        throw err;
    }
    console.log('Table created or already exists');
});

// สร้าง Wallet Address และบันทึกลงฐานข้อมูล
app.get('/create-wallet', (req, res) => {
    const newAddress = generateRandomAddress();
    const sql = 'INSERT INTO wallet_addresses (address) VALUES (?)';
    db.query(sql, [newAddress], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error creating wallet address' });
        } else {
            console.log('Wallet Address created and saved to database');
            res.status(200).send({ message: 'Wallet Address created', address: newAddress });
        }
    });
});

function generateRandomAddress() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let address = '';
    for (let i = 0; i < 32; i++) {
        address += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return address;
}

// เริ่มต้นใช้งานเซิร์ฟเวอร์ Backend
app.listen(port, () => {
    console.log(`Backend Server is running on port ${port}`);
});
