// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { login } from "../../../controllers/CustomerController";
import { CustomerRepository } from "../../../services";
import crypto from "crypto";
import { notification } from "antd";
import { get } from "lodash";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Sign in with Email and Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {          
          const customer = await CustomerRepository.login({
            email: credentials?.email,
            password: credentials?.password,
          });
          if (customer?.error) {
            return customer;
          } else {
            const data = customer;
            data["id"] = crypto.randomBytes(32).toString("hex");
            return data
          }
        } catch (err) {
          // console.log(err, "error day");
        }
      },
    }),
    // // OAuth authentication providers
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // // Sign in with passwordless email link
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: process.env.MAIL_FROM,
    // }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({user}) {
      if (user?.error) {
        throw new Error(user?.message);
      }
      return true
    },
    // Goi khi log in, token la payload cua token duoc tao, user la data return o tren
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = user.user;
      }
      return token;
    },
    // DUoc goi khi may cai ham use session, session la cai session se duoc tao gom nhung truong gi, con token la cai tu jwt return ra
    async session({ session, token }) {
      session["id"] = token.id;
      session.user = token.user;
      return session;
    },
    //
    
  },
};

export default NextAuth(authOptions);
