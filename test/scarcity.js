const Ganache = require('./helpers/ganache');
const { expect } = require('chai');
const { utils } = require('ethers');

describe('Scarcity', function() {
  const ganache = new Ganache();

  let accounts;
  let owner;
  let user;
  let receiver;
  
  let scarcity;

  before('setup', async function() {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    user = accounts[1];
    receiver = accounts[2];

    const Scarcity = await ethers.getContractFactory('contracts/core/rarity.sol:rarity');
    scarcity = await Scarcity.deploy();

    await ganache.snapshot();
  });

  afterEach('revert', function() { return ganache.revert(); });

  it('should be possible to set base URL for owner', async ()=> {
    const uri = 'test/';
    expect(await scarcity.baseURI()).to.equal('');
    await scarcity.setBaseMetadataURI(uri);
    expect(await scarcity.baseURI()).to.equal(uri);
  });

  it('should NOT be possible to set base URL for NOT owner', async ()=> {
    const uri = 'test/';
    expect(await scarcity.baseURI()).to.equal('');
    await expect(scarcity.connect(user).setBaseMetadataURI(uri)).to.be.revertedWith('Ownable: caller is not the owner');
    expect(await scarcity.baseURI()).to.equal('');
  });

  it('should be possible to mint new summoner and level up', async ()=> {
    expect(await scarcity.next_summoner()).to.equal(0);
    await scarcity.connect(user).summon(11);
    expect(await scarcity.next_summoner()).to.equal(1);
  });

  it('should be possible to get summoner URI', async ()=> {
    const uri = 'test/';
    await scarcity.setBaseMetadataURI(uri);
    await scarcity.connect(user).summon(11);
    expect(await scarcity.tokenURI(0)).to.equal(`${uri}0`);
  });

  it('should have minter address', async ()=> {
    await scarcity.connect(user).summon(1);
    expect(await scarcity.minters(0)).to.equal(user.address);
  });

  it('should NOT change minter address after transfer', async ()=> {
    await scarcity.connect(user).summon(1);
    await scarcity.connect(user).transferFrom(user.address, receiver.address, 0);
    expect(await scarcity.ownerOf(0)).to.equal(receiver.address);
    expect(await scarcity.minters(0)).to.equal(user.address);
  });

  it('should return 0 `xp to next level`  on level 0', async ()=> {
    expect(await scarcity.xp_required(0)).to.equal(utils.parseEther('0'));
  });

  it('should return 1000 `xp to next level` on level 1', async ()=> {
    expect(await scarcity.xp_required(1)).to.equal(utils.parseEther('1000'));
  });

  it('should return 100000 `xp to next level` on level 10', async ()=> {
    expect(await scarcity.xp_required(10)).to.equal(utils.parseEther('100000'));
  });

  it('should return 998001000 `xp to next level` on level 999', async ()=> {
    expect(await scarcity.xp_required(999)).to.equal(utils.parseEther('998001000'));
  });

  it('should return 9999800001000 `xp to next level` on level 99999', async ()=> {
    expect(await scarcity.xp_required(99999)).to.equal(utils.parseEther('9999800001000'));
  });

});
