export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_levels: {
        Row: {
          access_id: string
          created_at: string | null
          description: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          access_id?: string
          created_at?: string | null
          description?: string | null
          level: number
          name: string
          updated_at?: string | null
        }
        Update: {
          access_id?: string
          created_at?: string | null
          description?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_transactions: {
        Row: {
          agent_id: string
          credits_spent: number
          developer_id: string | null
          invoice_id: string | null
          notes: string | null
          owner_id: string | null
          payment_method: string | null
          payment_status: string | null
          price_usd: number | null
          transaction_date: string
          transaction_id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          agent_id: string
          credits_spent?: number
          developer_id?: string | null
          invoice_id?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price_usd?: number | null
          transaction_date?: string
          transaction_id?: string
          transaction_type?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          credits_spent?: number
          developer_id?: string | null
          invoice_id?: string | null
          notes?: string | null
          owner_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price_usd?: number | null
          transaction_date?: string
          transaction_id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_transactions_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string | null
          Credits: number
          department: Database["public"]["Enums"]["department_category"] | null
          description: string | null
          dev_name: string | null
          developer: string | null
          function_id: string | null
          icon: string
          id: string
          integration_count: number | null
          is_active: boolean | null
          license: string | null
          license_required: boolean | null
          name: string
          required_access_level: string | null
          tags: string[] | null
          updated_at: string | null
          url: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          Credits: number
          department?: Database["public"]["Enums"]["department_category"] | null
          description?: string | null
          dev_name?: string | null
          developer?: string | null
          function_id?: string | null
          icon: string
          id?: string
          integration_count?: number | null
          is_active?: boolean | null
          license?: string | null
          license_required?: boolean | null
          name: string
          required_access_level?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          Credits?: number
          department?: Database["public"]["Enums"]["department_category"] | null
          description?: string | null
          dev_name?: string | null
          developer?: string | null
          function_id?: string | null
          icon?: string
          id?: string
          integration_count?: number | null
          is_active?: boolean | null
          license?: string | null
          license_required?: boolean | null
          name?: string
          required_access_level?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url?: string
          video_url?: string | null
        }
        Relationships: []
      }
      bounties: {
        Row: {
          application_area: string | null
          bounty_amount: number | null
          bounty_id: string
          created_at: string
          description: string
          dev_id: string | null
          is_exclusive: boolean
          is_licensed: boolean
          is_public_domain: boolean
          license_terms: string | null
          requirements: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_area?: string | null
          bounty_amount?: number | null
          bounty_id?: string
          created_at?: string
          description: string
          dev_id?: string | null
          is_exclusive?: boolean
          is_licensed?: boolean
          is_public_domain?: boolean
          license_terms?: string | null
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_area?: string | null
          bounty_amount?: number | null
          bounty_id?: string
          created_at?: string
          description?: string
          dev_id?: string | null
          is_exclusive?: boolean
          is_licensed?: boolean
          is_public_domain?: boolean
          license_terms?: string | null
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bounties_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          model: string | null
          provider: string | null
          role: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          model?: string | null
          provider?: string | null
          role: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          model?: string | null
          provider?: string | null
          role?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          model: string | null
          provider: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model?: string | null
          provider?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string | null
          provider?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      developer_payment_methods: {
        Row: {
          account_details: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string | null
          dev_paymethod_id: string
          developer_id: string
          method_type: string | null
          paypal_email: string | null
          routing_number: string | null
          updated_at: string | null
        }
        Insert: {
          account_details?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          dev_paymethod_id?: string
          developer_id: string
          method_type?: string | null
          paypal_email?: string | null
          routing_number?: string | null
          updated_at?: string | null
        }
        Update: {
          account_details?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          dev_paymethod_id?: string
          developer_id?: string
          method_type?: string | null
          paypal_email?: string | null
          routing_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "developer_payment_methods_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          full_name: string
          id: string
          is_approved: boolean
          phone: string
          preferred_name: string | null
          profile_image_url: string | null
          tc_accept: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          full_name: string
          id?: string
          is_approved?: boolean
          phone: string
          preferred_name?: string | null
          profile_image_url?: string | null
          tc_accept?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          full_name?: string
          id?: string
          is_approved?: boolean
          phone?: string
          preferred_name?: string | null
          profile_image_url?: string | null
          tc_accept?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      external_sites: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          redirect_path: string
          site_name: string
          site_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          redirect_path?: string
          site_name: string
          site_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          redirect_path?: string
          site_name?: string
          site_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          call_name: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          last_name: string | null
          phone_number: string | null
          profile_id: string
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          call_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          profile_id?: string
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          call_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          profile_id?: string
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          credits_per_month: number
          description: string | null
          features: Json
          has_bridgers: boolean | null
          has_custom_agents: boolean | null
          has_rls: boolean | null
          has_white_label: boolean | null
          id: string
          is_active: boolean
          is_enterprise: boolean | null
          max_agents: number
          min_users: number | null
          monthly_fee_per_user: number | null
          name: string
          price_monthly: number
          price_yearly: number
          setup_fee: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_per_month?: number
          description?: string | null
          features?: Json
          has_bridgers?: boolean | null
          has_custom_agents?: boolean | null
          has_rls?: boolean | null
          has_white_label?: boolean | null
          id?: string
          is_active?: boolean
          is_enterprise?: boolean | null
          max_agents?: number
          min_users?: number | null
          monthly_fee_per_user?: number | null
          name: string
          price_monthly: number
          price_yearly: number
          setup_fee?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_per_month?: number
          description?: string | null
          features?: Json
          has_bridgers?: boolean | null
          has_custom_agents?: boolean | null
          has_rls?: boolean | null
          has_white_label?: boolean | null
          id?: string
          is_active?: boolean
          is_enterprise?: boolean | null
          max_agents?: number
          min_users?: number | null
          monthly_fee_per_user?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          setup_fee?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      t3rms_users: {
        Row: {
          created_at: string
          email: string
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          monthly_remaining: number
          monthly_usage: number
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          monthly_remaining?: number
          monthly_usage?: number
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          monthly_remaining?: number
          monthly_usage?: number
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_access_levels: {
        Row: {
          access_id: string | null
          access_level_id: string
          created_at: string | null
          user_level_id: string | null
        }
        Insert: {
          access_id?: string | null
          access_level_id: string
          created_at?: string | null
          user_level_id?: string | null
        }
        Update: {
          access_id?: string | null
          access_level_id?: string
          created_at?: string | null
          user_level_id?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          details: Json | null
          timestamp: string
          title: string | null
          user_activity_id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          details?: Json | null
          timestamp?: string
          title?: string | null
          user_activity_id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          details?: Json | null
          timestamp?: string
          title?: string | null
          user_activity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_agents: {
        Row: {
          agent_id: string
          created_at: string | null
          credits_used: number | null
          expiry_date: string
          purchased_at: string
          rating: number | null
          user_agents_id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          credits_used?: number | null
          expiry_date?: string
          purchased_at?: string
          rating?: number | null
          user_agents_id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          credits_used?: number | null
          expiry_date?: string
          purchased_at?: string
          rating?: number | null
          user_agents_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_function: {
        Row: {
          created_at: string | null
          function_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          function_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          function_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accent_color: string | null
          assistant_name: string | null
          avatar_url: string | null
          brand_logo_url: string | null
          company_name: string | null
          created_at: string | null
          favorite_agents: string[] | null
          first_name: string | null
          last_name: string | null
          logo_path: string | null
          phone_number: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
          user_id: string
          user_settings_id: string
        }
        Insert: {
          accent_color?: string | null
          assistant_name?: string | null
          avatar_url?: string | null
          brand_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          favorite_agents?: string[] | null
          first_name?: string | null
          last_name?: string | null
          logo_path?: string | null
          phone_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          user_id: string
          user_settings_id?: string
        }
        Update: {
          accent_color?: string | null
          assistant_name?: string | null
          avatar_url?: string | null
          brand_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          favorite_agents?: string[] | null
          first_name?: string | null
          last_name?: string | null
          logo_path?: string | null
          phone_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
          user_id?: string
          user_settings_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          credits_used: number
          current_period_end: string
          current_period_start: string
          payment_method: string | null
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
          user_sub_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          credits_used?: number
          current_period_end?: string
          current_period_start?: string
          payment_method?: string | null
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
          user_sub_id?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          credits_used?: number
          current_period_end?: string
          current_period_start?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
          user_sub_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
      website_banners: {
        Row: {
          banner_image_path: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          website_name: string
          website_url: string
        }
        Insert: {
          banner_image_path?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          website_name: string
          website_url: string
        }
        Update: {
          banner_image_path?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          website_name?: string
          website_url?: string
        }
        Relationships: []
      }
      wrappers_fdw_stats: {
        Row: {
          bytes_in: number | null
          bytes_out: number | null
          create_times: number | null
          created_at: string
          fdw_name: string
          metadata: Json | null
          rows_in: number | null
          rows_out: number | null
          updated_at: string
        }
        Insert: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Update: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name?: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      agent_sales_summary: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          first_sale_date: string | null
          last_sale_date: string | null
          total_credits: number | null
          total_revenue: number | null
          total_sales: number | null
          unique_customers: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          agent: Json | null
          id: string | null
          messages: Json | null
          preview: Json | null
          timestamp: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          agent?: never
          id?: string | null
          messages?: never
          preview?: never
          timestamp?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          agent?: never
          id?: string | null
          messages?: never
          preview?: never
          timestamp?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_settings"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      airtable_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      airtable_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      airtable_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      assign_user_defaults: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      auth0_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      auth0_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      auth0_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      big_query_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      big_query_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      big_query_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      click_house_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      click_house_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      click_house_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      cognito_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      cognito_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      cognito_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      firebase_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      firebase_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      firebase_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      hello_world_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      hello_world_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      hello_world_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      increment_credits: {
        Args: {
          amount: number
          user_id: string
        }
        Returns: number
      }
      insert_terms_analysis: {
        Args: {
          p_user_id: string
          p_document_name: string
          p_analysis_result: Json
          p_overall_risk: string
          p_score: number
        }
        Returns: undefined
      }
      logflare_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      logflare_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      logflare_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      mssql_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      mssql_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      mssql_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      redis_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      redis_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      redis_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      s3_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      s3_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      s3_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      stripe_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      stripe_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      stripe_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      wasm_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      wasm_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      wasm_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      department_category:
        | "Quality"
        | "HR"
        | "Operations"
        | "Sales"
        | "Admin"
        | "Finance"
        | "Support"
        | "Engineering"
        | "Supply Chain"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
