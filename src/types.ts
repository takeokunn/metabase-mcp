export interface MetabaseDatabase {
  id: number;
  name: string;
  engine: string;
}

export interface MetabaseDatabaseResponse {
  data: MetabaseDatabase[];
}

export interface MetabaseConfig {
  url: string;
  apiToken: string;
}