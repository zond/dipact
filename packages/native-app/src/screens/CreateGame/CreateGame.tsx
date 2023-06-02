import React from "react";
import { useTranslation } from "react-i18next";
import {
  assertDefined,
  findDefined,
  translateKeys as tk,
  useCreateGameForm,
} from "diplicity-common-internal";

import QueryContainer from "../../components/QueryContainer";
import { Stack } from "../../components/Stack";
import Text from "../../components/Text";
import { useCommonStyles } from "../../hooks/useCommonStyles";
import { MenuItem, Select } from "../../components/Select";
import { Table, TableRow } from "../../components/Table";
import TextField from "../../components/TextField";
import CheckBox from "../../components/CheckBox";
import { useStyles } from "./CreateGame.styles";

type HandleChange = (
  fieldName: string
) => (value: string | boolean | number) => void;

const CreateGame = () => {
  useStyles();
  const commonStyles = useCommonStyles();
  const { t } = useTranslation();

  const {
    handleChange: unTypedHandleChange,
    query,
    setFieldValue,
    values,
  } = useCreateGameForm();
  const handleChange = unTypedHandleChange as HandleChange;

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = findDefined(
          data.variants,
          (v) => v.name === values.variant
        );
        return (
          <>
            <Stack padding={1} gap={2} orientation="vertical">
              <Stack
                style={commonStyles.section}
                orientation="vertical"
                fillWidth
                align="flex-start"
              >
                <TextField
                  label={t(tk.createGame.nameInput.label)}
                  placeholder={t(tk.createGame.nameInput.label)}
                  value={values.name}
                  onChange={handleChange("name")}
                />
                <CheckBox
                  label={t(tk.createGame.privateCheckbox.label)}
                  checked={values.privateGame}
                  onPress={() =>
                    setFieldValue("privateGame", !values.privateGame)
                  }
                />
                <CheckBox
                  label={t(tk.createGame.gameMasterCheckbox.label)}
                  checked={values.gameMaster}
                  disabled={!values.privateGame}
                  onPress={() =>
                    setFieldValue("gameMaster", !values.gameMaster)
                  }
                />
                <Text>
                  {values.privateGame
                    ? t(tk.createGame.gameMasterCheckbox.helpText.default)
                    : t(tk.createGame.gameMasterCheckbox.helpText.disabled)}
                </Text>

                {values.privateGame && values.gameMaster && (
                  <>
                    <CheckBox
                      label={t(tk.createGame.requireGameMasterInvitation.label)}
                      checked={values.requireGameMasterInvitation}
                      disabled={!values.gameMaster}
                      onPress={() =>
                        setFieldValue(
                          "requireGameMasterInvitation",
                          !values.requireGameMasterInvitation
                        )
                      }
                    />
                    <Text>
                      {t(tk.createGame.requireGameMasterInvitation.helpText)}
                    </Text>
                  </>
                )}
              </Stack>
              <Stack
                style={commonStyles.section}
                orientation="vertical"
                fillWidth
                align="flex-start"
              >
                <Select
                  placeholder={t(tk.createGame.variantSelect.label)}
                  value={variant.name}
                  onChange={(value) => setFieldValue("variant", value)}
                  label={t(tk.createGame.variantSelect.label)}
                >
                  {data.variants.map((v) => (
                    <MenuItem label={v.name} value={v.name} key={v.name} />
                  ))}
                </Select>
                <Text>{variant.description}</Text>
                <Table>
                  <TableRow
                    label={t(tk.createGame.variantDescription.startYearLabel)}
                    value={variant.startYear.toString()}
                  />
                  <TableRow
                    label={t(tk.createGame.variantDescription.authorLabel)}
                    value={variant.createdBy}
                  />
                  <TableRow
                    label={t(tk.createGame.variantDescription.rulesLabel)}
                    value={variant.rules}
                    orientation="vertical"
                  />
                </Table>
              </Stack>
            </Stack>
          </>
        );
      }}
    />
  );
};

export default CreateGame;
