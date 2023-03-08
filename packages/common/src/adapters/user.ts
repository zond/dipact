import { TransformedUser, User } from "../store";

class UserAdapter extends Adapter<User> implements TransformedUser {
  get id() {
    return this.adaptee.Id;
  }
  get src() {
    return this.adaptee.Picture;
  }
  get username() {
    return this.adaptee.Name;
  }
}

export const userAdapter = (user: User) => new UserAdapter(user);
