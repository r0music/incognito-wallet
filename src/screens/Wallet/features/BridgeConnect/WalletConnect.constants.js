export const TOKEN_ABI = JSON.parse(
  '[\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [],\n' +
  '        "name": "name",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "string"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": false,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "name": "_spender",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "name": "_value",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "approve",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "bool"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "nonpayable",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [],\n' +
  '        "name": "totalSupply",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": false,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "name": "_from",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "name": "_to",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "name": "_value",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "transferFrom",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "bool"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "nonpayable",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [],\n' +
  '        "name": "decimals",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "uint8"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "name": "_owner",\n' +
  '                "type": "address"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "balanceOf",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "balance",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [],\n' +
  '        "name": "symbol",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "string"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": false,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "name": "_to",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "name": "_value",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "transfer",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "bool"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "nonpayable",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "constant": true,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "name": "_owner",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "name": "_spender",\n' +
  '                "type": "address"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "allowance",\n' +
  '        "outputs": [\n' +
  '            {\n' +
  '                "name": "",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "payable": false,\n' +
  '        "stateMutability": "view",\n' +
  '        "type": "function"\n' +
  '    },\n' +
  '    {\n' +
  '        "payable": true,\n' +
  '        "stateMutability": "payable",\n' +
  '        "type": "fallback"\n' +
  '    },\n' +
  '    {\n' +
  '        "anonymous": false,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "indexed": true,\n' +
  '                "name": "owner",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "indexed": true,\n' +
  '                "name": "spender",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "indexed": false,\n' +
  '                "name": "value",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "Approval",\n' +
  '        "type": "event"\n' +
  '    },\n' +
  '    {\n' +
  '        "anonymous": false,\n' +
  '        "inputs": [\n' +
  '            {\n' +
  '                "indexed": true,\n' +
  '                "name": "from",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "indexed": true,\n' +
  '                "name": "to",\n' +
  '                "type": "address"\n' +
  '            },\n' +
  '            {\n' +
  '                "indexed": false,\n' +
  '                "name": "value",\n' +
  '                "type": "uint256"\n' +
  '            }\n' +
  '        ],\n' +
  '        "name": "Transfer",\n' +
  '        "type": "event"\n' +
  '    }\n' +
  ']',
);

const isMainnet = global.isMainnet;
export const CONSTANTS = {
  INC_CONTRACT_ABI: JSON.parse(
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"string","name":"incognitoAddress","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newIncognitoProxy","type":"address"}],"name":"UpdateIncognitoProxy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"assets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"UpdateTokenTotal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ETH_TOKEN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"incognitoAddress","type":"string"}],"name":"depositERC20","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"recipientToken","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"bytes","name":"signData","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"getDepositedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_prevVault","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isInitialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isSigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isWithdrawed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"migration","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notEntered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"}],"name":"parseBurnInst","outputs":[{"components":[{"internalType":"uint8","name":"meta","type":"uint8"},{"internalType":"uint8","name":"shard","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"addresspayable","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"itx","type":"bytes32"}],"internalType":"structVault.BurnInstData","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"prevVault","outputs":[{"internalType":"contractWithdrawable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"signData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"}],"name":"requestWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"sigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"signData","type":"bytes"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"sigToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"},{"internalType":"uint256","name":"heights","type":"uint256"},{"internalType":"bytes32[]","name":"instPaths","type":"bytes32[]"},{"internalType":"bool[]","name":"instPathIsLefts","type":"bool[]"},{"internalType":"bytes32","name":"instRoots","type":"bytes32"},{"internalType":"bytes32","name":"blkData","type":"bytes32"},{"internalType":"uint256[]","name":"sigIdxs","type":"uint256[]"},{"internalType":"uint8[]","name":"sigVs","type":"uint8[]"},{"internalType":"bytes32[]","name":"sigRs","type":"bytes32[]"},{"internalType":"bytes32[]","name":"sigSs","type":"bytes32[]"}],"name":"submitBurnProof","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalDepositedToSCAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"updateAssets","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"},{"internalType":"uint256","name":"heights","type":"uint256"},{"internalType":"bytes32[]","name":"instPaths","type":"bytes32[]"},{"internalType":"bool[]","name":"instPathIsLefts","type":"bool[]"},{"internalType":"bytes32","name":"instRoots","type":"bytes32"},{"internalType":"bytes32","name":"blkData","type":"bytes32"},{"internalType":"uint256[]","name":"sigIdxs","type":"uint256[]"},{"internalType":"uint8[]","name":"sigVs","type":"uint8[]"},{"internalType":"bytes32[]","name":"sigRs","type":"bytes32[]"},{"internalType":"bytes32[]","name":"sigSs","type":"bytes32[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"withdrawRequests","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"withdrawed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"},{"internalType":"address","name":"token","type":"address"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBuildData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"executeBuildData","outputs":[],"stateMutability":"payable","type":"function"}]',
  ),
  INC_CONTRACT_ADDRESS: global.severDefault ? global.severDefault.IncContractAddress : '0x43D037A562099A4C2c95b1E2120cc43054450629',
  INC_BSC_CONTRACT_ADDRESS: global.severDefault ? global.severDefault.IncBSCContractAddress : '0x43D037A562099A4C2c95b1E2120cc43054450629',
  ETH_HOST: isMainnet
    ? 'https://eth-fullnode.incognito.org'
    : 'https://kovan.infura.io/v3/8c1ae0e623704f288eab73928a9243f5',
  BSC_HOST: isMainnet
    ? 'https://bsc-dataseed1.ninicoin.io'
    : 'https://data-seed-prebsc-1-s3.binance.org:8545',
  ETH_ERC20_DEPOSIT_GAS: 100000,
};

export const INC_CONTRACT_ABI = JSON.parse(
  '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"string","name":"incognitoAddress","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newIncognitoProxy","type":"address"}],"name":"UpdateIncognitoProxy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"assets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"UpdateTokenTotal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ETH_TOKEN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"incognitoAddress","type":"string"}],"name":"depositERC20","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"recipientToken","type":"address"},{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"bytes","name":"signData","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"getDepositedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_prevVault","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isInitialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isSigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isWithdrawed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"migration","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notEntered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"}],"name":"parseBurnInst","outputs":[{"components":[{"internalType":"uint8","name":"meta","type":"uint8"},{"internalType":"uint8","name":"shard","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"addresspayable","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"itx","type":"bytes32"}],"internalType":"structVault.BurnInstData","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"prevVault","outputs":[{"internalType":"contractWithdrawable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"signData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"}],"name":"requestWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"sigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"signData","type":"bytes"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"sigToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"},{"internalType":"uint256","name":"heights","type":"uint256"},{"internalType":"bytes32[]","name":"instPaths","type":"bytes32[]"},{"internalType":"bool[]","name":"instPathIsLefts","type":"bool[]"},{"internalType":"bytes32","name":"instRoots","type":"bytes32"},{"internalType":"bytes32","name":"blkData","type":"bytes32"},{"internalType":"uint256[]","name":"sigIdxs","type":"uint256[]"},{"internalType":"uint8[]","name":"sigVs","type":"uint8[]"},{"internalType":"bytes32[]","name":"sigRs","type":"bytes32[]"},{"internalType":"bytes32[]","name":"sigSs","type":"bytes32[]"}],"name":"submitBurnProof","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalDepositedToSCAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"updateAssets","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"inst","type":"bytes"},{"internalType":"uint256","name":"heights","type":"uint256"},{"internalType":"bytes32[]","name":"instPaths","type":"bytes32[]"},{"internalType":"bool[]","name":"instPathIsLefts","type":"bool[]"},{"internalType":"bytes32","name":"instRoots","type":"bytes32"},{"internalType":"bytes32","name":"blkData","type":"bytes32"},{"internalType":"uint256[]","name":"sigIdxs","type":"uint256[]"},{"internalType":"uint8[]","name":"sigVs","type":"uint8[]"},{"internalType":"bytes32[]","name":"sigRs","type":"bytes32[]"},{"internalType":"bytes32[]","name":"sigSs","type":"bytes32[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"withdrawRequests","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"withdrawed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"string","name":"incognitoAddress","type":"string"},{"internalType":"address","name":"token","type":"address"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawBuildData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"exchangeAddress","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"executeBuildData","outputs":[],"stateMutability":"payable","type":"function"}]',
);
