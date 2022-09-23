export const ERC20_TRANSFER_ABI = [
  'function transfer(address to, uint256 value) public returns (bool success)',
];
export const ERC20_ABI = [
  ...ERC20_TRANSFER_ABI,
  'function balanceOf(address owner) view returns (uint256)',
];

export const ERC721_TRANSFER_ABI = [
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
];
