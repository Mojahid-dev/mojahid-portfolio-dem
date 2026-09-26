import { isAdmin, passwordConfigured } from "@/lib/auth";
import Admin from "./panel";
export const dynamic = "force-dynamic";
export default async function AdminPage(){return <Admin authenticated={await isAdmin()} configured={passwordConfigured()}/>;}
