const Twitter = artifacts.require("Twitter");

module.exports = async function (deployer, _network, accounts) {
  await deployer.ens.setAddress("dosh.name", accounts[0], {
    from: accounts[0],
  });
  await deployer.ens.setAddress("ev.name", accounts[1], {
    from: accounts[0],
  });
  await deployer.deploy(Twitter, deployer.ens.ensSettings.registryAddress);

  const twitter = await Twitter.deployed();

  // Bob
  await twitter.tweet("Did you guys see the Lighting game last night?");
  await twitter.tweet("Can someone buy my dogecoin?");
  await twitter.tweet("I srsly don't know why someone would cancel me");
};
