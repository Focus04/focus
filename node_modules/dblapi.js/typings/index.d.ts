export = DBLAPI;
import { EventEmitter } from 'events';

declare class DBLAPI extends EventEmitter {
  constructor(token: string, options: DBLAPI.DBLOptions, client?: object);
  constructor(token: string, client?: object);

  public webhook?: DBLWebhook;
  public postStats(
    serverCount: number,
    shardId?: number,
    shardCount?: number
  ): Promise<object>;
  public getStats(id: string): Promise<DBLAPI.BotStats>;
  public getBot(id: string): Promise<DBLAPI.Bot>;
  public getUser(id: string): Promise<DBLAPI.User>;
  public getBots(query: DBLAPI.BotsQuery): Promise<DBLAPI.BotSearchResult>;
  public getVotes(): Promise<DBLAPI.Vote[]>;
  public hasVoted(id: string): Promise<boolean>;
  public isWeekend(): Promise<boolean>;

  public token?: string;

  private _request(
    method: string,
    endpoint: string,
    data?: object
  ): Promise<object>;

  public on(event: 'posted', listener: () => void): this;
  public on(event: 'error', listener: (error: Error) => void): this;
}

import { Server, ServerResponse, IncomingMessage } from 'http';
declare class DBLWebhook extends EventEmitter {
  constructor(port?: number, path?: string, auth?: string, server?: Server);

  public port: number;
  public path: string;
  public auth?: string;
  private _server: Server;
  private attached: boolean;
  private _emitListening(): void;
  private _startWebhook(): void;
  private _attachWebhook(server: Server): void;
  private _handleRequest(req: IncomingMessage, res: ServerResponse): void;
  private _returnResponse(
    res: ServerResponse,
    statusCode: number,
    data?: string
  ): void;

  public on(
    event: 'ready',
    listener: (hook: DBLAPI.ReadyEventArgs) => void
  ): this;
  public on(
    event: 'vote',
    listener: (vote: DBLAPI.VoteEventArgs) => void
  ): this;
}

declare namespace DBLAPI {
  export type DBLOptions = {
    statsInterval?: number;
    webhookPort?: number;
    webhookAuth?: string;
    webhookPath?: string;
    webhookServer?: Server;
  };

  export type BotStats = {
    server_count: number;
    shards: number[];
    shard_count: number;
  };

  export type Bot = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    lib: string;
    prefix: string;
    shortdesc: string;
    longdesc?: string;
    tags: string[];
    website?: string;
    support?: string;
    github?: string;
    owners: number[];
    invite?: string;
    date: Date;
    certifiedBot: boolean;
    vanity?: string;
    points: number;
  };

  export type User = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    bio?: string;
    banner?: string;
    social: UserSocial;
    color?: string;
    supporter: boolean;
    certifiedDev: boolean;
    mod: boolean;
    webMod: boolean;
    admin: boolean;
  };

  export type UserSocial = {
    youtube?: string;
    reddit?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };

  export type BotsQuery = {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
  };

  export type BotSearchResult = {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
  };

  export type Vote = {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
  };

  export type VoteEventArgs = {
    bot: string;
    user: string;
    type: string;
    isWeekend: boolean;
    query?: object;
  };

  export type ReadyEventArgs = {
    hostname: string;
    port: number;
    path: string;
  };
}
