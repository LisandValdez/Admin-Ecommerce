import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { mongooseConnect } from '@/lib/mongoose'
import { Admin } from "@/models/admin";


async function getAdminEmails() {
  await mongooseConnect();
  const admins = await Admin.find({}, {email: 1, _id: 0});
  return admins.map(admin => admin.email);
}






export const authOptions = ({  
  providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET
  }),
],
adapter: MongoDBAdapter(clientPromise),
callbacks: {
  session: async ({session,token,user}) =>{
    const adminEmails = await getAdminEmails();
    if(adminEmails.includes(session?.user?.email)) {
      return session;
   }
    else {
      return false;
    }
  },
},
});

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const adminEmails = await getAdminEmails();
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}