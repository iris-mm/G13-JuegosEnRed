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
      started: false,
      candy: null,
      items: [],
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

    // Inicializar flag si no existe
    if (room.started === undefined) {
        room.started = false;
    }

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

    //IMPORTANTE: solo iniciar si NO ha empezado antes
    if (room.player1.ready && room.player2.ready && !room.started) {
        room.started = true; // Marcar como iniciado
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
      y: Math.floor(Math.random() * (800 - 256) + 128), // entre 128 y 800-128
      taken: false,
      owner: null   
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


  function handleCandyDelivered(ws) {
    const room = rooms.get(ws.roomId);
    if (!room || !room.active) return;

    const player =
      room.player1.ws === ws ? room.player1 :
      room.player2.ws === ws ? room.player2 :
      null;

    if (!player) return;

    player.score = (player.score || 0) + 1;

    const scoreUpdate = {
      type: 'SCORE_UPDATE',
      player1Score: room.player1.score || 0,
      player2Score: room.player2.score || 0
    };

    room.player1.ws.send(JSON.stringify(scoreUpdate));
    room.player2.ws.send(JSON.stringify(scoreUpdate));

    // Eliminar caramelo
    room.candy = null;

    setTimeout(() => {
      if (room.active) {
        room.candy = spawnCandy(room);
      }
    }, 3000);
  }

  function handleCandyCollected(ws, candyId) {
    const room = rooms.get(ws.roomId);
    if (!room || !room.candy) return;

    const candy = room.candy;
    if (candy.id !== candyId || candy.taken) return;

    candy.taken = true;
    candy.owner = ws.playerRole;

    const msg = {
        type: "CANDY_PICKED",
        candyId,
        picker: ws.playerRole
    };

    room.player1.ws.send(JSON.stringify(msg));
    room.player2.ws.send(JSON.stringify(msg));
  }


  function handleGameSceneReady(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Enviar candy
    if (room.candy) {
        ws.send(JSON.stringify({
            type: 'CANDY_SPAWN',
            candy: room.candy
        }));
    }

    // Enviar items
    if (room.items && room.items.length > 0) {
        room.items.forEach(item => {
            ws.send(JSON.stringify({
                type: 'ITEM_SPAWN',
                item
            }));
        });
    }

    // Enviar power-up
    if (room.speedPowerUp) {
        ws.send(JSON.stringify({
            type: 'POWERUP_SPAWN',
            powerUp: room.speedPowerUp
        }));
    }
}


function handleThrowablePickup(ws, itemId, picker) {
    const room = rooms.get(ws.roomId);
    if (!room) return;

    const item = room.items.find(i => i.id === itemId);
    if (!item) return;

    if (item.taken) return;

    item.taken = true;
    item.owner = ws.playerRole;

    // Avisar a ambos jugadores
    room.player1.ws.send(JSON.stringify({
        type: "THROWABLE_PICKED",
        itemId,
        picker
    }));

    room.player2.ws.send(JSON.stringify({
        type: "THROWABLE_PICKED",
        itemId,
        picker
    }));
}


  function handlePowerUpCollected(ws, powerUpId) {
    console.log('handlePowerUpCollected llamado');
    console.log('ws.roomId:', ws.roomId);
    console.log('powerUpId recibido:', powerUpId);
    

    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;
    console.log('powerUp en room:', room.speedPowerUp);
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
    handleGameSceneReady,
    spawnCandy,
    handleCandyDelivered,
    handleCandyCollected,
    handleThrowablePickup,
    handlePowerUpCollected,
    handleDisconnect,
    getActiveRoomCount
  };

}
