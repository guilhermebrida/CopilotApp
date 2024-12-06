import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'app_database.db',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.error('Error opening database:', error);
  }
);


export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        lastname TEXT,
        cpf TEXT
      );`,
      [],
      () => {
        console.log('Tabela "drivers" criada com sucesso.');
      },
      error => {
        console.error('Erro ao criar tabela:', error);
      }
    );
  });
};

export const insertUser = (name: string, lastname: string, cpf: string) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO drivers (name, lastname, cpf) VALUES (?, ?, ?);',
      [name, lastname, cpf],
      () => {
        console.log('Registro inserido com sucesso.');
      },
      error => {
        console.error('Erro ao inserir registro:', error);
      }
    );
  });
};


export const getUsers = (callback: (users: any[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM drivers;',
      [],
      (_, results) => {
        const rows = results.rows;
        let users = [];
        for (let i = 0; i < rows.length; i++) {
          users.push(rows.item(i));
        }
        console.log('Registros recuperados:', users);
        callback(users);
      },
      error => {
        console.error('Erro ao recuperar registros:', error);
      }
    );
  });
};

export const getUserByCPF = (cpf: string, callback: (user: any) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM drivers WHERE cpf = ?;',
      [cpf],
      (_, results) => {
        const rows = results.rows;
        if (rows.length > 0) {
          callback(rows.item(0));
        } else {
          callback(null);
        }
      },
      error => {
        console.error('Erro ao recuperar registro:', error);
      }
    );
  });
}