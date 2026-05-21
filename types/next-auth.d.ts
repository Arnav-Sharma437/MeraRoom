import 'next-auth';
import type { UserRole } from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    avatar?: string;
  }
}
