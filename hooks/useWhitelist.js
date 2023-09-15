
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import WlAccounts from '../lib/Accounts.json'

function useWhitelist() {

    const GetUserProof = (userAddr) => {
          const leafNodes = WlAccounts.map((addr) => keccak256(addr));
          const merkleTree = new MerkleTree(leafNodes, keccak256, {
            sortPairs: true,
          });
          const rootHash = merkleTree.getRoot();
          const claimingAddress = keccak256(userAddr);
          const hexProof = merkleTree.getHexProof(claimingAddress);
          return hexProof;
      };

      const getMerkleRoot = () => {
          const leafNodes = WlAccounts.map((addr) => keccak256(addr));
          const merkleTree = new MerkleTree(leafNodes, keccak256, {
            sortPairs: true,
          });
          const rootHash = merkleTree.getRoot();
          return "Root Hash: " + "0x" + rootHash.toString("hex");
      };


    return {
        GetUserProof,
        getMerkleRoot
    };
}

export default useWhitelist;