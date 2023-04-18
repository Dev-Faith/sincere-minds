import Image from 'next/image'
import Message from "../components/message";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from "next/link";

export default function Home() {
  //create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);
  console.log(allPosts);
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id})))
    });
    return unsubscribe;
  }

  useEffect(()=>{
    getPosts();
  }, [])
  return (
    <div className="my-12 text-lg font-medium max-w-md mx-auto md:text-center">
      <h2 className="ml-8">See what other people are saying about Dev-Faith! 😯</h2>
      {allPosts.length === 0 && (
        <h2 className="mt-8 ml-8 text-gray-400">No one has posted yet! Be the first! 😜</h2>
      )}
      {allPosts.map((post) => (
        <Message key={post.id} {...post}>
          <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
            <button className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium mt-4">
              {post.comments?.length > 0 ? post.comments?.length : "0"} comments
            </button>
          </Link>
        </Message>
      ))}
    </div>
  );
}
