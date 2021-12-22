import React from "react";

import { Container, Typography } from "@mui/material";
import GoBackNav from "../components/GoBackNav";

const TITLE = "Settings";

const Settings = (): React.ReactElement => {
  return (
    <GoBackNav title={TITLE}>
      <Container>
      </Container>
    </GoBackNav>
  );
};

export default Settings;