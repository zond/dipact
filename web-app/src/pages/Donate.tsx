import React from "react";

import { Container, Typography } from "@material-ui/core";
import GoBackNav from "../components/GoBackNav";

const TITLE = "Donate";

const Donate = (): React.ReactElement => {
  return (
    <GoBackNav title={TITLE}>
      <Container>
        <Typography>
          This is a free game. It's free to play and the{" "}
          <a href="https://github.com/zond/dipact">sourcecode</a> is available
          for anyone that wants it.
        </Typography>
        <Typography>
          Running the server for the game is not free, however. The dev team
          behind diplicity spends about USD 50 per month to pay for CPU,
          storage, and bandwidth.
        </Typography>
        <Typography>
          If you enjoy the game and feel like contributing, it would be greatly
          appreciated.
        </Typography>
        <Typography>
          To contribute, send donations in the Cardano crypto currency ADA to
          our{" "}
          <button
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              // helpers.copyToClipboard(
              //   "addr1qxey62mry7ee2k8n56llc9ra3pr05x5khdzqdh8ea9uu60mlf6rhkegzsxet2val95au2nvyxxy3l6nrcema6hccy3vqycr3kz"
              // );
              // helpers.snackbar("Wallet address copied to clipboard.");
            }}
          >
            Cardano wallet
          </button>
        </Typography>
        <Typography>
          If you want to contribute but don't know how to get your hands on ADA
          coins, see{" "}
          <a href="https://www.google.com/search?q=buy+cardano+ada">
            buy cardano ada
          </a>{" "}
          or contact the{" "}
          <a href="https://groups.google.com/g/diplicity-talk">forum</a>.
        </Typography>
      </Container>
    </GoBackNav>
  );
};

export default Donate;
