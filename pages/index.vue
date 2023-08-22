<template>
  <v-container>
    <h1 class="text-center mb-4">Transfer Tokens</h1>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="walletAddress"
          label="Wallet Address"
          outlined
          dense
          color="primary"
          placeholder="Enter wallet address"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="amount"
          label="Amount"
          outlined
          dense
          color="primary"
          placeholder="Enter amount"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submitForm">Send tokens</v-btn>
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
      amount: '',
      navigationItems: [
        { icon: 'mdi-home', to: '/' },
        { icon: 'mdi-account', to: '/home' },
      ],
    };
  },
  methods: {
    submitForm() {
      // ทำสิ่งที่คุณต้องการเมื่อกดปุ่ม Submit
      console.log('Wallet Address:', this.walletAddress);
      console.log('Amount:', this.amount);
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
