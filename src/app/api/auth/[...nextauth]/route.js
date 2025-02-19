import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import { client } from '@/sanity/lib/client';
import { z } from 'zod';
import axios from 'axios';
import { compare } from 'bcryptjs';

// Define the Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Validate the credentials
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error('Invalid credentials');
        }

        // Verify user credentials with Sanity
        const { email, password } = credentials;
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email }
        );

        if (user && (await compare(password, user.password))) {
          return user;
        } else {
          return null;
        }
      },
    }),
    SanityCredentials(client), // only if you use sign in with credentials
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: SanityAdapter(client),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/admin/login',
    signOut: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };