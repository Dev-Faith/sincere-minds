import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, Timestamp, updateDoc, onSnapshot } from 'firebase/firestore';

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //submit a message
  const submitMessage = async () => {
    //check if the user is logged
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message 👀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

      setMessage("");
    toast.success("You just made a comment 🗣️", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
  };

  //Get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
      return unsubscribe;
    // const docSnap = await getDoc(docRef);
    // setAllMessages(docSnap.data().comments);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]); //add submitMessage into the array if you want to use the other method (without snapshot)!

  return (
    <div className="max-w-md mx-auto">
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-800 p-2 text-white w-full text-sm "
            placeholder="Type your comment ✉️"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Send
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div key={message.time} className="bg-white my-4 p-4 border-2 ">
              <div className="flex items-center gap-2 mb-4 ">
                <img className="w-10 rounded-full" src={message.avatar} />
                <h2>{message.username}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};