import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import Image from "next/image";

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    return (
      <nav className="flex justify-between items-center py-10">
        <Link href="/">
          <button className="text-lg font-medium border-b-2 hover:border-cyan-400">Sincere<span className="text-cyan-600">~</span>Minds</button>
        </Link>
        <ul className="flex items-center gap-10">
          {!user && (
            <Link
              href={"/auth/login"}
              className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8"
            >
              Join Now
            </Link>
          )}
          {user && (
            <div className="flex items-center gap-6 ">
              <Link href="/post">
                <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">Post</button>
              </Link>
              <Link href="/dashboard">
                <img src={user.photoURL} alt="user-photo" className="rounded-full w-12 cursor-pointer"/> 
              </Link>
            </div>
          )}
        </ul>
      </nav>
    );
}