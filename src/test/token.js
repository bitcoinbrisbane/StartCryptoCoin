const Token = artifacts.require("Token");
const helper = require("./helpers/truffleTestHelper");

contract.only("Token", function(accounts) {
  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  let tokenInstance;

  beforeEach(async function () {
    tokenInstance = await Token.new();
  });

  describe("ERC20 tests", () => {
    it("It should test ERC20 public properties", async function () {
      const name = await tokenInstance.name();
      assert.equal(name, "StartCryptoCoin", "Name should be StartCryptoCoin");

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "SCC", "Symbol should be SCC");
    });

    it("Total supply should be 1000000000", async function () {
      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 1000000000, "Total supply should be 0");
    });

    it("Owner balance should be 1000000000", async function () {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 1000000000, "Balance should be 1000000000");
    });
  });
});