const { expect } = require("chai");

describe("VIPunks", function() {
    let viPunksContract
    let contract
    const metadataURL = "gateway.pinata.cloud/ipfs/QmUYybL9hEPTda2UBAm9hvwFGeQZ5LzwtHmnERv57KsVZW/"
    
    beforeEach(async function() {
        // get contractFactory 
        viPunksContract = await ethers.getContractFactory("VIPunks");
        // get signers
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
        // deploy contract
        contract = await viPunksContract.deploy(metadataURL);
        
    })
    describe("Deployment", function() {
        it("should track name and symbol of VIPunks contract", async function() {
            const nftName = "VIPunks"
            const nftSymbol = "VIP"
            expect(await contract.name()).to.equal(nftName);
            expect(await contract.symbol()).to.equal(nftSymbol);
            //expect(await contract._baseTokenURI).to.equal(metadataURL)
        });
        it("should track price and max supply of VI Punks nfts", async function() {
            expect(await contract.maxTokenIds()).to.equal(10);
            let punkPrice = ethers.utils.parseEther("0.01")
            expect(await contract._price()).to.equal(punkPrice)
        })
    });

    describe("Minting VI Punks nfts", function() {
        it("should track each minted VI nft", async function() {
            // addr1 mints a VI NFT by sending 0.01 ether
            await contract.connect(addr1).mint({
                value: ethers.utils.parseEther("0.01"),
            })
            // check that now total token count should be equal to 1
            expect(await contract.tokenIds()).to.equal(1)
            // check balance of addr1 should be 1
            expect(await contract.balanceOf(addr1.address)).to.equal(1)
            // check owner of tokenId 1 should be addr1
            expect(await contract.ownerOf(1)).to.equal(addr1.address)
            // try to mint a VI Punk from addr2 by sending 0.005 ether, it should be reverted
            await expect(contract.connect(addr2).mint({
                value: ethers.utils.parseEther("0.005")
            })).to.be.revertedWith("Ether sent is not correct")
            // mint another VI Punk from addr2
            await contract.connect(addr2).mint({
                value: ethers.utils.parseEther("0.01"),
            })
            // now total token count should be equal to 2
            expect(await contract.tokenIds()).to.equal(2)
        })
    })

    describe("Get Token URI", function() {
        it("should track NFT metadata", async function() {
            // try to get URI for token id 1 , it should be reverted
            await expect(contract.tokenURI(1)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token")
            // addr1 mints a VI NFT by sending 0.01 ether
            await contract.connect(addr1).mint({
                value: ethers.utils.parseEther("0.01"),
            })
            // check token URI metadata
            let uri = metadataURL + '1.json'
            expect(await contract.tokenURI(1)).to.equal(uri)
        })
    })
});