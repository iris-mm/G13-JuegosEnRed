/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        score: 0,
        ready: false
      },
      player2: {
        ws: player2Ws,
        score: 0,
        ready: false
      },
      active: true, // Room is active

      candy: null 
    };

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    // @ts-ignore
    player1Ws.roomId = roomId;
    // @ts-ignore
    player2Ws.roomId = roomId;

    return roomId;
  }

  function setPlayerReady(ws) {
    const room = Array.from(rooms.values()).find(r =>
      r.player1.ws === ws || r.player2.ws === ws
    );

    if (!room || !room.active) return;

    if (room.player1.ws === ws) {
      room.player1.ready = true;
      console.log('Player 1 ready');
    } else if (room.player2.ws === ws) {
      room.player2.ready = true;
      console.log('Player 2 ready');
    }

    console.log(
      'Ready status:',
      room.player1.ready,
      room.player2.ready
    );

    if (room.player1.ready && room.player2.ready) {
      console.log('Both players ready → START_GAME');
      startGame(room);
    }
  }

 function startGame(room) {
    //Notifica a los jugadores
    const startMsgPlayer1 = JSON.stringify({
        type: 'START_GAME',
        roomId: room.id,
        role: 'player1'
    });
    const startMsgPlayer2 = JSON.stringify({
        type: 'START_GAME',
        roomId: room.id,
        role: 'player2'
    });
    room.player1.ws.send(startMsgPlayer1);
    room.player2.ws.send(startMsgPlayer2);

    //Genera caramelo inicial en posición random
    room.candy = spawnCandy(room);
}


  //Crea y envía la posición del caramelo a ambos jugadores
  function spawnCandy(room) {
    const candy = {
        id: `candy_${Date.now()}`, // ID único
        x: Math.floor(Math.random() * (1200 - 512) + 256), // entre 256 y 1200-256
        y: Math.floor(Math.random() * (800 - 256) + 128)   // entre 128 y 800-128
    };

    // Mandar a los dos jugadores
    if (room.player1.ws.readyState === 1) {
        room.player1.ws.send(JSON.stringify({ type: 'CANDY_SPAWN', candy }));
    }
    if (room.player2.ws.readyState === 1) {
        room.player2.ws.send(JSON.stringify({ type: 'CANDY_SPAWN', candy }));
    }

    return candy;
}

  /**
   * Handle paddle movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {number} y - y position
   * @param {number} x - x position
   */
  // function handlePaddleMove(ws, y) {
  //   const roomId = ws.roomId;
  //   if (!roomId) return;

  //   const room = rooms.get(roomId);
  //   if (!room || !room.active) return;

  //   // Relay to the other player
  //   const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

  //   if (opponent.readyState === 1) { // WebSocket.OPEN
  //     opponent.send(JSON.stringify({
  //       type: 'paddleUpdate',
  //       y
  //     }));
  //   }
  // }

  // /**
  //  * Handle goal event from a player
  //  * @param {WebSocket} ws - Player's WebSocket
  //  * @param {string} side - Which side scored ('left' or 'right')
  //  */
  // function handleGoal(ws, side) {
  //   const roomId = ws.roomId;
  //   if (!roomId) return;

  //   const room = rooms.get(roomId);
  //   if (!room || !room.active) return;

  //   // Prevent duplicate goal detection (both clients send goal event)
  //   // Only process goal if ball is active
  //   if (!room.ballActive) {
  //     return; // Ball not in play, ignore goal
  //   }
  //   room.ballActive = false; // Mark ball as inactive until relaunched

  //   // Update scores
  //   // When ball hits LEFT goal (x=0), player2 scores (player1 missed)
  //   // When ball hits RIGHT goal (x=800), player1 scores (player2 missed)
  //   if (side === 'left') {
  //     room.player2.score++;
  //   } else if (side === 'right') {
  //     room.player1.score++;
  //   }

  //   // Broadcast score update to both players
  //   const scoreUpdate = {
  //     type: 'scoreUpdate',
  //     player1Score: room.player1.score,
  //     player2Score: room.player2.score
  //   };

  //   room.player1.ws.send(JSON.stringify(scoreUpdate));
  //   room.player2.ws.send(JSON.stringify(scoreUpdate));

  //   // Check win condition (first to 2)
  //   if (room.player1.score >= 2 || room.player2.score >= 2) {
  //     const winner = room.player1.score >= 2 ? 'player1' : 'player2';

  //     const gameOverMsg = {
  //       type: 'gameOver',
  //       winner,
  //       player1Score: room.player1.score,
  //       player2Score: room.player2.score
  //     };

  //     room.player1.ws.send(JSON.stringify(gameOverMsg));
  //     room.player2.ws.send(JSON.stringify(gameOverMsg));

  //     // Mark room as inactive
  //     room.active = false;
  //   } else {
  //     // Relaunch ball after 1 second delay
  //     setTimeout(() => {
  //       if (room.active) {
  //         // Generate new ball direction
  //         const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
  //         const speed = 300;
  //         const ballData = {
  //           x: 400,
  //           y: 300,
  //           vx: speed * Math.cos(angle),
  //           vy: speed * Math.sin(angle)
  //         };

  //         // Send ball relaunch to both players
  //         const relaunchMsg = {
  //           type: 'ballRelaunch',
  //           ball: ballData
  //         };

  //         room.player1.ws.send(JSON.stringify(relaunchMsg));
  //         room.player2.ws.send(JSON.stringify(relaunchMsg));

  //         // Mark ball as active again
  //         room.ballActive = true;
  //       }
  //     }, 1000);
  //   }
  // }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    // @ts-ignore
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        //Diferenciar entre Lobby y MultiplayerGameScene
        if (opponent.inLobby) {
          opponent.send(JSON.stringify({
            type: 'playerNotConnected'
          }));
        } else {
          opponent.send(JSON.stringify({
            type: 'playerDisconnected'
          }));
        }
      }

      // Clean up room
      room.active = false;
      rooms.delete(roomId);
    }
  }



  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    setPlayerReady,
    // handlePaddleMove,
    // handleGoal,
    handleDisconnect,
    getActiveRoomCount
  };
}
