class User {
  constructor(client) {
    this.client = client;
  }

  async getAllUsers() {
    const res = await this.client.query('SELECT * FROM users');
    return res.rows;
  }

  async getById(id) {
    const res = await this.client.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return res.rows[0];
  }

  async create({ username, password, role }) {
    const res = await this.client.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, password, role]
    );
    return res.rows[0];
  }

  async update(id, body) {
    const currentUser = await this.getById(id);

    if (!currentUser) {
      return null;
    }

    const updatedUser = {
      ...currentUser,
      ...body,
    };

    const res = await this.client.query(
      'UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING *',
      [updatedUser.username, updatedUser.password, updatedUser.role, id]
    );

    return res.rows[0];
  }

  async delete(id) {
    const res = await this.client.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    return res.rows[0];
  }

  async authenticate(username, password) {
    const res = await this.client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = res.rows[0];

    if (user && user.password === password) {
      return user;
    }

    return null;
  }
}

module.exports = User;
