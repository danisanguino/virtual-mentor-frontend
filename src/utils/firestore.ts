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
export const createNewThread = async (newThread: any, setThreads: React.Dispatch<React.SetStateAction<any[]>>, setCurrentThreadId: React.Dispatch<React.SetStateAction<string>>) => {
  const user = auth.currentUser;
  if (user) {
    const threadsRef = collection(db, "users", user.uid, "threads");
    const newThreadRef = doc(threadsRef); // Crea un nuevo documento con ID automático
    await setDoc(newThreadRef, {
      title: newThread.title,
      messages: newThread.messages,
      createdAt: Timestamp.now(), // Usamos Timestamp ahora
    });

    // Guardar el mensaje "system" en la subcolección de mensajes del hilo
    const messagesRef = collection(db, "users", user.uid, "threads", newThreadRef.id, "messages");
    await addDoc(messagesRef, {
      role: 'system',
      content: `Eres un asistente virtual de Virtual Mentor. Responde a todo lo que te pregunten, si te preguntan sobre Virtual Mentor coge la información de la empresa: ${infoCompany}`,
      createdAt: Timestamp.now(), // Usamos Timestamp ahora
    });

    setThreads((prev) => [...prev, newThread]);
    setCurrentThreadId(newThread.id);
  }
};

// Función para guardar un mensaje en Firestore
export const saveMessageToFirestore = async (
  threadId: string,
  role: string,
  content: string
) => {
  try {
    const userId = auth.currentUser?.uid; // Asegúrate de tener un usuario autenticado
    if (!userId) throw new Error('No hay un usuario autenticado');

    const messageRef = doc(db,
      `users/${userId}/threads/${threadId}/messages/${crypto.randomUUID()}`
    );

    const messageData = {
      role,
      content,
      createdAt: Timestamp.now(), // Usamos Timestamp ahora
    };

    console.log('Guardando mensaje en Firestore:', {
      path: messageRef.path,
      data: messageData,
    });

    await setDoc(messageRef, messageData);

    console.log('Mensaje guardado con éxito.');
  } catch (error) {
    console.error('Error al guardar el mensaje en Firestore:', error);
  }
};
