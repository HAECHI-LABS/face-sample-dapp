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
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFhGcETETTZVrysoeadS_HGjY3p_jxFkZMR3aE2Sy-d7kjn_WJLYd5f3voEK9mbmLvglt3SGLw08xh_mVFD3rP8QoCNmjkyCbMIeszpCtudAAq1Ar37ZWCKQArWlhXB9EtTU9e3E4FBcBW9vqaPxiT8sk2MBFkCeinNSDHTdQ2uwIDAQAB';
    case Network.SEPOLIA:
    case Network.MUMBAI:
    case Network.BNB_SMART_CHAIN_TESTNET:
    case Network.BAOBAB:
    case Network.BORA_TESTNET:
    case Network.NEAR_TESTNET:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS23ncDS7x8nmTuK1FFN0EfYo0vo6xhTBMBNWVbQsufv60X8hv3-TbAQ3JIyMEhLo-c-31oYrvrQ0G2e9j8yvJYEUnLuE-PaABo0y3V5m9g_qdTB5p9eEfqZlDrcUl1zUr4W7rJwFwkTlAFSKOqVCPnm8ozmcMyyrEHgl2AbehrQIDAQAB';
    default:
      throw new Error('unsupported network error');
  }
};
