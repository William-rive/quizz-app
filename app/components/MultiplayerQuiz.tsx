// // [app/components/MultiplayerQuiz.tsx](app/components/MultiplayerQuiz.tsx)
// 'use client';

// import { useRouter } from 'next/navigation';
// import React, { useContext, useEffect, useState } from 'react';
// import { UserContext } from '../context/UserContext';
// import { Button } from './ui/button';

// interface Player {
//   id: string;
//   name: string;
// }

// interface MultiplayerQuizProps {
//   roomId?: string;
// }

// const MultiplayerQuiz: React.FC<MultiplayerQuizProps> = ({ roomId }) => {
//   const { playerName, setPlayerName, socket } = useContext(UserContext);
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isJoining, setIsJoining] = useState<boolean>(false);
//   const [joinRoomId, setJoinRoomId] = useState<string>('');
//   const router = useRouter();

//   // Écouteurs d'événements configurés une seule fois
//   useEffect(() => {
//     const handleUpdatePlayers = (data: Player[]) => {
//       console.log('Événement updatePlayers reçu :', data);
//       setPlayers(data);
//     };

//     const handleError = (message: string) => {
//       console.error('Erreur Socket.IO :', message);
//       setError(message);
//     };

//     const handleConnect = () => {
//       console.log('Connecté au serveur Socket.io');
//       if (roomId && playerName.trim()) {
//         socket.emit(
//           'joinRoom',
//           { roomId, playerName },
//           (response: { success?: boolean; error?: string }) => {
//             if (response.error) {
//               setError(response.error);
//             }
//           },
//         );
//       }
//     };

//     const handleDisconnect = () => {
//       console.log('Déconnecté du serveur Socket.io');
//     };

//     socket.on('updatePlayers', handleUpdatePlayers);
//     socket.on('error', handleError);
//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);

//     // Nettoyage lors du démontage du composant
//     return () => {
//       socket.off('updatePlayers', handleUpdatePlayers);
//       socket.off('error', handleError);
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//     };
//   }, [socket, roomId, playerName]); // Gardez roomId et playerName si nécessaire

//   // Autre useEffect pour gérer les dépendances spécifiques
//   useEffect(() => {
//     if (roomId && playerName.trim()) {
//       socket.emit(
//         'joinRoom',
//         { roomId, playerName },
//         (response: { success?: boolean; error?: string }) => {
//           if (response.error) {
//             setError(response.error);
//           }
//         },
//       );
//     }
//   }, [roomId, playerName, socket]);

//   const handleCreateRoom = () => {
//     if (!playerName.trim()) {
//       alert('Veuillez entrer un nom pour créer une salle.');
//       return;
//     }

//     console.log('Création de la salle avec le nom :', playerName);

//     socket.emit(
//       'createRoom',
//       { playerName },
//       (response: { roomId?: string; error?: string }) => {
//         if (response.error) {
//           console.error(
//             'Erreur lors de la création de la salle :',
//             response.error,
//           );
//           setError(response.error);
//         } else if (response.roomId) {
//           console.log("Salle créée avec l'ID :", response.roomId);

//           // Attendre l'événement `updatePlayers` avant de rediriger
//           const handleUpdatePlayersOnce = (data: Player[]) => {
//             console.log('Événement updatePlayers reçu :', data);
//             if (data.length === 1 && data[0].id === socket.id) {
//               router.push(`/multiplayer/${response.roomId}`);
//               socket.off('updatePlayers', handleUpdatePlayersOnce);
//             }
//           };

//           socket.on('updatePlayers', handleUpdatePlayersOnce);
//         }
//       },
//     );
//   };

//   const handleJoinRoom = () => {
//     setIsJoining(true);
//     console.log('Affichage du champ de saisie pour rejoindre une salle');
//   };

//   const submitJoinRoom = () => {
//     if (!playerName.trim() || !joinRoomId.trim()) {
//       alert('Veuillez entrer un nom et un code de salle.');
//       return;
//     }

//     console.log('Tentative de rejoindre la salle :', joinRoomId);

//     socket.emit(
//       'joinRoom',
//       { roomId: joinRoomId, playerName },
//       (response: { success?: boolean; error?: string }) => {
//         if (response.error) {
//           console.error(
//             'Erreur lors de la jonction de la salle :',
//             response.error,
//           );
//           setError(response.error);
//         } else {
//           console.log('Rejoint la salle :', joinRoomId);
//           router.push(`/multiplayer/${joinRoomId}`);
//         }
//       },
//     );
//   };

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <div>
//       {!roomId ? (
//         <div className="flex flex-col justify-center items-center gap-4">
//           <h2 className="text-3xl">Créer ou rejoindre une salle</h2>
//           <div className="flex flex-col gap-4">
//             <input
//               type="text"
//               placeholder="Votre nom"
//               value={playerName}
//               onChange={e => setPlayerName(e.target.value)}
//               className="border rounded p-2"
//             />
//             {!isJoining ? (
//               <div className="flex gap-4">
//                 <Button onClick={handleCreateRoom}>Créer une salle</Button>
//                 <Button onClick={handleJoinRoom}>Rejoindre la salle</Button>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   placeholder="Code de la salle"
//                   value={joinRoomId}
//                   onChange={e => setJoinRoomId(e.target.value)}
//                   className="border rounded p-2"
//                 />
//                 <Button onClick={submitJoinRoom}>Valider</Button>
//                 <Button onClick={() => setIsJoining(false)}>Annuler</Button>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div>
//           <h2>Salle : {roomId}</h2>
//           <h3 className="text-xl">Joueurs ({players.length}) :</h3>
//           <ul>
//             {players.length > 0 ? (
//               players.map(player => <li key={player.id}>{player.name}</li>)
//             ) : (
//               <li>Aucun joueur pour le moment.</li>
//             )}
//           </ul>
//           <Button onClick={() => router.push('/multiplayer')}>
//             Quitter la salle
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiplayerQuiz;
