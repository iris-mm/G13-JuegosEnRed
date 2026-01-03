/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - {name, wins}
   * @returns {Object} Usuario creado
   */
  function createUser( {username} ) {
    // 1. Validar que el email no exista ya
        if (!username || username.trim() === '') {
      throw new Error('Username obligatorio');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      username: username.trim(),
      wins: 0,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }

/**
   * Actualizar wins de usuario
   * @param {String} id 
   * @returns {Object} Usuario encontrado
   */
  function addWin(id) {
    const user = getUserById(id);
    if (!user) return null;
    user.wins += 1;
    return user;
  }

/**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // Retornar una copia del array de usuarios
    return users;
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

/**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    addWin,
    deleteUser
  };
}



