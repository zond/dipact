import { TransformedUser, User } from "../store";
import { Adapter } from "./adapter";

class UserAdapter extends Adapter<User, TransformedUser> {
  adapt() {
    return {
      id: this.adaptee.Id,
      src: this.adaptee.Picture,
      username: this.adaptee.Name,
    };
  }
}

export const userAdapter = (user: User) => new UserAdapter(user).adapt();
