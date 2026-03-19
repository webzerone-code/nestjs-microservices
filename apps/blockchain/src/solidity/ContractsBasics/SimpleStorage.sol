// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract SimpleStorage {
    uint public favoriteNumber;
    People public person = People({
        favoriteNumber:2,name:'Patric'
    });
    uint256[] public favoriteNumberList;
    People[] public people;
    mapping(string=>uint256)  public nameToFavoriteNumber;

    struct People{
        uint256 favoriteNumber;
        string name;
    }

    function store(uint _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }
    // View and pure doesnt consume  any gas cos it doesnt change the contract
    function retrieve() public view returns (uint256){
        return favoriteNumber;
    }

    function add() public pure returns(uint256) {
        return 25;
    }

    // calldata,memory,storage
    // Calldata and memory the variable will exits in the memory only , calldata is temp variable which cant be modified memory is temp variable which can be modified
    // storage the variable will be exits as member class/contract variable
    function addPerson(string memory _name,uint256 _favoriteNumber) public {
        People newPerson = People({favoriteNumber:_favoriteNumber,name:_name});
        //People newPerson = People(_favoriteNumber,name);
        people.push(People(_favoriteNumber,_name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }

    constructor(){

    }
}
