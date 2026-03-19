pragma solidity ^0.8.10;

import {SimpleStorage} from "./SimpleStorage.sol";

contract StorageFactory {
    SimpleStorage[] public  simpleStorageArray;
    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }
    // In order to interact with any contract u will need
    // Address of the contract
    // ABI of the contract --- Application Binary Interface
    function sfStore(uint256 _simpleStoreIndex,uint _simpleStorageNumber) public{
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStoreIndex]; // Contract address
        simpleStorage.store(_simpleStorageNumber);
    }
    function sfGet(uint256 _simpleStorageIndex) public view returns (uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex]; // Contract address
        return simpleStorage.retrieve();
    }
}
