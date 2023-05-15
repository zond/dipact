import { DiplicityApiBuilder } from "../diplicity.types";
import { transformCreateGameFormValuesToNewGame } from "./transform";
import {
  CreateGameFormValues,
  DiplicityApiNewGame,
  DiplicityApiResponse,
  Game,
} from "./types";

const createGame = (builder: DiplicityApiBuilder) =>
  builder.mutation<Game, CreateGameFormValues>({
    query: (data) => {
      return {
        url: "/Game",
        method: "POST",
        body: transformCreateGameFormValuesToNewGame(data),
      };
    },
    transformResponse: (
      response: DiplicityApiResponse<DiplicityApiNewGame>
    ) => {
      return gameAdapter(extractProperties(response));
    },
  });
