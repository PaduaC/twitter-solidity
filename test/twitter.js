const {
  expectRevert,
  expectEvent,
  time,
} = require("@openzeppelin/test-helpers");
const Twitter = artifacts.require("Twitter");

contract("Twitter", (accounts) => {
  let twitter = null;
  const user1Tweets = [
    "My first tweet - User 1",
    "My second tweet - User 1",
    "My third tweet - User 1",
  ];
  const user2Tweets = [
    "My first tweet - User 2",
    "My second tweet - User 2",
    "My third tweet - User 2",
  ];
  const [user1, user2] = [accounts[0], accounts[1]];
  beforeEach(async () => {
    twitter = await Twitter.new();
    await Promise.all(
      user1Tweets.map((tweet) => twitter.tweet(tweet, { from: user1 })),
      user2Tweets.map((tweet) => twitter.tweet(tweet, { from: user2 }))
    );
  });

  it("should NOT allow unauthorized person to send tweets on behalf of user", async () => {
    await twitter.disallow(user2);
    await expectRevert(
      twitter.tweetFrom(user1, user1Tweets[2], { from: user2 }),
      "Operator not authorized"
    );
  });

  it("SHOULD allow authorized person to send tweets on behalf of user", async () => {
    await twitter.allow(user2);
    const tx = await twitter.tweetFrom(user1, user1Tweets[2], { from: user2 });
    const date = await time.latest();
    await expectEvent(tx, "TweetSent", {
      id: "6",
      author: user1,
      content: user1Tweets[2],
      createdAt: date,
    });
  });

  it("should send a tweet", async () => {
    const tx = await twitter.tweet(user2Tweets[0], { from: user2 });
    const date = await time.latest();
    await expectEvent(tx, "TweetSent", {
      id: "6",
      author: user2,
      content: user2Tweets[0],
      createdAt: date,
    });
  });

  it("should NOT send message on behalf of another user w/o permission", async () => {
    await twitter.disallow(accounts[2]);
    await expectRevert(
      twitter.sendMessageFrom("Follow me on SoundCloud at...", user1, user2, {
        from: accounts[2],
      }),
      "Operator not authorized"
    );
  });

  it("should send message on behalf of another user", async () => {
    await twitter.allow(accounts[2]);
    const tx = await twitter.sendMessageFrom(
      "They cancelled me on Twitter, Evan. Who could do such a thing?",
      user1,
      user2,
      { from: accounts[2] }
    );
    const date = await time.latest();
    await expectEvent(tx, "MessageSent", {
      id: "0",
      content: "They cancelled me on Twitter, Evan. Who could do such a thing?",
      from: user1,
      to: user2,
      createdAt: date,
    });
  });

  it("should send a DM", async () => {
    const tx = await twitter.sendMessage("hu ho", user2, { from: user1 });
    const date = await time.latest();
    await expectEvent(tx, "MessageSent", {
      id: "0",
      content: "hu ho",
      from: user1,
      to: user2,
      createdAt: date,
    });
  });

  it("should follow a user", async () => {
    await twitter.follow(user2, { from: user1 });
  });
  it("should NOT follow on behalf of a user w/o permission", async () => {
    await expectRevert(
      twitter.followFrom(user2, user1, { from: accounts[2] }),
      "Operator not authorized"
    );
  });

  it("SHOULD follow on behalf of a user with permission", async () => {
    await twitter.allow(accounts[2]);
    await twitter.followFrom(user2, user1, { from: accounts[2] });
  });

  it("should retrieve tweets of a user", async () => {
    await twitter.getTweetsOf(user1, 3, { from: user2 });
  });

  it("user should get list of their tweets", async () => {
    await twitter.getLatestTweets(3, { from: user1 });
  });
});
