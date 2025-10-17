export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: number
          key_name: string
          key_value: string
        }
        Insert: {
          created_at?: string
          id?: number
          key_name: string
          key_value: string
        }
        Update: {
          created_at?: string
          id?: number
          key_name?: string
          key_value?: string
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          is_unique: boolean | null
          page_path: string
          post_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          visit_timestamp: string
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_unique?: boolean | null
          page_path: string
          post_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visit_timestamp?: string
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_unique?: boolean | null
          page_path?: string
          post_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          visit_timestamp?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_conversion_events: {
        Row: {
          analytics_id: string | null
          created_at: string | null
          event_data: Json | null
          event_timestamp: string
          event_type: string
          id: string
        }
        Insert: {
          analytics_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_timestamp?: string
          event_type: string
          id?: string
        }
        Update: {
          analytics_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_timestamp?: string
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_conversion_events_analytics_id_fkey"
            columns: ["analytics_id"]
            isOneToOne: false
            referencedRelation: "blog_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt: string
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_user_interactions: {
        Row: {
          analytics_id: string | null
          created_at: string | null
          id: string
          interactions: Json | null
          scroll_depth: number | null
          time_on_page: number | null
        }
        Insert: {
          analytics_id?: string | null
          created_at?: string | null
          id?: string
          interactions?: Json | null
          scroll_depth?: number | null
          time_on_page?: number | null
        }
        Update: {
          analytics_id?: string | null
          created_at?: string | null
          id?: string
          interactions?: Json | null
          scroll_depth?: number | null
          time_on_page?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_user_interactions_analytics_id_fkey"
            columns: ["analytics_id"]
            isOneToOne: false
            referencedRelation: "blog_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          referral_code: string | null
          show_avatar_on_scorecard: boolean
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          referral_code?: string | null
          show_avatar_on_scorecard?: boolean
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          referral_code?: string | null
          show_avatar_on_scorecard?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          created_at: string
          earned_at: string
          expires_at: string | null
          granted_at: string | null
          id: string
          referral_count: number
          reward_type: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          earned_at?: string
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          referral_count?: number
          reward_type?: string
          status?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          earned_at?: string
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          referral_count?: number
          reward_type?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status: string
          subscription_purchase_id: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status?: string
          subscription_purchase_id?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
          status?: string
          subscription_purchase_id?: string | null
        }
        Relationships: []
      }
      resume_scores: {
        Row: {
          achievements_score: number | null
          ats_readiness: number
          certifications_score: number | null
          content_structure: number
          created_at: string
          education_score: number | null
          elite_indicators: string[] | null
          experience_duration: number
          id: string
          improvement_tips: string[] | null
          industry: string
          job_description: string
          keyword_relevance: number
          overall_score: number
          percentile: number
          resume_content: string
          scoring_mode: string | null
          similar_resumes: number | null
          skills_breadth: number
          suggested_skills: string[] | null
          user_id: string
        }
        Insert: {
          achievements_score?: number | null
          ats_readiness: number
          certifications_score?: number | null
          content_structure: number
          created_at?: string
          education_score?: number | null
          elite_indicators?: string[] | null
          experience_duration: number
          id?: string
          improvement_tips?: string[] | null
          industry: string
          job_description: string
          keyword_relevance: number
          overall_score: number
          percentile: number
          resume_content: string
          scoring_mode?: string | null
          similar_resumes?: number | null
          skills_breadth: number
          suggested_skills?: string[] | null
          user_id: string
        }
        Update: {
          achievements_score?: number | null
          ats_readiness?: number
          certifications_score?: number | null
          content_structure?: number
          created_at?: string
          education_score?: number | null
          elite_indicators?: string[] | null
          experience_duration?: number
          id?: string
          improvement_tips?: string[] | null
          industry?: string
          job_description?: string
          keyword_relevance?: number
          overall_score?: number
          percentile?: number
          resume_content?: string
          scoring_mode?: string | null
          similar_resumes?: number | null
          skills_breadth?: number
          suggested_skills?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_notifications: {
        Row: {
          email: string
          id: string
          processed: boolean
          product_code: string
          purchase_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          processed?: boolean
          product_code: string
          purchase_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          processed?: boolean
          product_code?: string
          purchase_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      user_resume_data: {
        Row: {
          applied_from_score_id: string | null
          created_at: string
          enhancements: Json | null
          id: string
          resume_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_from_score_id?: string | null
          created_at?: string
          enhancements?: Json | null
          id?: string
          resume_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_from_score_id?: string | null
          created_at?: string
          enhancements?: Json | null
          id?: string
          resume_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resume_data_applied_from_score_id_fkey"
            columns: ["applied_from_score_id"]
            isOneToOne: false
            referencedRelation: "resume_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          end_date: string | null
          gumroad_product_id: string | null
          gumroad_purchase_id: string | null
          gumroad_subscription_id: string | null
          id: string
          last_webhook_event: string | null
          payment_provider: string | null
          paystack_reference: string | null
          start_date: string
          status: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle: string
          created_at?: string
          end_date?: string | null
          gumroad_product_id?: string | null
          gumroad_purchase_id?: string | null
          gumroad_subscription_id?: string | null
          id?: string
          last_webhook_event?: string | null
          payment_provider?: string | null
          paystack_reference?: string | null
          start_date?: string
          status: string
          subscription_tier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          end_date?: string | null
          gumroad_product_id?: string | null
          gumroad_purchase_id?: string | null
          gumroad_subscription_id?: string | null
          id?: string
          last_webhook_event?: string | null
          payment_provider?: string | null
          paystack_reference?: string | null
          start_date?: string
          status?: string
          subscription_tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage_tracking: {
        Row: {
          created_at: string
          feature_type: string
          id: string
          updated_at: string
          usage_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_type: string
          id?: string
          updated_at?: string
          usage_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_type?: string
          id?: string
          updated_at?: string
          usage_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      published_blog_posts: {
        Row: {
          author_avatar_url: string | null
          author_first_name: string | null
          author_id: string | null
          author_last_name: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string | null
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_referral_rewards: {
        Args: { referrer_id: string }
        Returns: undefined
      }
      get_user_total_usage_count: {
        Args: { p_feature_type: string; p_user_id: string }
        Returns: number
      }
      get_user_usage_count: {
        Args: { p_date?: string; p_feature_type: string; p_user_id: string }
        Returns: number
      }
      increment_user_usage: {
        Args: { p_feature_type: string; p_user_id: string }
        Returns: number
      }
      user_has_active_subscription: {
        Args: { tier?: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
