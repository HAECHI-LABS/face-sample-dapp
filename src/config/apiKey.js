import { Network } from '@haechi-labs/face-types';

export const resolveApiKey = (network) => {
  // return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZNotniFjZdpvDllzdS77MrAgsYnvLtXJq6hem5XeCL9ZfQQzEwMJoadXUJuRQbZHFexJaPvynMD3ufvxKKEfxWR-8j6YCIbSh8MLhypfL7FEtLsQAck-T4jiptiMVxuPhrDRmGgzC2Sik_qi0SiXXUebsPULgQyS85nPhtQ5lNwIDAQAB';
  switch (network) {
    case Network.ETHEREUM:
    case Network.POLYGON:
    case Network.BNB_SMART_CHAIN:
    case Network.KLAYTN:
    case Network.BORA:
    case Network.NEAR:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdu7Mk2mO6OsDyhTV9FbL0LRWh6QvV6hrabjKWT4Sv6ooQeacQJinuGKdFtMTxTIQFdq8o9iHkx_dpxZu7ljG23QYgpEBgj4pLIgv2XIzgApcpd5oGy41ksh2HRVUUjM-AqWOfF2JtaZehYCNVDuCF6pVLo-uPiLBY1icKbH503QIDAQAB';
    case Network.SEPOLIA:
    case Network.MUMBAI:
    case Network.BNB_SMART_CHAIN_TESTNET:
    case Network.BAOBAB:
    case Network.BORA_TESTNET:
    case Network.NEAR_TESTNET:
    case Network.SAND_VERSE:
    case Network.OASYS_TESTNET:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeaHbeU4kjNUP9xvTa6f0UzmJkSpNzndRbkjloa_Cr2PLdr7pzHZ275ZA4z_Zb70VV-kzdj5w8Y4vDAbWGOrYAQeZeE1DfhfyEF8QzDsEZXwqBYv4oonanYwNiGC3-DsOpWFDl80unyfmGpdWC3Q0U1XgXkr7vD7xh4ACOXruVFwIDAQAB';
    default:
      throw new Error('unsupported network error');
  }
};
