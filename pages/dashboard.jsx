import { auth, db } from "../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Message from "@/components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai"; 
import Link from "next/link";

export default function Dashboard() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);
    //see if user is logged in 
    const getData = async()=> {
         if (loading) return;
        if (!user) return route.push("/auth/login");
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("user", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsubscribe;
    }

    //Delete post 
    const deletePost = async (id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    }

    //get users data
    useEffect(() => {
        getData();
    }, [user, loading]);

    return (
        <div className="max-w-md mx-auto">
        <h1>Your posts</h1>
        {posts.length === 0 &&(<h1 className="mt-4 text-gray-400 md:text-center">Go post something sincere about Dev-Faith 🥰</h1>)}
            <div>
                {
                    posts.map((post) => {
                        return (
                          <Message {...post} key={post.id}>
                            <div className="flex gap-4">
                              <button
                                onClick={() => deletePost(post.id)}
                                className=" text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                              >
                                <BsTrash2Fill className="text-2xl" />
                                Delete
                              </button>

                              <Link href={{pathname: "/post", query: post}}>
                                <button className=" text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                                  <AiFillEdit className="text-2xl" /> Edit
                                </button>
                              </Link>
                            </div>
                          </Message>
                        );
                    })
            }
            </div>
             <button className="font-medium text-white bg-pink-800 py-2 px-4 my-6 rounded-lg"onClick={()=> auth.signOut()}>Sign Out</button>
        </div>
    );
};