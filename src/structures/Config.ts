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

  spotify: {
    clientID: string;
    clientSecret: string;
  };
}
