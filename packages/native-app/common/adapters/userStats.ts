import { Adapter } from "./types";
import { UserStats, TransformedUserStats } from "../store";

class UserStatsAdapter
  extends Adapter<UserStats>
  implements TransformedUserStats
{
  get id() {
    return this.adaptee.UserId;
  }
  get mu() {
    return this.adaptee.TrueSkill?.Mu;
  }
  get numAbandoned() {
    return this.adaptee.DroppedGames;
  }
  get numDraws() {
    return 0;
  }
  get numEliminated() {
    return this.adaptee.EliminatedGames;
  }
  get numFinishedGames() {
    return this.adaptee.FinishedGames;
  }
  get numJoinedGames() {
    return this.adaptee.JoinedGames;
  }
  get numNmrPhases() {
    return this.adaptee.NMRPhases;
  }
  get numSoloWins() {
    return this.adaptee.SoloGames;
  }
  get numStartedGames() {
    return this.adaptee.StartedGames;
  }
  get quickness() {
    return this.adaptee.Quickness;
  }
  get rating() {
    return this.adaptee.TrueSkill?.Rating;
  }
  get reliability() {
    return this.adaptee.Reliability;
  }
  get sigma() {
    return this.adaptee.TrueSkill?.Sigma;
  }
}

export const userStatsAdapter = (userStats: UserStats) =>
  new UserStatsAdapter(userStats);
