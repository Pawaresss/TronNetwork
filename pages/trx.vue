<template>
    <div class="container">
      <h1 class="title mb-2">ส่งเหรียญ TRX</h1>
      <form @submit.prevent="sendTransaction" class="form">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-text-field
              v-model="fromAddress"
              label="fromAddress"
              outlined
              dense
              color="primary"
              placeholder="Enter fromAddress"
            ></v-text-field>
          </v-col>
        </v-row>
        <br />
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-text-field
              v-model="toAddress"
              label="toAddress"
              outlined
              dense
              color="primary"
              placeholder="Enter toAddress"
            ></v-text-field>
          </v-col>
        </v-row>
        <br />
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-text-field
              v-model="amount"
              label="amount"
              outlined
              dense
              color="primary"
              placeholder="Enter amount"
            ></v-text-field>
          </v-col>
        </v-row>
        <br />
        <button type="submit" class="button">ส่ง</button>
      </form>
      <br />
      <!-- Transaction result section -->
      <div v-if="transactionResult !== null" class="result">
        <h2 class="result-title">Transaction Result</h2>
        <pre class="result-pre">{{ transactionResult }}</pre>
      </div>
      <v-bottom-navigation color="primary" absolute app>
        <router-link
          v-for="item in navigationItems"
          :key="item.icon"
          :to="item.to"
          tag="button"
          class="v-btn"
        >
          <v-icon>{{ item.icon }}</v-icon>
        </router-link>
      </v-bottom-navigation>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        fromAddress: "",
        toAddress: "",
        amount: "",
        transactionResult: null,
        navigationItems: [
          { icon: 'mdi-home', to: '/' },
          { icon: 'mdi-account', to: '/home' },
          { icon: 'mdi-wallet', to: '/trx' },
        ],
      };
    },
    methods: {
    async sendTransaction() {
      try {
        // สร้างข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
        const requestData = {
          fromAddress: this.fromAddress,
          toAddress: this.toAddress,
          amount: parseFloat(this.amount),
        };

        // ส่งคำร้องขอ POST ไปยังเส้นทาง /send-trx-transaction บนเซิร์ฟเวอร์
        const response = await axios.post('http://localhost:3000/send-trx-transaction', requestData);

        // ตรวจสอบสถานะการตอบกลับ
        if (response.status === 200) {
          this.transactionResult = 'Transaction successful.\n' + (response.data.transaction, null, 2);
        } else {
          throw new Error('ไม่สามารถส่งเหรียญได้');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        this.transactionResult = 'Error: ' + error.message;
      }
    },
  },
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    padding: 20px;
  }
  
  .title {
    font-size: 200px;
    color: #fff;
  }
  
  .form {
    margin-top: 20px;
  }
  
  .label {
    font-size: 18px;
    color: #fff;
  }
  
  .input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
  }
  
  .button {
    background-color: #007bff;
    color: #fff;
    font-size: 18px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .button:hover {
    background-color: #0056b3;
  }
  
  .result {
    margin-top: 20px;
    padding: 20px;
    background-color: #20b506;
    border-radius: 5px;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .result-title {
    font-size: 20px;
    color: #fff;
    margin-top: 0;
  }
  
  .result-pre {
    font-size: 16px;
    white-space: pre-wrap;
    color: #fff;
  }
  </style>
  