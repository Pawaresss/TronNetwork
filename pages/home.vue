<template>
  <v-container>
    <h1 class="text-center mb-4">Wallet address</h1>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <div class="white--text">{{ walletAddress }}</div>
        <div class="white--text">Private Key: {{ privateKey }}</div> <!-- แสดง PrivateKey ที่นี่ -->
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submitForm">Generate Wallet</v-btn>
        <v-btn color="primary" @click="refreshPage">ลบ</v-btn> <!-- เพิ่มปุ่มรีเฟรชหน้า -->
      </v-col>
    </v-row>
    <v-bottom-navigation color="primary" absolute app>
      <v-btn
        v-for="item in navigationItems"
        :key="item.icon"
        :to="item.to"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      walletAddress: '',
      privateKey: '', // เพิ่ม privateKey ในข้อมูล
      navigationItems: [
          { icon: 'mdi-home', to: '/' },
          { icon: 'mdi-account', to: '/home' },
          { icon: 'mdi-wallet', to: '/trx' },
        ],
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.get('http://localhost:3000/create-wallet');
        const data = response.data;
        if (data.message) {
          this.walletAddress = data.address; 
          this.privateKey = data.privateKey; // เพิ่มบรรทัดนี้
          console.log('Wallet Address created:', this.walletAddress);

          // เรียกใช้งาน API เพื่อดึงข้อมูลที่อยู่ในฐานข้อมูล
          this.getWalletAddress();
        }
      } catch (error) {
        console.error('Error creating wallet:', error);
      }
    },
    async getWalletAddress() {
      try {
        const response = await axios.get('http://localhost:3000/get-account-address');
        const data = response.data;
        if (data.walletAddress) {
          this.walletAddress = data.walletAddress;
          console.log('Wallet Address from database:', this.walletAddress);
        }
      } catch (error) {
        console.error('Error fetching wallet address from database:', error);
      }
    },
    refreshPage() {
      window.location.reload(); // รีเฟรชหน้า
    },
  },
};
</script>

<style>
.v-text-field--solo > .v-input__control > .v-input__slot {
  border-color: #2196f3;
}

.v-label {
  color: #2196f3;
}

.v-text-field__details {
  color: #757575;
}

.v-input__icon.v-input__icon--clear {
  color: #f44336;
}

/* สไตล์สำหรับปุ่ม */
.v-btn {
  text-transform: none;
  font-weight: bold;
}
</style>
