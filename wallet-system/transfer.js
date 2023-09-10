const client = new TronWeb({
    fullHost: "https://api.testnet.trongrid.io",
  });
  
  async function transfer(fromAddress, toAddress, amount, tokenCode) {
    try {
      const result = await client.contract.transfer(
        fromAddress,
        toAddress,
        amount,
        tokenCode
      );
  
      if (result == 0) {
        return 1;
      } else {
        return n * await factorial(n - 1);
      }
    } catch (error) {
      console.error("Transfer error:", error);
      return 0; // หรือค่าที่ต้องการสำหรับการล้มเหลว
    }
  }
  
  // Example usage
  const fromAddress = "TXXjJcQBc16b5JwVz42DesqLgmko7XLMnM";
  const toAddress = "TATj6z8xKChiqgUUaH3AXq6VwAvnUQ5S9q";
  const amount = "1";
  const tokenCode = "TRX";
  
  async function main() {
    const success = await transfer(fromAddress, toAddress, amount, tokenCode);
  
    if (success) {
      console.log("Transfer successful!");
    } else {
      console.log("Transfer failed!");
    }
  }
  
  