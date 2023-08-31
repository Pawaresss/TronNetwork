<template>
  <v-container>
    <h1 class="text-center mb-4">Transfer Tokens</h1>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="contractAddress"
          label="Token Contract Address"
          outlined
          dense
          color="primary"
          placeholder="Enter token contract address"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="recipientAddress"
          label="Recipient Address (ผู้รับ)"
          outlined
          dense
          color="primary"
          placeholder="Enter recipient address"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="amount"
          label="Amount ( TRX )"
          outlined
          dense
          color="primary"
          placeholder="Enter amount"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-text-field
          v-model="privateKey"
          label="Private Key"
          outlined
          dense
          color="primary"
          placeholder="Enter private key"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="sendTokens">Send tokens</v-btn>
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
    
    <!-- เพิ่มส่วนที่แสดงผลการโอนเงินได้ตรงนี้ -->
    <v-row justify="center" v-if="transactionResult">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <h2>Transaction Result</h2>
        <p>{{ transactionResult }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      contractAddress: '', // ที่อยู่ของ smart contract ของเหรียญ TRC-20
      recipientAddress: '',
      contract: null,
      amount: '',
      privateKey: '', // เพิ่มช่องสำหรับใส่ Private Key
      navigationItems: [
        { icon: 'mdi-home', to: '/' },
        { icon: 'mdi-account', to: '/home' },
      ],
      contractAbi: [ // ระบุ ABI ของสัญญา TRC-20 ของคุณ
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        // เพิ่มเมธอดอื่น ๆ ของสัญญา TRC-20 ตรงนี้
      ],
      transactionResult: null, // ผลลัพธ์ของการโอนเงิน
    };
  },



  methods: {
    sendTokens() {
      
  // Check if the contract address is provided
  if (!this.contractAddress) {
    console.error('Contract address is required.');
    return;
  }

  // Initialize the contract instance
  this.contract = tronWeb.contract(this.contractAbi, this.contractAddress);

  // Create the transaction object
  const transactionObject = {
    to: this.contractAddress,
    value: 0,
    data: this.contract.transfer(this.recipientAddress, this.amount).encodeABI(),
  };

  // Sign and send the transaction
  tronWeb.trx.sign(transactionObject, this.privateKey)
    .then((signedTransaction) => {
      return tronWeb.trx.sendRawTransaction(signedTransaction);
    })
    .then((result) => {
      console.log('Transaction Result:', result);
      this.transactionResult = 'Transaction Successful';
    })
    .catch((error) => {
      console.error('Error sending tokens:', error);
      this.transactionResult = 'Transaction Failed';
    });
},
  },
};


</script>
