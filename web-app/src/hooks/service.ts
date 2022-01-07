import { diplicityService } from "../store/service";

export const {
  useCreateGameMutation,
  useCreateMessageMutation,
  useDeleteGameMutation,
  useGetGameQuery,
  useGetRootQuery,
  useGetUserConfigQuery,
  useGetUserRatingHistogramQuery,
  useInviteMutation,
  useJoinGameMutation,
  useLazyGetGameQuery,
  useLazyGetUserConfigQuery,
  useLazyGetUserStatsQuery,
  useLazyGetVariantSVGQuery,
  useLazyGetVariantUnitSVGQuery,
  useLazyListPhaseStatesQuery,
  useListChannelsQuery,
  useListGamesQuery,
  useListMessagesQuery,
  useListPhasesQuery,
  useListVariantsQuery,
  useRenameGameMutation,
  useRescheduleGameMutation,
  useUnInviteMutation,
  useUpdatePhaseStateMutation,
  useUpdateUserConfigMutation,
} = diplicityService;
