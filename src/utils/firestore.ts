import { db, auth } from '../firebase/firebaseConfig';
import { getDocs, collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { infoCompany } from './info';

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

          // Obtener mensajes desde la subcolección
          const messagesSnapshot = await getDocs(collection(db, 'users', user.uid, 'threads', doc.id, 'messages'));
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

// Función para crear un nuevo hilo
export const createNewThread = async (
  newThread: any,
  setThreads: React.Dispatch<React.SetStateAction<any[]>>,
  setCurrentThreadId: React.Dispatch<React.SetStateAction<string>>
): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    const threadsRef = collection(db, "users", user.uid, "threads");
    const newThreadRef = doc(threadsRef); // Crea un nuevo documento con ID automático
    const threadId = newThreadRef.id; // Obtenemos el ID del hilo

    await setDoc(newThreadRef, {
      title: newThread.title,
      createdAt: Timestamp.now(),
    });

    const messagesRef = collection(db, "users", user.uid, "threads", threadId, "messages");

    // Guardar el mensaje del sistema en la subcolección de mensajes
    await addDoc(messagesRef, {
      role: "system",
      content: newThread.messages[0].content, // Mensaje del sistema
      createdAt: Timestamp.now(),
    });

    setThreads((prev) => [...prev, { ...newThread, id: threadId }]);
    setCurrentThreadId(threadId);

    return threadId; // Devolvemos el ID del hilo creado
  } else {
    throw new Error("No hay un usuario autenticado.");
  }
};

// Función para guardar un mensaje en Firestore
// export const saveMessageToFirestore = async (
//   threadId: string, // ID del hilo donde se quiere guardar el mensaje
//   role: string,     // Rol del usuario (user o assistant)
//   content: string   // El contenido del mensaje
// ) => {
//   try {
//     const userId = auth.currentUser?.uid; // Asegúrate de tener un usuario autenticado
//     if (!userId) throw new Error('No hay un usuario autenticado');

//     // Referencia al mensaje en Firestore, en la colección de threads y subcolección de messages
//     const messageRef = doc(
//       db,
//       `users/${userId}/threads/${threadId}/messages/${crypto.randomUUID()}`
//     );

//     // Los datos del mensaje
//     const messageData = {
//       role,
//       content,
//       createdAt: Timestamp.now(), // Usamos Timestamp ahora
//     };

//     console.log('Guardando mensaje en Firestore:', {
//       path: messageRef.path,
//       data: messageData,
//     });

//     // Guardamos el mensaje
//     await setDoc(messageRef, messageData);

//     console.log('Mensaje guardado con éxito.');
//   } catch (error) {
//     console.error('Error al guardar el mensaje en Firestore:', error);
//   }
// };

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

