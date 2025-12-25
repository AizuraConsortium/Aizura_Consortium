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
          message_type: 'message' | 'vote'
          message_title: string | null
          message_body_md: string | null
          message_citations: string[] | null
          vote_choice: string | null
          vote_rationale_md: string | null
          vote_conditions: string[] | null
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
          message_type: 'message' | 'vote'
          message_title?: string | null
          message_body_md?: string | null
          message_citations?: string[] | null
          vote_choice?: string | null
          vote_rationale_md?: string | null
          vote_conditions?: string[] | null
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
          message_type?: 'message' | 'vote'
          message_title?: string | null
          message_body_md?: string | null
          message_citations?: string[] | null
          vote_choice?: string | null
          vote_rationale_md?: string | null
          vote_conditions?: string[] | null
          selected?: boolean
          created_at?: string
        }
      }
      message_tool_calls: {
        Row: {
          id: string
          message_id: string
          tool: string
          op: string
          path: string
          target_path: string | null
          after_section: string | null
          content_md: string | null
          attribution_agent_id: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          tool?: string
          op: string
          path: string
          target_path?: string | null
          after_section?: string | null
          content_md?: string | null
          attribution_agent_id?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          tool?: string
          op?: string
          path?: string
          target_path?: string | null
          after_section?: string | null
          content_md?: string | null
          attribution_agent_id?: string | null
          tags?: string[] | null
          created_at?: string
        }
      }
      message_proposed_actions: {
        Row: {
          id: string
          message_id: string
          kind: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          kind: string
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          kind?: string
          data?: Json
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
          added_chars: number
          removed_chars: number
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          agent_id: string
          op: 'upsert_section' | 'append' | 'replace' | 'delete' | 'move'
          path: string
          content_md?: string | null
          added_chars?: number
          removed_chars?: number
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          agent_id?: string
          op?: 'upsert_section' | 'append' | 'replace' | 'delete' | 'move'
          path?: string
          content_md?: string | null
          added_chars?: number
          removed_chars?: number
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
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          agent_id: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          choice: 'approve' | 'reject' | 'abstain'
          rationale_md?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen'
          choice?: 'approve' | 'reject' | 'abstain'
          rationale_md?: string | null
          created_at?: string
        }
      }
      agent_vote_conditions: {
        Row: {
          id: string
          agent_vote_id: string
          condition_text: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          agent_vote_id: string
          condition_text: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          agent_vote_id?: string
          condition_text?: string
          order_index?: number
          created_at?: string
        }
      }
      arbitration: {
        Row: {
          id: string
          topic_id: string
          winner_message_id: string
          winner_importance: number | null
          candidate_count: number | null
          runner_up_importance: number | null
          decision_metadata_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          winner_message_id: string
          winner_importance?: number | null
          candidate_count?: number | null
          runner_up_importance?: number | null
          decision_metadata_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          winner_message_id?: string
          winner_importance?: number | null
          candidate_count?: number | null
          runner_up_importance?: number | null
          decision_metadata_json?: Json | null
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
          stack_trace: string | null
          request_path: string | null
          request_method: string | null
          user_id: string | null
          endpoint: string | null
          query_time_ms: number | null
          additional_context: string | null
          details_metadata_json: Json | null
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
          stack_trace?: string | null
          request_path?: string | null
          request_method?: string | null
          user_id?: string | null
          endpoint?: string | null
          query_time_ms?: number | null
          additional_context?: string | null
          details_metadata_json?: Json | null
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
          stack_trace?: string | null
          request_path?: string | null
          request_method?: string | null
          user_id?: string | null
          endpoint?: string | null
          query_time_ms?: number | null
          additional_context?: string | null
          details_metadata_json?: Json | null
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
      admin_actions: {
        Row: {
          id: string
          admin_user_id: string
          action_type: 'error_delete' | 'error_bulk_cleanup' | 'rate_limit_clear' | 'rate_limit_view' | 'user_role_update' | 'user_create' | 'user_view' | 'user_delete' | 'orchestrator_start' | 'orchestrator_stop' | 'orchestrator_pause' | 'orchestrator_resume' | 'orchestrator_status' | 'orchestrator_force_unlock' | 'system_health_check' | 'system_config_update'
          resource_type: 'error_log' | 'rate_limit' | 'user' | 'orchestrator' | 'system'
          resource_id: string | null
          action_details: Json
          ip_address: string | null
          user_agent: string | null
          request_path: string | null
          request_method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | null
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          action_type: 'error_delete' | 'error_bulk_cleanup' | 'rate_limit_clear' | 'rate_limit_view' | 'user_role_update' | 'user_create' | 'user_view' | 'user_delete' | 'orchestrator_start' | 'orchestrator_stop' | 'orchestrator_pause' | 'orchestrator_resume' | 'orchestrator_status' | 'orchestrator_force_unlock' | 'system_health_check' | 'system_config_update'
          resource_type: 'error_log' | 'rate_limit' | 'user' | 'orchestrator' | 'system'
          resource_id?: string | null
          action_details?: Json
          ip_address?: string | null
          user_agent?: string | null
          request_path?: string | null
          request_method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | null
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          action_type?: 'error_delete' | 'error_bulk_cleanup' | 'rate_limit_clear' | 'rate_limit_view' | 'user_role_update' | 'user_create' | 'user_view' | 'user_delete' | 'orchestrator_start' | 'orchestrator_stop' | 'orchestrator_pause' | 'orchestrator_resume' | 'orchestrator_status' | 'system_health_check' | 'system_config_update'
          resource_type?: 'error_log' | 'rate_limit' | 'user' | 'orchestrator' | 'system'
          resource_id?: string | null
          action_details?: Json
          ip_address?: string | null
          user_agent?: string | null
          request_path?: string | null
          request_method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | null
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
      }
      u2e_businesses: {
        Row: {
          id: string
          business_name: string
          display_name: string
          description: string | null
          is_active: boolean
          integration_type: 'webhook' | 'api' | 'manual'
          webhook_secret: string | null
          api_key: string | null
          metadata: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
          slug: string | null
          category: 'Trading' | 'SaaS' | 'Infrastructure' | 'Data' | 'Content' | null
          status: 'planning' | 'development' | 'live' | 'paused'
          development_progress: number
          website_url: string | null
          github_url: string | null
          docs_url: string | null
          featured_image: string | null
          proposal_id: string | null
          plan_id: string | null
          launch_date: string | null
          is_foundation: boolean
        }
        Insert: {
          id?: string
          business_name: string
          display_name: string
          description?: string | null
          is_active?: boolean
          integration_type?: 'webhook' | 'api' | 'manual'
          webhook_secret?: string | null
          api_key?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          slug?: string | null
          category?: 'Trading' | 'SaaS' | 'Infrastructure' | 'Data' | 'Content' | null
          status?: 'planning' | 'development' | 'live' | 'paused'
          development_progress?: number
          website_url?: string | null
          github_url?: string | null
          docs_url?: string | null
          featured_image?: string | null
          proposal_id?: string | null
          plan_id?: string | null
          launch_date?: string | null
          is_foundation?: boolean
        }
        Update: {
          id?: string
          business_name?: string
          display_name?: string
          description?: string | null
          is_active?: boolean
          integration_type?: 'webhook' | 'api' | 'manual'
          webhook_secret?: string | null
          api_key?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          slug?: string | null
          category?: 'Trading' | 'SaaS' | 'Infrastructure' | 'Data' | 'Content' | null
          status?: 'planning' | 'development' | 'live' | 'paused'
          development_progress?: number
          website_url?: string | null
          github_url?: string | null
          docs_url?: string | null
          featured_image?: string | null
          proposal_id?: string | null
          plan_id?: string | null
          launch_date?: string | null
          is_foundation?: boolean
        }
      }
      business_metrics_history: {
        Row: {
          id: string
          business_id: string
          metric_type: 'revenue' | 'users' | 'transactions' | 'api_calls'
          value: number
          period_start: string
          period_end: string
          metadata: Json
          recorded_at: string
        }
        Insert: {
          id?: string
          business_id: string
          metric_type: 'revenue' | 'users' | 'transactions' | 'api_calls'
          value: number
          period_start: string
          period_end: string
          metadata?: Json
          recorded_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          metric_type?: 'revenue' | 'users' | 'transactions' | 'api_calls'
          value?: number
          period_start?: string
          period_end?: string
          metadata?: Json
          recorded_at?: string
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
