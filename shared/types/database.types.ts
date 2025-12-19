/**
 * Database Types - Generated from Supabase Schema
 *
 * Single source of truth for all database types across frontend and backend.
 * Generate this file using:
 * npx supabase gen types typescript --project-id ijfzcfepkerbmtlkikzg > shared/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      proposals: {
        Row: {
          id: string
          title: string
          summary: string | null
          submitted_by: string | null
          status: 'queued' | 'in_debate' | 'adopted' | 'rejected'
          votes_for: number
          votes_against: number
          voting_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          submitted_by?: string | null
          status?: 'queued' | 'in_debate' | 'adopted' | 'rejected'
          votes_for?: number
          votes_against?: number
          voting_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          submitted_by?: string | null
          status?: 'queued' | 'in_debate' | 'adopted' | 'rejected'
          votes_for?: number
          votes_against?: number
          voting_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposal_votes: {
        Row: {
          id: string
          proposal_id: string
          user_id: string
          vote: 'for' | 'against'
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          user_id: string
          vote: 'for' | 'against'
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          user_id?: string
          vote?: 'for' | 'against'
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          proposal_id: string
          state: 'intake' | 'debate' | 'plan_drafting' | 'pre_vote' | 'vote' | 'commit' | 'idle'
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          proposal_id: string
          state?: 'intake' | 'debate' | 'plan_drafting' | 'pre_vote' | 'vote' | 'commit' | 'idle'
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          proposal_id?: string
          state?: 'intake' | 'debate' | 'plan_drafting' | 'pre_vote' | 'vote' | 'commit' | 'idle'
          started_at?: string
          ended_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          topic_id: string
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          agent_role: 'product-strategy' | 'engineering-arch' | 'gtm-marketing' | 'ops-automation' | 'finance-tokenomics' | 'risk-compliance'
          phase: string
          importance: number
          body: Json
          selected: boolean
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          agent_role: 'product-strategy' | 'engineering-arch' | 'gtm-marketing' | 'ops-automation' | 'finance-tokenomics' | 'risk-compliance'
          phase: string
          importance: number
          body: Json
          selected?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          agent_role?: 'product-strategy' | 'engineering-arch' | 'gtm-marketing' | 'ops-automation' | 'finance-tokenomics' | 'risk-compliance'
          phase?: string
          importance?: number
          body?: Json
          selected?: boolean
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          topic_id: string
          title: string | null
          current_revision_id: string | null
          status: 'draft' | 'final' | 'adopted'
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          title?: string | null
          current_revision_id?: string | null
          status?: 'draft' | 'final' | 'adopted'
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          title?: string | null
          current_revision_id?: string | null
          status?: 'draft' | 'final' | 'adopted'
          created_at?: string
        }
      }
      plan_revisions: {
        Row: {
          id: string
          plan_id: string
          agent_id: string
          op: 'upsert_section' | 'append' | 'replace' | 'delete' | 'move'
          path: string
          content_md: string | null
          diff: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          agent_id: string
          op: 'upsert_section' | 'append' | 'replace' | 'delete' | 'move'
          path: string
          content_md?: string | null
          diff?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          agent_id?: string
          op?: 'upsert_section' | 'append' | 'replace' | 'delete' | 'move'
          path?: string
          content_md?: string | null
          diff?: Json | null
          created_at?: string
        }
      }
      steps: {
        Row: {
          id: string
          plan_id: string
          title: string
          owner_agent_role: string
          status: 'todo' | 'in_progress' | 'blocked' | 'done'
          depends_on: string | null
          eta_days: number | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          title: string
          owner_agent_role: string
          status?: 'todo' | 'in_progress' | 'blocked' | 'done'
          depends_on?: string | null
          eta_days?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          title?: string
          owner_agent_role?: string
          status?: 'todo' | 'in_progress' | 'blocked' | 'done'
          depends_on?: string | null
          eta_days?: number | null
          created_at?: string
        }
      }
      agent_votes: {
        Row: {
          id: string
          topic_id: string
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          choice: 'approve' | 'reject' | 'abstain'
          rationale_md: string | null
          conditions: Json
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          choice: 'approve' | 'reject' | 'abstain'
          rationale_md?: string | null
          conditions?: Json
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          choice?: 'approve' | 'reject' | 'abstain'
          rationale_md?: string | null
          conditions?: Json
          created_at?: string
        }
      }
      arbitration: {
        Row: {
          id: string
          topic_id: string
          winner_message_id: string
          decision: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          winner_message_id: string
          decision?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          winner_message_id?: string
          decision?: Json | null
          created_at?: string
        }
      }
      error_logs: {
        Row: {
          id: string
          source: 'backend' | 'frontend' | 'agent'
          severity: 'info' | 'warning' | 'error' | 'critical'
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen' | null
          error_type: string
          message: string
          details: Json
          topic_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: 'backend' | 'frontend' | 'agent'
          severity?: 'info' | 'warning' | 'error' | 'critical'
          agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen' | null
          error_type: string
          message: string
          details?: Json
          topic_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: 'backend' | 'frontend' | 'agent'
          severity?: 'info' | 'warning' | 'error' | 'critical'
          agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen' | null
          error_type?: string
          message?: string
          details?: Json
          topic_id?: string | null
          created_at?: string
        }
      }
      rate_limits: {
        Row: {
          identifier: string
          endpoint: string
          tokens: number
          last_refill: string
        }
        Insert: {
          identifier: string
          endpoint: string
          tokens?: number
          last_refill?: string
        }
        Update: {
          identifier?: string
          endpoint?: string
          tokens?: number
          last_refill?: string
        }
      }
      rate_limit_violations: {
        Row: {
          id: string
          identifier: string
          endpoint: string
          timestamp: string
          tokens_requested: number
          user_agent: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          identifier: string
          endpoint: string
          timestamp?: string
          tokens_requested?: number
          user_agent?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          identifier?: string
          endpoint?: string
          timestamp?: string
          tokens_requested?: number
          user_agent?: string | null
          ip_address?: string | null
        }
      }
      users: {
        Row: {
          id: string
          auth_user_id: string
          role: 'admin' | 'client'
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          role: 'admin' | 'client'
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          role?: 'admin' | 'client'
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      orchestrator_locks: {
        Row: {
          lock_id: string
          instance_id: string
          acquired_at: string
          last_heartbeat: string
          expires_at: string
        }
        Insert: {
          lock_id: string
          instance_id: string
          acquired_at?: string
          last_heartbeat?: string
          expires_at: string
        }
        Update: {
          lock_id?: string
          instance_id?: string
          acquired_at?: string
          last_heartbeat?: string
          expires_at?: string
        }
      }
      proposal_queue: {
        Row: {
          id: string
          proposal_id: string
          priority: number
          status: 'queued' | 'processing' | 'completed'
          created_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          proposal_id: string
          priority?: number
          status?: 'queued' | 'processing' | 'completed'
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          proposal_id?: string
          priority?: number
          status?: 'queued' | 'processing' | 'completed'
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
