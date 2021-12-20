import { diplicityService } from "../store/service";

export const {
  useCreateGameMutation,
  useCreateMessageMutation,
  useGetRootQuery,
  useGetGameQuery,
  useLazyGetGameQuery,
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
  useRescheduleGameMutation,
} = diplicityService;
