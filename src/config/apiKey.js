import {Network} from "@haechi-labs/face-types";

export const resolveApiKey = (network) => {
  switch (network) {
    case Network.ETHEREUM || Network.POLYGON || Network.BNB_SMART_CHAIN || Network.KLAYTN || Network.BORA:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5jEuZU9r-SBfRHSx70ynSh-3Ew7SapJTbLqEUiA0ZJ2w3OUWeJPz8aYHX0Py78kNaoCCQa8JdAXsyyrrMLE8gmIqoFrjzFYmcUZ1sc5uP7ue8iDhZURYlauFC3npRiMvL__Q_CeIQq9MrFqvCLOZcU-WW-_sjRbslLGMmQWPjcQIDAQAB';
    case Network.GOERLI || Network.MUMBAI || Network.BNB_SMART_CHAIN_TESTNET || Network.BAOBAB || Network.BORA_TESTNET:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS23ncDS7x8nmTuK1FFN0EfYo0vo6xhTBMBNWVbQsufv60X8hv3-TbAQ3JIyMEhLo-c-31oYrvrQ0G2e9j8yvJYEUnLuE-PaABo0y3V5m9g_qdTB5p9eEfqZlDrcUl1zUr4W7rJwFwkTlAFSKOqVCPnm8ozmcMyyrEHgl2AbehrQIDAQAB';
    default:
      throw new Error("unsupported network error");
  }
}