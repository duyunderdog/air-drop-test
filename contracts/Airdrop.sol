// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "../libs/MerkleProof.sol";

contract TheAirdropDistributor is EIP712Upgradeable {

  bytes32 public rootHash;
  mapping(address => bool) claimMerkleTreeMarker;

  address public admin;
  mapping (address => uint) public nonces;
  mapping(address => bool) claimSignatureMarker;

  event Claimed(address _address);

  function initialize(
    string memory _name,
    string memory _version
  ) public initializer {
    admin = msg.sender;
    rootHash = 0x4d690d7133a91f3a87725794a4532041be28f4eedb8e4305eafe73c6d732b390;
    EIP712Upgradeable.__EIP712_init(_name, _version);
  }

  function updateRootHash(bytes32 _rootHash) external {
    require(msg.sender == admin, "401");
    rootHash = _rootHash;
  }

  function claimByMerklePath(bytes32[] calldata _path) external {
    require(!claimMerkleTreeMarker[msg.sender], 'AirdropDistributor: Drop already claimed.');
    bytes32 hash = keccak256(abi.encodePacked(msg.sender));
    require(MerkleProof.verify(_path, rootHash, hash), 'AirdropDistributor: 400');
    claimMerkleTreeMarker[msg.sender] = true;
    // TODO: distribute the airdrop to user
    emit Claimed(msg.sender);
  }

  function claimBySignature(bytes memory _signature) external {
    require(!claimSignatureMarker[msg.sender], 'AirdropDistributor: Drop already claimed.');
    bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
        keccak256("Airdrop(address user,uint256 nonce)"),
        msg.sender,
        nonces[msg.sender]
      )));
    nonces[msg.sender]++;
    address signer = ECDSAUpgradeable.recover(digest, _signature);
    require(signer == admin, "MessageVerifier: invalid signature");
    require(signer != address(0), "ECDSAUpgradeable: invalid signature");
    claimSignatureMarker[msg.sender] = true;
    // TODO: distribute the airdrop to user
    emit Claimed(msg.sender);
  }
}