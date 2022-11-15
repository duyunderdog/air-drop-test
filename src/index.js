import merkleTree from './merkleTree.js'
import signatureGenerator from './signatureGenerator.js'

merkleTree.genRootHash()
const address = '0xA1A2EE28Ef70A03864824866b6919c8E6B90c3cD'
const path = merkleTree.getMerklePath(address)
console.log('path', path)
const { signature } = await signatureGenerator.getSignatureAirdrop(address)
console.log('signature', signature)