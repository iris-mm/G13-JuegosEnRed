/**
 * Controlador de usuarios usando closures
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios
 * y utiliza el userService para las operaciones de datos
 *
 * Patrón: Inyección de dependencias - recibe el servicio como parámetro
 */

export function createUserController(userService) {
  /**
   * POST /api/users - Crear nuevo usuario
   */
  async function create(req, res, next) {
    try {
      // 1. Extraer datos del body: email, name, avatar, level
      const { name, state } = req.body;

      // 2. Validar que los campos requeridos estén presentes (email, name)
      if (!name) {
        return res.status(400).json({
          error: 'Un nombre es obligatorio.'
        });
      }

      // 3. Llamar a userService.createUser()
      const newUser = userService.createUser({ name, state });

      // 4. Retornar 201 con el usuario creado
      res.status(201).json(newUser);
      
    } catch (error) {
      // 5. Si hay error (ej: nombre duplicado), retornar 400
      if (error.message === 'El nombre ya está registrado') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * GET /api/users - Obtener todos los usuarios
   */
  async function getAll(req, res, next) {
    try {
      // 1. Llamar a userService.getAllUsers()
      let users = userService.getAllUsers();

      // 2. Retornar 200 con el array de usuarios
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Obtener un usuario por ID
   */
  async function getById(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.getUserById()
      const user = userService.getUserById(id);

      // 3. Si no existe, retornar 404
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // 4. Si existe, retornar 200 con el usuario
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id - Actualizar un usuario
   */
  async function update(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Extraer los campos a actualizar del body
      const { name, state } = req.body;

      // 3. Llamar a userService.updateUser()
      userService.updateUser(id);

      // 4. Si existe, retornar 200 con el usuario actualizado
      res.status(204).json(res);
    } catch (error) {
      res.status(404).json({
          error: `No se encontró a ningún usuario con esa ID.`
        });
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id - Eliminar un usuario
   */
  async function remove(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.deleteUser()
      userService.deleteUser(id);

      // 3. Si se eliminó, retornar 204 (No Content)
      res.status(204);
    } catch (error) {
      res.status(404).json({
          error: `No se encontró a ningún usuario con esa ID.`
        });
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove
  };
}
