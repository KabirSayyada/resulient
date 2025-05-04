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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
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
          show_avatar_on_scorecard?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      resume_optimizations: {
        Row: {
          ats_score: number | null
          created_at: string
          id: string
          job_description: string
          keyword_score: number | null
          optimized_resume: string
          original_resume: string
          overall_score: number | null
          qualification_gaps: Json | null
          structure_score: number | null
          suggestions: string[] | null
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string
          id?: string
          job_description: string
          keyword_score?: number | null
          optimized_resume: string
          original_resume: string
          overall_score?: number | null
          qualification_gaps?: Json | null
          structure_score?: number | null
          suggestions?: string[] | null
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string
          id?: string
          job_description?: string
          keyword_score?: number | null
          optimized_resume?: string
          original_resume?: string
          overall_score?: number | null
          qualification_gaps?: Json | null
          structure_score?: number | null
          suggestions?: string[] | null
          user_id?: string
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
      user_has_active_subscription: {
        Args: { user_uuid: string; tier?: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
