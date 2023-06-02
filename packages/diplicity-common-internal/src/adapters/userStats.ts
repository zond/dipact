import { Adapter } from "./adapter";
import { UserStats, TransformedUserStats } from "../store";

class UserStatsAdapter extends Adapter<UserStats, TransformedUserStats> {
  private getReliabilityLabel(): TransformedUserStats["reliabilityLabel"] {
    if (this.adaptee.Reliability > 0.5) {
      return "commited";
    }
    if (this.adaptee.Reliability < -0.5) {
      return "disengaged";
    }
    return "uncommited";
  }

  adapt() {
    return {
      id: this.adaptee.UserId,
      username: this.adaptee.User.Name,
      src: this.adaptee.User.Picture,
      mu: this.adaptee.TrueSkill?.Mu,
      numAbandonedGames: this.adaptee.DroppedGames,
      numDrawnGames: this.adaptee.DIASGames,
      numEliminatedGames: this.adaptee.EliminatedGames,
      numFinishedGames: this.adaptee.FinishedGames,
      numJoinedGames: this.adaptee.JoinedGames,
      numNmrPhases: this.adaptee.NMRPhases,
      numSoloWinGames: this.adaptee.SoloGames,
      numStartedGames: this.adaptee.StartedGames,
      quickness: this.adaptee.Quickness,
      rating: this.adaptee.TrueSkill?.Rating,
      reliability: this.adaptee.Reliability,
      reliabilityLabel: this.getReliabilityLabel(),
      sigma: this.adaptee.TrueSkill?.Sigma,
    };
  }
}

export const userStatsAdapter = (userStats: UserStats) =>
  new UserStatsAdapter(userStats).adapt();
