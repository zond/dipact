import { diplicityService } from "../store/service";

export const {
  useCreateGameMutation,
  useCreateMessageMutation,
  useGetRootQuery,
  useGetGameQuery,
  useGetUserConfigQuery,
  useGetUserRatingHistogramQuery,
  useListChannelsQuery,
  useListGamesQuery,
  useListMessagesQuery,
  useListPhasesQuery,
  useLazyGetVariantSVGQuery,
  useLazyGetVariantUnitSVGQuery,
  useLazyListPhaseStatesQuery,
  useListVariantsQuery,
  useUpdateUserConfigMutation,
  useUpdatePhaseStateMutation,
  useJoinGameMutation,
} = diplicityService;
