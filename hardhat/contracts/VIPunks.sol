// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract VIPunks is ERC721Enumerable, Ownable {
    using Strings for uint256;
    /**
        * _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
        * token will be the concatenation of the `baseURI` and the `tokenId`.
    */
    string _baseTokenURI;

    //  _price is the price of one VIPunks NFT
    uint256 public _price = 0.01 ether;

    // _paused is used to pause the contract in case of an emergency
    bool public _paused;

    // max number of VIPunks
    uint256 public maxTokenIds = 10;

    // total number of tokenIds minted
    uint256 public tokenIds;

    modifier onlyWhenNotPaused {
        require(!_paused, "Contract currently paused");
        _;
    }

    /**
        * ERC721 constructor takes in a `name` and a `symbol` to the token collection.
        * name in our case is `VIPunks` and symbol is `VIP`.
        * Constructor for LW3P takes in the baseURI to set _baseTokenURI for the collection.
    */
    constructor (string memory baseURI) ERC721("VIPunks", "VIP") {
        _baseTokenURI = baseURI;
    }


    //  mint() allows an user to mint 1 VI NFT per transaction.

    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Exceeded maximum VIPunks supply");
        require(msg.value >= _price, "Ether sent is not correct");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    /*
    * _baseURI() overides the Openzeppelin's ERC721 implementation which by default
    * returned an empty string for the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
    * tokenURI() overides the Openzeppelin's ERC721 implementation for tokenURI function
    * This function returns the URI from where we can extract the metadata for a given tokenId
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        // Here it checks if the length of the baseURI is greater than 0, if it is return the baseURI and attach
        // the tokenId and `.json` to it so that it knows the location of the metadata json file for a given 
        // tokenId stored on IPFS
        // If baseURI is empty return an empty string
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }


    // setPaused makes the contract paused or unpaused
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    // withdraw sends all the ether in the contract to the owner of the contract
    
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether when msg.data is empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}


