/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import TweetList from "./TweetList";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractData } = newContextComponents;

export default () => {
  const { drizzle } = useDrizzle();
  const state = useDrizzleState((state) => state);

  return (
    <>
      <div>
        <h3>All tweets</h3>
        <ContractData
          drizzle={drizzle}
          drizzleState={state}
          contract="Twitter"
          method="getLatestTweets"
          methodArgs={[4]}
          render={(tweets) => <TweetList tweets={tweets} />}
        />
      </div>
    </>
  );
};
