import NextAuth from "next-auth";
import Providers from 'next-auth/providers';
import {fauna} from "../../../services/fauna";
import { query } from "faunadb";


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
      scope: "read:user"
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNIN_KEY,
  },
  callbacks: {
    async signIn (user, account, profile) {
        try{
          await fauna.query(
            query.If(
              query.Not(
                query.Exists(
                  query.Match(
                      query.Index("users_email"), query.Casefold(user.email))
                  )
                ),
                query.Create(
                    query.Collection("users"),{data: {email: user.email}}),
                query.Get(
                  query.Match(
                    query.Index("users_email"), query.Casefold(user.email))
                )
              )
            )
          return true;
        } catch {
          return false;
        }
      }
    }
  }
)