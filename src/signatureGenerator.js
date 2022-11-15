import Web3 from 'web3'
import theAirdropAbi from '../cross-env/abis/theAirdrop.js'

const web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
const web3 = new Web3(web3Provider)

const airdropAddress = '0x06e54fdc7c9f53be6987d99fe9f444b3919814b6'
const airdropContract = new web3.eth.Contract(theAirdropAbi, airdropAddress)

function signMessageAirdrop(message) {
  const params = [
    { name: 'user', type: 'address' },
    { name: 'nonce', type: 'uint256' }
  ]
  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      Airdrop: params,
    },
    primaryType: 'Airdrop',
    domain: {
      name: 'Duynv',
      version: '1',
      chainId: '1',
      verifyingContract: airdropAddress
    },
    message
  }
  const privateKey = Buffer.from(config.accounts.contractAdmin.key, 'hex')

  const messageFromData = getMessage(typedData, true)
  const { r, s, v } = ecsign(messageFromData, privateKey)
  return `0x${r.toString('hex')}${s.toString('hex')}${v.toString(16)}`
}

async function getSignatureAirdrop(user) {
  const nonce = await getNonceOfAirdropContract(user)

  const signature = signMessageAirdrop({
    user,
    nonce,
  })

  return {
    signature
  }
}

async function getNonceOfAirdropContract(userAddress) {
  return parseInt(await airdropContract.methods.nonces(userAddress).call())
}

export default {
  getSignatureAirdrop
}