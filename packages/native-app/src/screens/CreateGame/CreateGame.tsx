import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CheckBox, Input, ListItem } from "@rneui/base";
import {
  assertDefined,
  isoCodes,
  NationAllocation,
  nationAllocationTranslations,
  translateKeys as tk,
  useCreateGameForm,
} from "../../../common";
import { useTranslation } from "react-i18next";
import { Button } from "@rneui/base";
import Loading from "../../components/Loading";
import { useStyles } from "./CreateGame.styles";
import QueryContainer from "../../components/QueryContainer";
import { Stack } from "../../components/Stack";
import { useCommonStyles } from "../../hooks/useCommonStyles";
import BottomSheet, {
  BottomSheetButton,
  BottomSheetSelectOption,
} from "../../components/BottomSheet";

// Note, Input requires shake function but leaving empty for now.
const shake = () => {};

type HandleChange = (
  fieldName: string
) => (value: string | boolean | number) => void;

const CreateGame = () => {
  const styles = useStyles();
  const commonStyles = useCommonStyles();
  const { t } = useTranslation();

  const {
    handleChange: unTypedHandleChange,
    query,
    setFieldValue,
    submitDisabled,
    submitForm,
    validationErrors,
    values,
  } = useCreateGameForm();
  const [variantSelectOpen, setVariantSelectOpen] = useState(false);
  const handleChange = unTypedHandleChange as HandleChange;
  const handleChangeFloatInput = (fieldName: string) => (value: string) => {
    setFieldValue(fieldName, parseFloat(value));
  };

  const singularPhaseLength = values.phaseLengthMultiplier === 1;
  const singularAdjustmentPhaseLength =
    values.adjustmentPhaseLengthMultiplier === 1;

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = query.data?.variants?.find(
          (v) => v.name === values.variant
        );
        return (
          <>
            <Stack padding={1}>
              <Stack style={commonStyles.section}>
                <Input
                  label={<Text>{t(tk.createGame.nameInput.label)}</Text>}
                  accessibilityLabel={t(tk.createGame.nameInput.label)}
                  placeholder={t(tk.createGame.nameInput.label)}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  shake={shake}
                />
                <CheckBox
                  title={t(tk.createGame.privateCheckbox.label)}
                  accessibilityLabel={t(tk.createGame.privateCheckbox.label)}
                  checked={values.privateGame}
                  onPress={() =>
                    setFieldValue("privateGame", !values.privateGame)
                  }
                />
                <CheckBox
                  title={t(tk.createGame.gameMasterCheckbox.label)}
                  accessibilityLabel={t(tk.createGame.gameMasterCheckbox.label)}
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
                      title={t(tk.createGame.requireGameMasterInvitation.label)}
                      accessibilityLabel={t(
                        tk.createGame.requireGameMasterInvitation.label
                      )}
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
              <Stack style={commonStyles.section}></Stack>
            </Stack>
            <BottomSheet
              isVisible={variantSelectOpen}
              onBackdropPress={() => setVariantSelectOpen(false)}
            >
              {data.variants.map((v) => (
                <BottomSheetButton
                  title={t(tk.createGame.variantSelect.label)}
                  onPress={() => {
                    setFieldValue("variant", v.name);
                    setVariantSelectOpen(false);
                  }}
                  key={v.name}
                />
              ))}
            </BottomSheet>
          </>
        );
      }}
    />
  );
};

//   return (

//           <View style={styles.section}>
//             {selectedVariant ? (
//               <>
//                 <Text>{t(tk.createGame.variantSelect.label)}</Text>
//                 <Picker
//                   testID={tk.createGame.variantSelect.label}
//                   accessibilityLabel={tk.createGame.variantSelect.label}
//                   selectedValue={values.variant}
//                   onValueChange={(selected) =>
//                     setFieldValue("variant", selected)
//                   }
//                 >
//                   {variants.map((variant) => (
//                     <Picker.Item
//                       label={t(tk.createGame.variantSelect.optionLabel, {
//                         name: variant.Name,
//                         numPlayers: variant.Nations.length,
//                       })}
//                       value={variant.Name}
//                       key={variant.Name}
//                     />
//                   ))}
//                 </Picker>
//                 {isFetchingVariantSVG ? (
//                   <Loading />
//                 ) : (
//                   <>
//                     <Text>{selectedVariant.Description}</Text>
//                     {/* {selectedVariantSVG && (
//                       <SvgXml
//                         xml={selectedVariantSVG}
//                         width="100%"
//                         height="100%"
//                       />
//                     )} */}
//                     <View>
//                       <ListItem>
//                         <ListItem.Content>
//                           <ListItem.Title>
//                             {t(tk.createGame.variantDescription.startYearLabel)}
//                           </ListItem.Title>
//                           <ListItem.Subtitle>
//                             {selectedVariant.Start?.Year.toString()}
//                           </ListItem.Subtitle>
//                         </ListItem.Content>
//                       </ListItem>
//                       <ListItem>
//                         <ListItem.Content>
//                           <ListItem.Title>
//                             {t(tk.createGame.variantDescription.authorLabel)}
//                           </ListItem.Title>
//                           <ListItem.Subtitle>
//                             {selectedVariant.CreatedBy}
//                           </ListItem.Subtitle>
//                         </ListItem.Content>
//                       </ListItem>
//                       <ListItem>
//                         <ListItem.Content>
//                           <ListItem.Title>
//                             {t(tk.createGame.variantDescription.rulesLabel)}
//                           </ListItem.Title>
//                           <ListItem.Subtitle>
//                             {selectedVariant.Rules}
//                           </ListItem.Subtitle>
//                         </ListItem.Content>
//                       </ListItem>
//                     </View>
//                   </>
//                 )}
//               </>
//             ) : (
//               <Loading />
//             )}
//           </View>
//           <View style={styles.section}>
//             <Text>{t(tk.createGame.nationAllocationSection.label)}</Text>
//             <Picker
//               selectedValue={values.nationAllocation}
//               accessibilityLabel={t(
//                 tk.createGame.nationAllocationSection.label
//               )}
//               testID={t(tk.createGame.nationAllocationSection.label)}
//               onValueChange={(selected) =>
//                 setFieldValue("nationAllocation", selected)
//               }
//             >
//               <Picker.Item
//                 label={t(nationAllocationTranslations[NationAllocation.Random])}
//                 value={NationAllocation.Random}
//               />
//               <Picker.Item
//                 label={t(
//                   nationAllocationTranslations[NationAllocation.Preference]
//                 )}
//                 value={NationAllocation.Preference}
//               />
//             </Picker>
//           </View>
//           <View style={styles.section}>
//             <Text>{t(tk.createGame.gameLengthSection.label)}</Text>
//             <View style={styles.inputSelectContainer}>
//               <Input
//                 label={
//                   <Text>
//                     {t(tk.createGame.phaseLengthMultiplierInput.label)}
//                   </Text>
//                 }
//                 containerStyle={styles.inputSelectElement}
//                 accessibilityLabel={t(
//                   tk.createGame.phaseLengthMultiplierInput.label
//                 )}
//                 placeholder={t(tk.createGame.phaseLengthMultiplierInput.label)}
//                 keyboardType={"numeric"}
//                 value={values.phaseLengthMultiplier.toString()}
//                 onChangeText={handleChange("phaseLengthMultiplier")}
//                 shake={shake}
//               />
//               <Picker
//                 style={styles.inputSelectElement}
//                 selectedValue={values.phaseLengthUnit}
//                 onValueChange={(selected) =>
//                   setFieldValue("phaseLengthUnit", selected)
//                 }
//                 accessibilityLabel={t(
//                   tk.createGame.phaseLengthUnitSelect.label
//                 )}
//                 testID={t(tk.createGame.phaseLengthUnitSelect.label)}
//               >
//                 <Picker.Item
//                   label={
//                     singularPhaseLength
//                       ? t(tk.durations.minute.singular)
//                       : t(tk.durations.minute.plural)
//                   }
//                   value={1}
//                 />
//                 <Picker.Item
//                   label={
//                     singularPhaseLength
//                       ? t(tk.durations.hour.singular)
//                       : t(tk.durations.hour.plural)
//                   }
//                   value={60}
//                 />
//                 <Picker.Item
//                   label={
//                     singularPhaseLength
//                       ? t(tk.durations.day.singular)
//                       : t(tk.durations.day.plural)
//                   }
//                   value={60 * 24}
//                 />
//               </Picker>
//             </View>
//             <CheckBox
//               title={t(tk.createGame.customAdjustmentPhaseLengthCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.customAdjustmentPhaseLengthCheckbox.label
//               )}
//               checked={values.customAdjustmentPhaseLength}
//               onPress={() =>
//                 setFieldValue(
//                   "customAdjustmentPhaseLength",
//                   !values.customAdjustmentPhaseLength
//                 )
//               }
//             />
//             {values.customAdjustmentPhaseLength && (
//               <View style={styles.inputSelectContainer}>
//                 <Input
//                   label={
//                     <Text>
//                       {t(
//                         tk.createGame.adjustmentPhaseLengthMultiplierInput.label
//                       )}
//                     </Text>
//                   }
//                   containerStyle={styles.inputSelectElement}
//                   accessibilityLabel={t(
//                     tk.createGame.adjustmentPhaseLengthMultiplierInput.label
//                   )}
//                   placeholder={t(
//                     tk.createGame.adjustmentPhaseLengthMultiplierInput.label
//                   )}
//                   keyboardType={"numeric"}
//                   value={values.adjustmentPhaseLengthMultiplier.toString()}
//                   onChangeText={handleChange("adjustmentPhaseLengthMultiplier")}
//                   shake={shake}
//                 />
//                 <Picker
//                   style={styles.inputSelectElement}
//                   selectedValue={values.adjustmentPhaseLengthUnit}
//                   accessibilityLabel={t(
//                     tk.createGame.adjustmentPhaseLengthUnitSelect.label
//                   )}
//                   testID={t(
//                     tk.createGame.adjustmentPhaseLengthUnitSelect.label
//                   )}
//                   onValueChange={(selected) =>
//                     setFieldValue("adjustmentPhaseLengthUnit", selected)
//                   }
//                 >
//                   <Picker.Item
//                     label={
//                       singularAdjustmentPhaseLength
//                         ? t(tk.durations.minute.singular)
//                         : t(tk.durations.minute.plural)
//                     }
//                     value={1}
//                   />
//                   <Picker.Item
//                     label={
//                       singularAdjustmentPhaseLength
//                         ? t(tk.durations.hour.singular)
//                         : t(tk.durations.hour.plural)
//                     }
//                     value={60}
//                   />
//                   <Picker.Item
//                     label={
//                       singularAdjustmentPhaseLength
//                         ? t(tk.durations.day.singular)
//                         : t(tk.durations.day.plural)
//                     }
//                     value={60 * 24}
//                   />
//                 </Picker>
//               </View>
//             )}
//             <CheckBox
//               title={t(tk.createGame.skipGetReadyPhaseCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.skipGetReadyPhaseCheckbox.label
//               )}
//               checked={values.skipGetReadyPhase}
//               onPress={() =>
//                 setFieldValue("skipGetReadyPhase", !values.skipGetReadyPhase)
//               }
//             />
//             <CheckBox
//               title={t(tk.createGame.endAfterYearsCheckbox.label)}
//               accessibilityLabel={t(tk.createGame.endAfterYearsCheckbox.label)}
//               checked={values.endAfterYears}
//               onPress={() =>
//                 setFieldValue("endAfterYears", !values.endAfterYears)
//               }
//             />
//             {values.endAfterYears && (
//               // TODO enforce minimum value on handleChange
//               <Input
//                 label={<Text>{t(tk.createGame.endAfterYearsInput.label)}</Text>}
//                 containerStyle={styles.inputSelectElement}
//                 accessibilityLabel={t(tk.createGame.endAfterYearsInput.label)}
//                 placeholder={t(tk.createGame.endAfterYearsInput.label)}
//                 keyboardType={"numeric"}
//                 value={values.endAfterYearsValue.toString()}
//                 onChangeText={handleChange("endAfterYearsValue")}
//                 shake={shake}
//               />
//             )}
//           </View>
//           <View>
//             <Text>{t(tk.createGame.chatSection.label)}</Text>
//             <Text>{t(tk.createGame.allowChatsSwitch.label)}</Text>
//             <CheckBox
//               title={t(tk.createGame.conferenceChatCheckbox.label)}
//               accessibilityLabel={t(tk.createGame.conferenceChatCheckbox.label)}
//               checked={values.conferenceChatEnabled}
//               onPress={() =>
//                 setFieldValue(
//                   "conferenceChatEnabled",
//                   !values.conferenceChatEnabled
//                 )
//               }
//             />
//             <CheckBox
//               title={t(tk.createGame.groupChatCheckbox.label)}
//               accessibilityLabel={t(tk.createGame.groupChatCheckbox.label)}
//               checked={values.groupChatEnabled}
//               onPress={() =>
//                 setFieldValue("groupChatEnabled", !values.groupChatEnabled)
//               }
//             />
//             <CheckBox
//               title={t(tk.createGame.individualChatCheckbox.label)}
//               accessibilityLabel={t(tk.createGame.individualChatCheckbox.label)}
//               checked={values.individualChatEnabled}
//               onPress={() =>
//                 setFieldValue(
//                   "individualChatEnabled",
//                   !values.individualChatEnabled
//                 )
//               }
//             />
//             <CheckBox
//               title={t(tk.createGame.anonymousChatCheckbox.label)}
//               accessibilityLabel={t(tk.createGame.anonymousChatCheckbox.label)}
//               checked={values.anonymousEnabled}
//               disabled={!values.privateGame}
//               onPress={() =>
//                 setFieldValue("anonymousEnabled", !values.anonymousEnabled)
//               }
//             />
//             {!values.privateGame && (
//               <Text>{t(tk.createGame.anonymousChatCheckbox.explanation)}</Text>
//             )}
//             <Picker
//               selectedValue={values.chatLanguage}
//               accessibilityLabel={t(tk.createGame.chatLanguageSelect.label)}
//               testID={t(tk.createGame.chatLanguageSelect.label)}
//               onValueChange={(selected) =>
//                 setFieldValue("chatLanguage", selected)
//               }
//             >
//               <Picker.Item
//                 value="players_choice"
//                 label={t(tk.createGame.chatLanguageSelect.defaultOption)}
//               />
//               {isoCodes.map((lang) => (
//                 <Picker.Item
//                   label={lang.name}
//                   key={lang.code}
//                   value={lang.code}
//                 />
//               ))}
//             </Picker>
//           </View>
//           <View style={styles.section}>
//             <Text>{t(tk.createGame.requirementsSection.label)}</Text>
//             <CheckBox
//               title={t(tk.createGame.reliabilityEnabledCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.reliabilityEnabledCheckbox.label
//               )}
//               checked={values.reliabilityEnabled}
//               onPress={() =>
//                 setFieldValue("reliabilityEnabled", !values.reliabilityEnabled)
//               }
//             />
//             {values.reliabilityEnabled && (
//               <>
//                 <Input
//                   label={
//                     <Text>{t(tk.createGame.minReliabilityInput.label)}</Text>
//                   }
//                   containerStyle={styles.inputSelectElement}
//                   accessibilityLabel={t(
//                     tk.createGame.minReliabilityInput.label
//                   )}
//                   placeholder={t(tk.createGame.minReliabilityInput.label)}
//                   keyboardType={"numeric"}
//                   value={values.minReliability.toString()}
//                   onChangeText={handleChange("minReliability")}
//                   shake={shake}
//                 />
//                 {validationErrors.minReliability && (
//                   <Text>
//                     {t(validationErrors.minReliability, {
//                       reliability: userStats?.Reliability?.toFixed(2),
//                     })}
//                   </Text>
//                 )}
//               </>
//             )}
//             <CheckBox
//               title={t(tk.createGame.quicknessEnabledCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.quicknessEnabledCheckbox.label
//               )}
//               checked={values.quicknessEnabled}
//               onPress={() =>
//                 setFieldValue("quicknessEnabled", !values.quicknessEnabled)
//               }
//             />
//             {values.quicknessEnabled && (
//               <>
//                 <Input
//                   label={
//                     <Text>{t(tk.createGame.minQuicknessInput.label)}</Text>
//                   }
//                   containerStyle={styles.inputSelectElement}
//                   accessibilityLabel={t(tk.createGame.minQuicknessInput.label)}
//                   placeholder={t(tk.createGame.minQuicknessInput.label)}
//                   keyboardType={"numeric"}
//                   value={values.minQuickness.toString()}
//                   onChangeText={handleChange("minQuickness")}
//                   shake={shake}
//                 />
//                 {validationErrors.minQuickness && (
//                   <Text>
//                     {t(validationErrors.minQuickness, {
//                       quickness: userStats?.Quickness?.toFixed(2),
//                     })}
//                   </Text>
//                 )}
//               </>
//             )}
//             <CheckBox
//               title={t(tk.createGame.minRatingEnabledCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.minRatingEnabledCheckbox.label
//               )}
//               checked={values.minRatingEnabled}
//               onPress={() =>
//                 setFieldValue("minRatingEnabled", !values.minRatingEnabled)
//               }
//             />
//             {values.minRatingEnabled && (
//               <>
//                 <Input
//                   label={<Text>{t(tk.createGame.minRatingInput.label)}</Text>}
//                   containerStyle={styles.inputSelectElement}
//                   accessibilityLabel={t(tk.createGame.minRatingInput.label)}
//                   placeholder={t(tk.createGame.minRatingInput.label)}
//                   keyboardType={"numeric"}
//                   value={Math.floor(values.minRating).toString()}
//                   onChangeText={handleChangeFloatInput("minRating")}
//                   shake={shake}
//                 />
//                 {validationErrors.minRating && (
//                   <Text>
//                     {t(validationErrors.minRating, {
//                       rating: userStats?.TrueSkill?.Rating?.toFixed(2),
//                     })}
//                   </Text>
//                 )}
//                 <Text>
//                   {t(tk.createGame.minRatingInput.helpText, {
//                     percentage: percentages.minPercentage,
//                   })}
//                 </Text>
//               </>
//             )}
//             <CheckBox
//               title={t(tk.createGame.maxRatingEnabledCheckbox.label)}
//               accessibilityLabel={t(
//                 tk.createGame.maxRatingEnabledCheckbox.label
//               )}
//               checked={values.maxRatingEnabled}
//               onPress={() =>
//                 setFieldValue("maxRatingEnabled", !values.maxRatingEnabled)
//               }
//             />
//             {values.maxRatingEnabled && (
//               <>
//                 <Input
//                   label={<Text>{t(tk.createGame.maxRatingInput.label)}</Text>}
//                   containerStyle={styles.inputSelectElement}
//                   accessibilityLabel={t(tk.createGame.maxRatingInput.label)}
//                   placeholder={t(tk.createGame.maxRatingInput.label)}
//                   keyboardType={"numeric"}
//                   value={Math.floor(values.maxRating).toString()}
//                   onChangeText={handleChangeFloatInput("maxRating")}
//                   shake={shake}
//                 />
//                 {validationErrors.maxRating && (
//                   <Text>
//                     {t(validationErrors.maxRating, {
//                       rating: userStats?.TrueSkill?.Rating?.toFixed(2),
//                     })}
//                   </Text>
//                 )}
//                 <Text>
//                   {t(tk.createGame.maxRatingInput.helpText, {
//                     percentage: percentages.maxPercentage,
//                   })}
//                 </Text>
//               </>
//             )}
//           </View>
//           <View>
//             <Button
//               title={t(tk.createGame.submitButton.label)}
//               accessibilityLabel={t(tk.createGame.submitButton.label)}
//               disabled={submitDisabled}
//               onPress={() => submitForm()}
//             />
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

export default CreateGame;
