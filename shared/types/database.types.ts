/**
 * Database Types - To be generated from Supabase Schema
 *
 * Generate this file using:
 * npx supabase gen types typescript --project-id ijfzcfepkerbmtlkikzg > shared/types/database.types.ts
 *
 * After generation, copy to:
 * - admin/types/database.types.ts
 * - client/types/database.types.ts
 * - website/types/database.types.ts
 * - backend/src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {}
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
