export default interface Config {
  prefix: string;
  token: string;
  embedColor: string;

  lavaLink: {
    identifier: string;
    host: string;
    port: number;
    password: string;
    secure: boolean;
  };

  database: {
    type: string;
    options: {
      host: string;
      user?: string;
      password?: string;
      database?: string;
      port?: string;
    };
  };

  spotify: {
    clientID: string;
    clientSecret: string;
  };
}
