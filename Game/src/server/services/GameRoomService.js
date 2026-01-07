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
        ready: false,
      },
      player2: {
        ws: player2Ws,
        score: 0,
        ready: false,
      },
      active: true, // Room is active

      candy: null,
      item: null,
      speedPowerUp: null

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

    // Genera múltiples items
    room.items = [];
    for (let i = 0; i < 5; i++) {
      const newItem = spawnItem(room);
      room.items.push(newItem);
    }

    // Genera power-up de velocidad (foco)
    room.speedPowerUp = spawnSpeedPowerUp(room);

  }

  // Generar y enviar power-up 
  function spawnSpeedPowerUp(room) {
    const powerUp = {
      id: `speed_${Date.now()}`,
      x: 600,
      y: 400,
      active: true
    };

    [room.player1.ws, room.player2.ws].forEach(ws => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({
          type: 'POWERUP_SPAWN',
          powerUp
        }));
      }
    });

    return powerUp;
  }


  // Generar y enviar un item
  function spawnItem(room) {
    const itemTypes = ['pumpkin1', 'pumpkin2', 'pumpkin3', 'rock'];
    const sprite = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    let x, y;
    let tries = 0;
    do {
      x = Math.floor(Math.random() * (1200 - 128) + 64);
      y = Math.floor(Math.random() * (800 - 128) + 64);
      tries++;
    } while (room.items.some(it => Math.abs(it.x - x) < 64 && Math.abs(it.y - y) < 64) && tries < 10);

    const item = {
      id: `item_${Date.now()}_${Math.random()}`, // id único
      x,
      y,
      sprite
    };

    [room.player1.ws, room.player2.ws].forEach(ws => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'ITEM_SPAWN', item }));
      }
    });

    return item;
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

  function handleCandyCollected(ws, candyId) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    //Evitar duplicados
    if (!room.candy || room.candy.id !== candyId) {
      return; // Caramelo no coincide o ya fue recogido
    }
    // Update scores
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

    //Determinar quién recogió el caramelo y si es válido (dentro del área correcta)
    let player;
    if (room.player1.ws === ws) {
      player = room.player1;
    } else if (room.player2.ws === ws) {
      player = room.player2;
    } else {
      return; // Jugador no pertenece a la sala
    }
    //Actualizar puntuación
    player.score += 1;
    room.candy = null; // Caramelo recogido ya no existe
    //Notificar a ambos jugadores
    const scoreUpdate = {
      type: 'SCORE_UPDATE',
      player1Score: room.player1.score,
      player2Score: room.player2.score
    };
    room.player1.ws.send(JSON.stringify(scoreUpdate));
    room.player2.ws.send(JSON.stringify(scoreUpdate));

    //Generar nuevo caramelo si la ronda sigue viva
    setTimeout(() => {
      if (room.active) {
        room.candy = spawnCandy(room);
      }
    }, 1000); // 1 segundo de retraso antes de reaparecer

  }

  function handlePowerUpCollected(ws, powerUpId) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    if (!room.speedPowerUp || !room.speedPowerUp.active) return;
    if (room.speedPowerUp.id !== powerUpId) return;

    room.speedPowerUp.active = false;

    let playerRole =
      room.player1.ws === ws ? 'player1' :
        room.player2.ws === ws ? 'player2' :
          null;

    if (!playerRole) return;

    // Avisar a ambos
    [room.player1.ws, room.player2.ws].forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'POWERUP_DESPAWN',
          powerUpId,
          player: playerRole
        }));
      }
    });

    // Respawn tras 5s
    setTimeout(() => {
      if (room.active) {
        room.speedPowerUp = spawnSpeedPowerUp(room);
      }
    }, 5000);
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
    spawnCandy,
    handleCandyCollected,
    handlePowerUpCollected,
    handleDisconnect,
    getActiveRoomCount
  };

}
