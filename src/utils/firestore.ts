import { db, auth } from '../firebase/firebaseConfig';
import { getDocs, collection, doc, setDoc, addDoc, Timestamp, query, orderBy, deleteDoc, where } from 'firebase/firestore';

// Función para obtener los datos del usuario y cargar los hilos
export const fetchUserData = async (
  setUserName: React.Dispatch<React.SetStateAction<string | null>>,
  setThreads: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const user = auth.currentUser;
  if (user) {
    setUserName(user.displayName || 'Usuario');

    try {
      const threadsSnapshot = await getDocs(collection(db, 'users', user.uid, 'threads'));
      const userThreads = await Promise.all(
        threadsSnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // get messages from collection and sort by createdAt
          const messagesRef = collection(db, 'users', user.uid, 'threads', doc.id, 'messages');
          const messagesQuery = query(messagesRef, orderBy('createdAt'));
          const messagesSnapshot = await getDocs(messagesQuery);
          const messages = messagesSnapshot.docs.map((messageDoc) => ({
            ...messageDoc.data(),
            id: messageDoc.id,
          }));

          return {
            id: doc.id,
            title: data.title || 'Untitled',
            messages: messages,
          };
        })
      );

      setThreads(userThreads); // Establecer los hilos del usuario
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
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

    // Guardar el mensaje del sistema en la subcolección de mensajes
    await addDoc(messagesRef, {
      role: "system",
      content: newThread.messages[0].content, 
      createdAt: Timestamp.now(),
    });

    setThreads((prev) => [...prev, { ...newThread, id: threadId }]);
    setCurrentThreadId(threadId);

    return threadId; // Devolvemos el ID del hilo creado
  } else {
    throw new Error("No hay un usuario autenticado.");
  }
};


// Función para guardar un mensaje en un hilo existente

export const saveMessageToThread = async (
  threadId: string, // ID del hilo donde se quiere guardar el mensaje
  role: string,     // Rol del usuario que envía el mensaje (user/assistant)
  content: string   // El contenido del mensaje
) => {
  const user = auth.currentUser; // Usuario autenticado
  if (user) {
    try {
      // Referencia a la subcolección "messages" dentro del hilo
      const messagesRef = collection(
        db,
        `users/${user.uid}/threads/${threadId}/messages`
      );

      // Crea un nuevo documento para el mensaje
      const newMessageRef = doc(messagesRef); // Genera un ID único automáticamente

      const messageData = {
        role,
        content,
        createdAt: Timestamp.now(), // Marca de tiempo actual
      };

      // Guarda el mensaje en la subcolección
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
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('No hay un usuario autenticado.');

    const threadRef = doc(db, `users/${userId}/threads/${threadId}`);
    console.log(`Intentando eliminar hilo con referencia: ${threadRef.path}`);

    await deleteDoc(threadRef);
    console.log(`Hilo con ID ${threadId} eliminado correctamente de Firestore.`);
  } catch (error) {
    const errorMessage = (error as any).message || error;
    console.error('Error al eliminar el hilo de Firestore:', errorMessage);
    throw error; // Re-lanza el error para que puedas ver los detalles.
  }
};

// Función para obtener los hilos desde Firestore
// export const getThreads = async () => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("No hay un usuario autenticado.");

//   try {
//     const threadsSnapshot = await getDocs(collection(db, 'users', user.uid, 'threads'));
//     const threads = await Promise.all(
//       threadsSnapshot.docs.map(async (doc) => {
//         const data = doc.data();

//         // Obtener mensajes del hilo
//         const messagesRef = collection(db, 'users', user.uid, 'threads', doc.id, 'messages');
//         const messagesQuery = query(messagesRef, orderBy('createdAt'));
//         const messagesSnapshot = await getDocs(messagesQuery);
//         const messages = messagesSnapshot.docs.map((messageDoc) => ({
//           ...messageDoc.data(),
//           id: messageDoc.id,
//         }));

//         return {
//           id: doc.id,
//           title: data.title || 'Untitled',
//           messages: messages,
//         };
//       })
//     );

//     return threads;
//   } catch (error) {
//     console.error("Error al obtener los hilos:", error);
//     throw error;
//   }
// };
