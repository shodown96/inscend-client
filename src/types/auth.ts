
export interface User {
  id: string;
  name: string;
  email: string;
  password: boolean;
  avatarId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  deleted: boolean;
  deletedAt: null;
  banned: boolean;
  bannedAt: null;
  avatar?: Avatar;
  business?: Business,
  businessId?: string
}

export interface Business {
  id: string
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Avatar {
  id: string
  url: string;
}

export interface SignInResult {
  user: User,
  accessToken: string,
  refreshToken: string
}

export interface SignUpResult extends SignInResult { }