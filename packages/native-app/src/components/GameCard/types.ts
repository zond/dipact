import { GameDisplay as OriginalGameDisplay } from "@diplicity/common";

export type GameDisplay = OriginalGameDisplay & {
    status: "Staging" | "Active" | "Ended";
    confirmationStatus: undefined | "Confirmed" | "NotConfirmed" | "NMR";
}