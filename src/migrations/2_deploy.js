const Token = artifacts.require('Token');

module.exports = async (deployer) => {
    await deployer.deploy(Token);
};