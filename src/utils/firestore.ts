import { db, auth } from '../firebase/firebaseConfig';
import { getDocs, collection, doc, setDoc, addDoc, Timestamp, query, orderBy, writeBatch, getDoc } from 'firebase/firestore';

// get users name and threads
export const fetchUserData = async (
  setUserName: React.Dispatch<React.SetStateAction<string | null>>,
  setThreads: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserName(userSnap.data().name || "Usuario"); 
      } else {
        setUserName("Usuario desconocido");
      }

      
      const threadsSnapshot = await getDocs(collection(db, "users", user.uid, "threads"));
      const userThreads = await Promise.all(
        threadsSnapshot.docs.map(async (doc) => {
          const data = doc.data();

          const messagesRef = collection(db, "users", user.uid, "threads", doc.id, "messages");
          const messagesQuery = query(messagesRef, orderBy("createdAt"));
          const messagesSnapshot = await getDocs(messagesQuery);
          const messages = messagesSnapshot.docs.map((messageDoc) => ({
            ...messageDoc.data(),
            id: messageDoc.id,
          }));

          return {
            id: doc.id,
            title: data.title || "Untitled",
            messages: messages,
          };
        })
      );

      setThreads(userThreads);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  }
};

// Create a new thread
export const createNewThread = async (
  newThread: any,
  setThreads: React.Dispatch<React.SetStateAction<any[]>>,
  setCurrentThreadId: React.Dispatch<React.SetStateAction<string>>
): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    const threadsRef = collection(db, "users", user.uid, "threads");
    const newThreadRef = doc(threadsRef); 
    const threadId = newThreadRef.id; 

    await setDoc(newThreadRef, {
      title: newThread.title,
      createdAt: Timestamp.now(),
    });

    const messagesRef = collection(db, "users", user.uid, "threads", threadId, "messages");

    await addDoc(messagesRef, {
      role: "system",
      content: newThread.messages[0].content, 
      createdAt: Timestamp.now(),
    });

    setThreads((prev) => [...prev, { ...newThread, id: threadId }]);
    setCurrentThreadId(threadId);

    return threadId; 
  } else {
    throw new Error("No hay un usuario autenticado.");
  }
};

// Función para guardar un mensaje en un hilo existente
export const saveMessageToThread = async (
  threadId: string, 
  role: string,     
  content: string   
) => {
  const user = auth.currentUser; 
  if (user) {
    try {
      const messagesRef = collection(
        db,
        `users/${user.uid}/threads/${threadId}/messages`
      );

      const newMessageRef = doc(messagesRef); 

      const messageData = {
        role,
        content,
        createdAt: Timestamp.now(), 
      };

      await setDoc(newMessageRef, messageData);

      console.log("Mensaje guardado correctamente en el hilo:", threadId);
    } catch (error) {
      console.error("Error al guardar el mensaje en el hilo:", error);
    }
  } else {
    console.error("No hay un usuario autenticado.");
  }
};


export const deleteThread = async (threadId: string) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const threadRef = doc(db, `users/${user.uid}/threads/${threadId}`);

      const messagesRef = collection(db, `users/${user.uid}/threads/${threadId}/messages`);
      const messagesSnapshot = await getDocs(messagesRef);
      const batch = writeBatch(db);

      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      
      batch.delete(threadRef); 

     
      await batch.commit();

      console.log(`Hilo con ID ${threadId} y sus mensajes eliminados correctamente de Firestore.`);
    } catch (error) {
      console.error("Error al eliminar el hilo y sus mensajes de Firestore:", error);
      throw error; 
    }
  } else {
    console.error("No hay un usuario autenticado.");
  }
};