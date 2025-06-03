import {
  User,
  type PopulatedUserDoc,
  type UserUpdateAttrs,
} from "../models/user";
import { BadRequestError, NotFoundError } from "../errors";

export const findByClerkId = async (clerkId: string) => {
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

export const findById = async (id: string) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

export const findByIdWithFriends = async (id: string) => {
  const user = (await User.findOne({ _id: id }).populate(
    "friends"
  )) as PopulatedUserDoc | null;
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

export const updateByClerkId = async (
  clerkId: string,
  changes: Partial<UserUpdateAttrs>
) => {
  const updatedUser = await User.findOneAndUpdate(
    { clerkId },
    { $set: changes },
    { new: true }
  );
  if (!updatedUser) {
    throw new BadRequestError(`User with clerkId "${clerkId}" not found.`);
  }
  return updatedUser;
};

export const getUserProfileView = async (
  currentUserClerkId: string,
  id: string
) => {
  const [user, currentUser] = await Promise.all([
    findById(id),
    findByClerkId(currentUserClerkId),
  ]);
  const userFriends = user.friends || [];
  const currentUserFriends = currentUser?.friends || [];
  const mutualFriends = userFriends.filter((friendId) =>
    currentUserFriends.some((id) => id.toString() === friendId.toString())
  );
  return {
    id: user.id,
    bio: user.bio,
    email: user.email,
    status: user.status,
    fullname: user.fullname,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    mutualFriends: mutualFriends.length,
  };
};
