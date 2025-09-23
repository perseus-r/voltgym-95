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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_controls: {
        Row: {
          created_at: string
          expires_at: string | null
          free_access_granted: boolean
          granted_at: string | null
          granted_by: string | null
          id: string
          notes: string | null
          target_user_email: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          free_access_granted?: boolean
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          notes?: string | null
          target_user_email: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          free_access_granted?: boolean
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          notes?: string | null
          target_user_email?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_feed_content: {
        Row: {
          category: string
          content: string
          engagement_score: number
          id: string
          image_url: string | null
          is_active: boolean
          published_at: string
          source_url: string | null
          summary: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          content: string
          engagement_score?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          published_at?: string
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          engagement_score?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          published_at?: string
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          analysis_type: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          insights: string[] | null
          recommendations: string[] | null
          role: string
          tags: string[] | null
        }
        Insert: {
          analysis_type?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          insights?: string[] | null
          recommendations?: string[] | null
          role: string
          tags?: string[] | null
        }
        Update: {
          analysis_type?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          insights?: string[] | null
          recommendations?: string[] | null
          role?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          after: Json | null
          before: Json | null
          correlation_id: string | null
          created_at: string | null
          entity: string
          entity_id: string | null
          id: string
          ip: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          after?: Json | null
          before?: Json | null
          correlation_id?: string | null
          created_at?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          after?: Json | null
          before?: Json | null
          correlation_id?: string | null
          created_at?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coach_links: {
        Row: {
          athlete_user_id: string | null
          coach_user_id: string | null
          created_at: string | null
          id: string
          scope: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          athlete_user_id?: string | null
          coach_user_id?: string | null
          created_at?: string | null
          id?: string
          scope?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          athlete_user_id?: string | null
          coach_user_id?: string | null
          created_at?: string | null
          id?: string
          scope?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      exercise_aliases: {
        Row: {
          alias: string
          exercise_id: string | null
        }
        Insert: {
          alias: string
          exercise_id?: string | null
        }
        Update: {
          alias?: string
          exercise_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_aliases_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          completed: boolean | null
          created_at: string | null
          exercise_id: string | null
          id: string
          notes: string | null
          order_index: number
          session_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index: number
          session_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_stats: {
        Row: {
          exercise_id: string | null
          id: string
          last_date: string | null
          last_weight: number | null
          rep_mean: number | null
          trend_30d: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          exercise_id?: string | null
          id?: string
          last_date?: string | null
          last_weight?: number | null
          rep_mean?: number | null
          trend_30d?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          exercise_id?: string | null
          id?: string
          last_date?: string | null
          last_weight?: number | null
          rep_mean?: number | null
          trend_30d?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_stats_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category_id: string | null
          created_at: string | null
          demo_video_url: string | null
          difficulty_level: number | null
          equipment: string | null
          form_tips: string[] | null
          id: string
          instructions: string[] | null
          model_3d_url: string | null
          name: string
          primary_muscles: string[] | null
          secondary_muscles: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          demo_video_url?: string | null
          difficulty_level?: number | null
          equipment?: string | null
          form_tips?: string[] | null
          id?: string
          instructions?: string[] | null
          model_3d_url?: string | null
          name: string
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          demo_video_url?: string | null
          difficulty_level?: number | null
          equipment?: string | null
          form_tips?: string[] | null
          id?: string
          instructions?: string[] | null
          model_3d_url?: string | null
          name?: string
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "exercise_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          id: string
          last_error: string | null
          payload: Json | null
          run_at: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          id?: string
          last_error?: string | null
          payload?: Json | null
          run_at?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          last_error?: string | null
          payload?: Json | null
          run_at?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      media_uploads: {
        Row: {
          ai_description: string | null
          ai_tags: string[] | null
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          processing_status: string
          public_url: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          ai_description?: string | null
          ai_tags?: string[] | null
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          processing_status?: string
          public_url?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          ai_description?: string | null
          ai_tags?: string[] | null
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          processing_status?: string
          public_url?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      muscles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          achieved_at: string | null
          exercise_id: string | null
          id: string
          record_type: string
          reps: number | null
          session_id: string | null
          user_id: string
          value: number
          weight: number | null
        }
        Insert: {
          achieved_at?: string | null
          exercise_id?: string | null
          id?: string
          record_type: string
          reps?: number | null
          session_id?: string | null
          user_id: string
          value: number
          weight?: number | null
        }
        Update: {
          achieved_at?: string | null
          exercise_id?: string | null
          id?: string
          record_type?: string
          reps?: number | null
          session_id?: string | null
          user_id?: string
          value?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_day_exercises: {
        Row: {
          exercise_id: string | null
          id: string
          notes: string | null
          plan_day_id: string | null
          position: number
          target_reps_max: number | null
          target_reps_min: number | null
          target_rest_sec: number | null
          target_sets: number | null
          target_weight: number | null
        }
        Insert: {
          exercise_id?: string | null
          id?: string
          notes?: string | null
          plan_day_id?: string | null
          position: number
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rest_sec?: number | null
          target_sets?: number | null
          target_weight?: number | null
        }
        Update: {
          exercise_id?: string | null
          id?: string
          notes?: string | null
          plan_day_id?: string | null
          position?: number
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rest_sec?: number | null
          target_sets?: number | null
          target_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_day_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_day_exercises_plan_day_id_fkey"
            columns: ["plan_day_id"]
            isOneToOne: false
            referencedRelation: "plan_days"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_days: {
        Row: {
          id: string
          name: string
          plan_id: string | null
          position: number | null
          weekday: number | null
        }
        Insert: {
          id?: string
          name: string
          plan_id?: string | null
          position?: number | null
          weekday?: number | null
        }
        Update: {
          id?: string
          name?: string
          plan_id?: string | null
          position?: number | null
          weekday?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          goal: string | null
          id: string
          name: string
          split: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          goal?: string | null
          id?: string
          name: string
          split?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          goal?: string | null
          id?: string
          name?: string
          split?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pr_records: {
        Row: {
          exercise_id: string | null
          id: string
          kind: string | null
          occurred_at: string | null
          user_id: string | null
          value: number
        }
        Insert: {
          exercise_id?: string | null
          id?: string
          kind?: string | null
          occurred_at?: string | null
          user_id?: string | null
          value: number
        }
        Update: {
          exercise_id?: string | null
          id?: string
          kind?: string | null
          occurred_at?: string | null
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "pr_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profile_audit_log: {
        Row: {
          id: string
          ip_address: unknown | null
          operation: string
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          operation: string
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          operation?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          current_xp: number | null
          display_name: string | null
          experience_level: string | null
          goal: string | null
          height: number | null
          id: string
          phone: string | null
          streak_days: number | null
          total_workouts: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          weight: number | null
          workout_location: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          current_xp?: number | null
          display_name?: string | null
          experience_level?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          phone?: string | null
          streak_days?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          weight?: number | null
          workout_location?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          current_xp?: number | null
          display_name?: string | null
          experience_level?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          phone?: string | null
          streak_days?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          weight?: number | null
          workout_location?: string | null
        }
        Relationships: []
      }
      progress_rankings: {
        Row: {
          consistency_score: number | null
          created_at: string | null
          id: string
          overall_progress_score: number | null
          period_end: string
          period_start: string
          ranking_position: number | null
          strength_gains_score: number | null
          total_volume: number | null
          updated_at: string | null
          user_id: string
          workouts_completed: number | null
        }
        Insert: {
          consistency_score?: number | null
          created_at?: string | null
          id?: string
          overall_progress_score?: number | null
          period_end: string
          period_start: string
          ranking_position?: number | null
          strength_gains_score?: number | null
          total_volume?: number | null
          updated_at?: string | null
          user_id: string
          workouts_completed?: number | null
        }
        Update: {
          consistency_score?: number | null
          created_at?: string | null
          id?: string
          overall_progress_score?: number | null
          period_end?: string
          period_start?: string
          ranking_position?: number | null
          strength_gains_score?: number | null
          total_volume?: number | null
          updated_at?: string | null
          user_id?: string
          workouts_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          active: boolean | null
          id: string
          time_local: string
          type: string | null
          user_id: string | null
          weekday: number | null
        }
        Insert: {
          active?: boolean | null
          id?: string
          time_local: string
          type?: string | null
          user_id?: string | null
          weekday?: number | null
        }
        Update: {
          active?: boolean | null
          id?: string
          time_local?: string
          type?: string | null
          user_id?: string | null
          weekday?: number | null
        }
        Relationships: []
      }
      set_logs: {
        Row: {
          completed: boolean | null
          created_at: string | null
          exercise_log_id: string | null
          id: string
          notes: string | null
          reps: number | null
          rest_seconds: number | null
          rpe: number | null
          set_number: number
          weight: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          exercise_log_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          rpe?: number | null
          set_number: number
          weight?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          exercise_log_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          rpe?: number | null
          set_number?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_exercise_log_id_fkey"
            columns: ["exercise_log_id"]
            isOneToOne: false
            referencedRelation: "exercise_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      social_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          media_urls: string[] | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          media_urls?: string[] | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          media_urls?: string[] | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      social_likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          ai_generated: boolean
          comments_count: number
          content: string
          created_at: string
          id: string
          likes_count: number
          location: string | null
          media_urls: string[] | null
          post_type: string
          shares_count: number
          tags: string[] | null
          updated_at: string
          user_id: string
          visibility: string
          workout_data: Json | null
        }
        Insert: {
          ai_generated?: boolean
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          location?: string | null
          media_urls?: string[] | null
          post_type?: string
          shares_count?: number
          tags?: string[] | null
          updated_at?: string
          user_id: string
          visibility?: string
          workout_data?: Json | null
        }
        Update: {
          ai_generated?: boolean
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          location?: string | null
          media_urls?: string[] | null
          post_type?: string
          shares_count?: number
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          visibility?: string
          workout_data?: Json | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          created_at: string
          id: string
          post_id: string
          shared_to: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          shared_to: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          shared_to?: string
          user_id?: string
        }
        Relationships: []
      }
      social_stories: {
        Row: {
          created_at: string
          duration: number
          expires_at: string
          id: string
          media_type: string
          media_url: string
          user_id: string
          views_count: number
        }
        Insert: {
          created_at?: string
          duration?: number
          expires_at?: string
          id?: string
          media_type: string
          media_url: string
          user_id: string
          views_count?: number
        }
        Update: {
          created_at?: string
          duration?: number
          expires_at?: string
          id?: string
          media_type?: string
          media_url?: string
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string
          status: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          id: string
          notes: string | null
          order_index: number
          reps_max: number | null
          reps_min: number | null
          reps_target: string | null
          rest_seconds: number | null
          sets: number
          template_id: string | null
          weight_suggestion: number | null
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index: number
          reps_max?: number | null
          reps_min?: number | null
          reps_target?: string | null
          rest_seconds?: number | null
          sets?: number
          template_id?: string | null
          weight_suggestion?: number | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number
          reps_max?: number | null
          reps_min?: number | null
          reps_target?: string | null
          rest_seconds?: number | null
          sets?: number
          template_id?: string | null
          weight_suggestion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          id: string
          unlocked_at: string | null
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          id?: string
          unlocked_at?: string | null
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: []
      }
      webhook_events_processed: {
        Row: {
          event_id: string
          processed_at: string | null
        }
        Insert: {
          event_id: string
          processed_at?: string | null
        }
        Update: {
          event_id?: string
          processed_at?: string | null
        }
        Relationships: []
      }
      weekly_stats: {
        Row: {
          adherence_pct: number | null
          id: string
          iso_week: string
          sessions: number | null
          top_muscle: string | null
          updated_at: string | null
          user_id: string | null
          volume_total_kg: number | null
        }
        Insert: {
          adherence_pct?: number | null
          id?: string
          iso_week: string
          sessions?: number | null
          top_muscle?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_total_kg?: number | null
        }
        Update: {
          adherence_pct?: number | null
          id?: string
          iso_week?: string
          sessions?: number | null
          top_muscle?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_total_kg?: number | null
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          focus: string
          id: string
          name: string
          notes: string | null
          started_at: string | null
          template_id: string | null
          total_volume: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          focus: string
          id?: string
          name: string
          notes?: string | null
          started_at?: string | null
          template_id?: string | null
          total_volume?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          focus?: string
          id?: string
          name?: string
          notes?: string | null
          started_at?: string | null
          template_id?: string | null
          total_volume?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exercise_id: string | null
          id: string
          position: number
          reps: number | null
          rest_sec: number | null
          rpe: number | null
          session_id: string | null
          set_num: number | null
          target_reps_max: number | null
          target_reps_min: number | null
          target_sets: number | null
          target_weight: number | null
          unit_weight: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          position: number
          reps?: number | null
          rest_sec?: number | null
          rpe?: number | null
          session_id?: string | null
          set_num?: number | null
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_sets?: number | null
          target_weight?: number | null
          unit_weight?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          position?: number
          reps?: number | null
          rest_sec?: number | null
          rpe?: number | null
          session_id?: string | null
          set_num?: number | null
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_sets?: number | null
          target_weight?: number | null
          unit_weight?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_duration: number | null
          focus: string
          id: string
          is_public: boolean | null
          name: string
          target_muscle_groups: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          focus: string
          id?: string
          is_public?: boolean | null
          name: string
          target_muscle_groups?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          focus?: string
          id?: string
          is_public?: boolean | null
          name?: string
          target_muscle_groups?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_progress_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_session_volume: {
        Args: { session_id_param: string }
        Returns: number
      }
      has_free_access: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_profile_owner: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      is_subscriber_owner: {
        Args: { subscriber_user_id: string }
        Returns: boolean
      }
      seed_ai_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_user_access: {
        Args: { target_user_id: string }
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
