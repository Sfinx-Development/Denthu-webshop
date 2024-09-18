export function generatePayeeReference(isMerchantSettlement: boolean) {
  if (isMerchantSettlement) {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  } else {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let reference = "";
    for (let i = 0; i < 30; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  }
}
