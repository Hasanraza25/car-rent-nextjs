import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // Check if the provided credentials match the hardcoded admin credentials
        if (email === adminEmail && password === adminPassword) {
          return { email };
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/admin/login',
    signOut: '/',
    error: '/admin/login', // Redirect to login page on error
  },
};

// Export named handlers for each HTTP method
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);