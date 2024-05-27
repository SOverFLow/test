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
      Amortization: {
        Row: {
          accumulated_depreciation: number | null
          acquisition_date: string | null
          book_value: number | null
          created_at: string
          department_id: string | null
          depreciation_installment: number | null
          first_year_useful_life: number | null
          last_year_useful_life: number | null
          net_book: number | null
          number_of_years_of_depreciation: number | null
          start_date_of_the_fiscal_year: string | null
          uid: string
          value_of_the_asset: number | null
          year: number | null
        }
        Insert: {
          accumulated_depreciation?: number | null
          acquisition_date?: string | null
          book_value?: number | null
          created_at?: string
          department_id?: string | null
          depreciation_installment?: number | null
          first_year_useful_life?: number | null
          last_year_useful_life?: number | null
          net_book?: number | null
          number_of_years_of_depreciation?: number | null
          start_date_of_the_fiscal_year?: string | null
          uid?: string
          value_of_the_asset?: number | null
          year?: number | null
        }
        Update: {
          accumulated_depreciation?: number | null
          acquisition_date?: string | null
          book_value?: number | null
          created_at?: string
          department_id?: string | null
          depreciation_installment?: number | null
          first_year_useful_life?: number | null
          last_year_useful_life?: number | null
          net_book?: number | null
          number_of_years_of_depreciation?: number | null
          start_date_of_the_fiscal_year?: string | null
          uid?: string
          value_of_the_asset?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_amortization_department_Id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Bank: {
        Row: {
          account_number: string | null
          account_owner_address: string | null
          account_owner_name: string | null
          bank_address: string | null
          bank_name: string | null
          bic_swift_code: string | null
          country: string | null
          created_at: string
          currency: string | null
          iban_number: string | null
          id: number
          is_active: boolean | null
          label: string | null
          uid: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          account_owner_address?: string | null
          account_owner_name?: string | null
          bank_address?: string | null
          bank_name?: string | null
          bic_swift_code?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          iban_number?: string | null
          id?: number
          is_active?: boolean | null
          label?: string | null
          uid?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          account_number?: string | null
          account_owner_address?: string | null
          account_owner_name?: string | null
          bank_address?: string | null
          bank_name?: string | null
          bic_swift_code?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          iban_number?: string | null
          id?: number
          is_active?: boolean | null
          label?: string | null
          uid?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Bien: {
        Row: {
          city: string | null
          client_id: string | null
          contract_type: string | null
          country: string | null
          created_at: string
          date_signed: string | null
          department_id: string | null
          description: string | null
          id: number
          location: string | null
          money_earned: number | null
          money_returned: number | null
          name: string
          owner: string | null
          owner_number: string | null
          phone: string | null
          price: number | null
          service_wanted: string | null
          state_province: string | null
          status: string | null
          stock_needed: string | null
          tasks_done: number | null
          tasks_failed: number | null
          type: string
          uid: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          client_id?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string
          date_signed?: string | null
          department_id?: string | null
          description?: string | null
          id?: never
          location?: string | null
          money_earned?: number | null
          money_returned?: number | null
          name: string
          owner?: string | null
          owner_number?: string | null
          phone?: string | null
          price?: number | null
          service_wanted?: string | null
          state_province?: string | null
          status?: string | null
          stock_needed?: string | null
          tasks_done?: number | null
          tasks_failed?: number | null
          type: string
          uid?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          client_id?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string
          date_signed?: string | null
          department_id?: string | null
          description?: string | null
          id?: never
          location?: string | null
          money_earned?: number | null
          money_returned?: number | null
          name?: string
          owner?: string | null
          owner_number?: string | null
          phone?: string | null
          price?: number | null
          service_wanted?: string | null
          state_province?: string | null
          status?: string | null
          stock_needed?: string | null
          tasks_done?: number | null
          tasks_failed?: number | null
          type?: string
          uid?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bien_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Bien_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Catalog: {
        Row: {
          area: number | null
          country_of_origin: string | null
          created_at: string
          department_id: string
          height: number | null
          id: number
          image: string | null
          length: number | null
          name: string
          nature_of_product: string | null
          reference: string
          state_province_of_origin: string | null
          uid: string
          updated_at: string
          volume: number | null
          weight: number | null
          width: number | null
        }
        Insert: {
          area?: number | null
          country_of_origin?: string | null
          created_at?: string
          department_id: string
          height?: number | null
          id?: never
          image?: string | null
          length?: number | null
          name: string
          nature_of_product?: string | null
          reference: string
          state_province_of_origin?: string | null
          uid?: string
          updated_at?: string
          volume?: number | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          area?: number | null
          country_of_origin?: string | null
          created_at?: string
          department_id?: string
          height?: number | null
          id?: never
          image?: string | null
          length?: number | null
          name?: string
          nature_of_product?: string | null
          reference?: string
          state_province_of_origin?: string | null
          uid?: string
          updated_at?: string
          volume?: number | null
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Catalog_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Client: {
        Row: {
          address: string | null
          avatar: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          gender: string | null
          id: number
          last_name: string
          phone: string
          state_province: string | null
          status: string | null
          uid: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: never
          last_name: string
          phone: string
          state_province?: string | null
          status?: string | null
          uid?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: never
          last_name?: string
          phone?: string
          state_province?: string | null
          status?: string | null
          uid?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      client_department: {
        Row: {
          client_id: string
          department_id: string
        }
        Insert: {
          client_id: string
          department_id: string
        }
        Update: {
          client_id?: string
          department_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_service_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "client_service_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Comment: {
        Row: {
          content: string | null
          created_at: string
          id: number
          sender_id: string | null
          sender_img: string | null
          sender_name: string | null
          task_id: string
          uid: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: never
          sender_id?: string | null
          sender_img?: string | null
          sender_name?: string | null
          task_id: string
          uid?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: never
          sender_id?: string | null
          sender_img?: string | null
          sender_name?: string | null
          task_id?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
        ]
      }
      Company: {
        Row: {
          accountant_address: string | null
          accountant_code: string | null
          accountant_country: string | null
          accountant_email: string | null
          accountant_name: string | null
          accountant_note: string | null
          accountant_phone: string | null
          accountant_town: string | null
          accountant_web: string | null
          accountant_zip: string | null
          address: string | null
          capital: string | null
          city: string | null
          conditions_bank: string | null
          country: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_enum"] | null
          email: string | null
          friday_end_hour: string | null
          friday_start_hour: string | null
          id: number
          logo: string | null
          minimal_minutes_per_task: number | null
          monday_end_hour: string | null
          monday_start_hour: string | null
          name: string | null
          note: string | null
          phone: string | null
          pricing_hours: Json | null
          saturday_end_hour: string | null
          saturday_start_hour: string | null
          siret: string | null
          sunday_end_hour: string | null
          sunday_start_hour: string | null
          super_admin_id: string
          thursday_end_hour: string | null
          thursday_start_hour: string | null
          tuesday_end_hour: string | null
          tuesday_start_hour: string | null
          tva: string | null
          uid: string
          updated_at: string
          website: string | null
          wednesday_end_hour: string | null
          wednesday_start_hour: string | null
          working_hours: number | null
          zip_code: string | null
        }
        Insert: {
          accountant_address?: string | null
          accountant_code?: string | null
          accountant_country?: string | null
          accountant_email?: string | null
          accountant_name?: string | null
          accountant_note?: string | null
          accountant_phone?: string | null
          accountant_town?: string | null
          accountant_web?: string | null
          accountant_zip?: string | null
          address?: string | null
          capital?: string | null
          city?: string | null
          conditions_bank?: string | null
          country?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          email?: string | null
          friday_end_hour?: string | null
          friday_start_hour?: string | null
          id?: number
          logo?: string | null
          minimal_minutes_per_task?: number | null
          monday_end_hour?: string | null
          monday_start_hour?: string | null
          name?: string | null
          note?: string | null
          phone?: string | null
          pricing_hours?: Json | null
          saturday_end_hour?: string | null
          saturday_start_hour?: string | null
          siret?: string | null
          sunday_end_hour?: string | null
          sunday_start_hour?: string | null
          super_admin_id: string
          thursday_end_hour?: string | null
          thursday_start_hour?: string | null
          tuesday_end_hour?: string | null
          tuesday_start_hour?: string | null
          tva?: string | null
          uid?: string
          updated_at?: string
          website?: string | null
          wednesday_end_hour?: string | null
          wednesday_start_hour?: string | null
          working_hours?: number | null
          zip_code?: string | null
        }
        Update: {
          accountant_address?: string | null
          accountant_code?: string | null
          accountant_country?: string | null
          accountant_email?: string | null
          accountant_name?: string | null
          accountant_note?: string | null
          accountant_phone?: string | null
          accountant_town?: string | null
          accountant_web?: string | null
          accountant_zip?: string | null
          address?: string | null
          capital?: string | null
          city?: string | null
          conditions_bank?: string | null
          country?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          email?: string | null
          friday_end_hour?: string | null
          friday_start_hour?: string | null
          id?: number
          logo?: string | null
          minimal_minutes_per_task?: number | null
          monday_end_hour?: string | null
          monday_start_hour?: string | null
          name?: string | null
          note?: string | null
          phone?: string | null
          pricing_hours?: Json | null
          saturday_end_hour?: string | null
          saturday_start_hour?: string | null
          siret?: string | null
          sunday_end_hour?: string | null
          sunday_start_hour?: string | null
          super_admin_id?: string
          thursday_end_hour?: string | null
          thursday_start_hour?: string | null
          tuesday_end_hour?: string | null
          tuesday_start_hour?: string | null
          tva?: string | null
          uid?: string
          updated_at?: string
          website?: string | null
          wednesday_end_hour?: string | null
          wednesday_start_hour?: string | null
          working_hours?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Company_super_admin_id_fkey"
            columns: ["super_admin_id"]
            isOneToOne: false
            referencedRelation: "SuperAdmin"
            referencedColumns: ["uid"]
          },
        ]
      }
      Contact: {
        Row: {
          address: string | null
          created_at: string
          department_id: string
          email: string | null
          full_name: string
          id: number
          phone: string | null
          status: string | null
          uid: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          department_id: string
          email?: string | null
          full_name: string
          id?: never
          phone?: string | null
          status?: string | null
          uid?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          department_id?: string
          email?: string | null
          full_name?: string
          id?: never
          phone?: string | null
          status?: string | null
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Contact_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Contract: {
        Row: {
          bien_id: string | null
          client_id: string | null
          created_at: string
          department_id: string | null
          description: string | null
          discount: number | null
          end_date: string | null
          id: number
          name: string | null
          reference: string | null
          start_date: string | null
          uid: string
        }
        Insert: {
          bien_id?: string | null
          client_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          discount?: number | null
          end_date?: string | null
          id?: number
          name?: string | null
          reference?: string | null
          start_date?: string | null
          uid?: string
        }
        Update: {
          bien_id?: string | null
          client_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          discount?: number | null
          end_date?: string | null
          id?: number
          name?: string | null
          reference?: string | null
          start_date?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Contract_bien_id_fkey"
            columns: ["bien_id"]
            isOneToOne: false
            referencedRelation: "Bien"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Contract_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Contract_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      contract_service: {
        Row: {
          contract_id: string
          service_id: string
          uid: string
        }
        Insert: {
          contract_id: string
          service_id: string
          uid?: string
        }
        Update: {
          contract_id?: string
          service_id?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_service_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "Contract"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "contract_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Service"
            referencedColumns: ["uid"]
          },
        ]
      }
      contract_user_client: {
        Row: {
          contract_id: string | null
          uid: string
          user_client_id: string | null
        }
        Insert: {
          contract_id?: string | null
          uid?: string
          user_client_id?: string | null
        }
        Update: {
          contract_id?: string | null
          uid?: string
          user_client_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_user_client_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "Contract"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "contract_user_client_user_client_id_fkey"
            columns: ["user_client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
        ]
      }
      Department: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: number
          is_center_formation: boolean | null
          super_admin_id: string
          title: string
          uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: never
          is_center_formation?: boolean | null
          super_admin_id: string
          title: string
          uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: never
          is_center_formation?: boolean | null
          super_admin_id?: string
          title?: string
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Service_super_admin_id_fkey"
            columns: ["super_admin_id"]
            isOneToOne: false
            referencedRelation: "SuperAdmin"
            referencedColumns: ["uid"]
          },
        ]
      }
      department_user_student: {
        Row: {
          department_id: string
          uid: string
          user_student_id: string
        }
        Insert: {
          department_id: string
          uid?: string
          user_student_id: string
        }
        Update: {
          department_id?: string
          uid?: string
          user_student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_user_student_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "department_user_student_user_student_id_fkey"
            columns: ["user_student_id"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["uid"]
          },
        ]
      }
      department_user_worker: {
        Row: {
          department_id: string
          uid: string
          user_worker_id: string
        }
        Insert: {
          department_id: string
          uid?: string
          user_worker_id: string
        }
        Update: {
          department_id?: string
          uid?: string
          user_worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_department_user_worker_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_service_user_worker_user_worker_id_fkey"
            columns: ["user_worker_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
        ]
      }
      DepartmentCost: {
        Row: {
          cost_name: string
          created_at: string
          date_issued: string | null
          department_id: string
          description: string
          id: number
          price: number
          status: string
          type: string
          uid: string
          updated_at: string
        }
        Insert: {
          cost_name: string
          created_at?: string
          date_issued?: string | null
          department_id: string
          description: string
          id?: never
          price: number
          status: string
          type: string
          uid?: string
          updated_at?: string
        }
        Update: {
          cost_name?: string
          created_at?: string
          date_issued?: string | null
          department_id?: string
          description?: string
          id?: never
          price?: number
          status?: string
          type?: string
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ServiceCost_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      DepartmentSettings: {
        Row: {
          cold_evaluation: Json | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_enum"] | null
          department_id: string | null
          hot_evaluation: Json | null
          id: string
          minimal_minutes_per_task: number | null
          pricing_hours: Json | null
          self_evaluation: Json | null
          tva: string | null
          working_hours: number | null
        }
        Insert: {
          cold_evaluation?: Json | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          department_id?: string | null
          hot_evaluation?: Json | null
          id?: string
          minimal_minutes_per_task?: number | null
          pricing_hours?: Json | null
          self_evaluation?: Json | null
          tva?: string | null
          working_hours?: number | null
        }
        Update: {
          cold_evaluation?: Json | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_enum"] | null
          department_id?: string | null
          hot_evaluation?: Json | null
          id?: string
          minimal_minutes_per_task?: number | null
          pricing_hours?: Json | null
          self_evaluation?: Json | null
          tva?: string | null
          working_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "DepartmentSettings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Devis: {
        Row: {
          client_id: string | null
          company_id: string | null
          confirmed: boolean
          created_at: string
          currency: string | null
          date_issued: string | null
          department_id: string | null
          devis_price: number | null
          due_date: string | null
          id: number
          link_in_bucket: string | null
          reference: string
          status: string | null
          task_id: string | null
          title: string | null
          tva: string | null
          uid: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          confirmed?: boolean
          created_at?: string
          currency?: string | null
          date_issued?: string | null
          department_id?: string | null
          devis_price?: number | null
          due_date?: string | null
          id?: number
          link_in_bucket?: string | null
          reference: string
          status?: string | null
          task_id?: string | null
          title?: string | null
          tva?: string | null
          uid?: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          confirmed?: boolean
          created_at?: string
          currency?: string | null
          date_issued?: string | null
          department_id?: string | null
          devis_price?: number | null
          due_date?: string | null
          id?: number
          link_in_bucket?: string | null
          reference?: string
          status?: string | null
          task_id?: string | null
          title?: string | null
          tva?: string | null
          uid?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Devis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "Company"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Devis_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Devis_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Devis_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
        ]
      }
      Invoice: {
        Row: {
          client_id: string | null
          company_id: string | null
          confirmed: boolean
          created_at: string
          currency: string | null
          date_issued: string | null
          department_id: string | null
          due_date: string | null
          id: number
          invoice_price: number | null
          link_in_bucket: string | null
          reference: string
          status: string | null
          task_id: string | null
          title: string | null
          type: string | null
          uid: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          confirmed?: boolean
          created_at?: string
          currency?: string | null
          date_issued?: string | null
          department_id?: string | null
          due_date?: string | null
          id?: never
          invoice_price?: number | null
          link_in_bucket?: string | null
          reference: string
          status?: string | null
          task_id?: string | null
          title?: string | null
          type?: string | null
          uid?: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          confirmed?: boolean
          created_at?: string
          currency?: string | null
          date_issued?: string | null
          department_id?: string | null
          due_date?: string | null
          id?: never
          invoice_price?: number | null
          link_in_bucket?: string | null
          reference?: string
          status?: string | null
          task_id?: string | null
          title?: string | null
          type?: string | null
          uid?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Invoice_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Invoice_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Invoice_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Invoice_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "Company"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Invoice_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
        ]
      }
      Product: {
        Row: {
          area: number | null
          buy_price: number | null
          buy_tva: string | null
          country_of_origin: string | null
          created_at: string
          department_cost_id: string | null
          department_id: string
          desired_stock: number | null
          entry_date: string | null
          exit_date: string | null
          expiration_date: string | null
          height: number | null
          id: number
          image: string | null
          length: number | null
          name: string
          nature_of_product: string | null
          notes: string | null
          payment_method: string | null
          quantity: number | null
          refrence: string | null
          sell_price: number | null
          sell_tva: string | null
          serial_number: string | null
          state_province_of_origin: string | null
          stock_id: string | null
          stock_limit_for_alert: number | null
          supplier_id: string | null
          task_id: string | null
          uid: string
          updated_at: string
          volume: number | null
          weight: number | null
          width: number | null
        }
        Insert: {
          area?: number | null
          buy_price?: number | null
          buy_tva?: string | null
          country_of_origin?: string | null
          created_at?: string
          department_cost_id?: string | null
          department_id: string
          desired_stock?: number | null
          entry_date?: string | null
          exit_date?: string | null
          expiration_date?: string | null
          height?: number | null
          id?: never
          image?: string | null
          length?: number | null
          name: string
          nature_of_product?: string | null
          notes?: string | null
          payment_method?: string | null
          quantity?: number | null
          refrence?: string | null
          sell_price?: number | null
          sell_tva?: string | null
          serial_number?: string | null
          state_province_of_origin?: string | null
          stock_id?: string | null
          stock_limit_for_alert?: number | null
          supplier_id?: string | null
          task_id?: string | null
          uid?: string
          updated_at?: string
          volume?: number | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          area?: number | null
          buy_price?: number | null
          buy_tva?: string | null
          country_of_origin?: string | null
          created_at?: string
          department_cost_id?: string | null
          department_id?: string
          desired_stock?: number | null
          entry_date?: string | null
          exit_date?: string | null
          expiration_date?: string | null
          height?: number | null
          id?: never
          image?: string | null
          length?: number | null
          name?: string
          nature_of_product?: string | null
          notes?: string | null
          payment_method?: string | null
          quantity?: number | null
          refrence?: string | null
          sell_price?: number | null
          sell_tva?: string | null
          serial_number?: string | null
          state_province_of_origin?: string | null
          stock_id?: string | null
          stock_limit_for_alert?: number | null
          supplier_id?: string | null
          task_id?: string | null
          uid?: string
          updated_at?: string
          volume?: number | null
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Product_buy_tva_fkey"
            columns: ["buy_tva"]
            isOneToOne: false
            referencedRelation: "TVA"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Product_sell_tva_fkey"
            columns: ["sell_tva"]
            isOneToOne: false
            referencedRelation: "TVA"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Product_service_cost_id_fkey"
            columns: ["department_cost_id"]
            isOneToOne: false
            referencedRelation: "DepartmentCost"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Product_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Product_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Product_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "Stock"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "public_Product_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "Supplier"
            referencedColumns: ["uid"]
          },
        ]
      }
      Role: {
        Row: {
          created_at: string
          department_id: string | null
          permissions: Json | null
          title: string
          uid: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          permissions?: Json | null
          title: string
          uid?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          permissions?: Json | null
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Role_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Service: {
        Row: {
          buying_price_ht: number | null
          buying_price_ttc: number | null
          created_at: string
          department_id: string | null
          family_name: string | null
          id: number
          image: string | null
          reference: string | null
          selling_price_ht: number | null
          selling_price_ttc: number | null
          title: string | null
          tva: number | null
          uid: string
          units: string | null
          updated_at: string | null
        }
        Insert: {
          buying_price_ht?: number | null
          buying_price_ttc?: number | null
          created_at?: string
          department_id?: string | null
          family_name?: string | null
          id?: number
          image?: string | null
          reference?: string | null
          selling_price_ht?: number | null
          selling_price_ttc?: number | null
          title?: string | null
          tva?: number | null
          uid?: string
          units?: string | null
          updated_at?: string | null
        }
        Update: {
          buying_price_ht?: number | null
          buying_price_ttc?: number | null
          created_at?: string
          department_id?: string | null
          family_name?: string | null
          id?: number
          image?: string | null
          reference?: string | null
          selling_price_ht?: number | null
          selling_price_ttc?: number | null
          title?: string | null
          tva?: number | null
          uid?: string
          units?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_user_client: {
        Row: {
          service_id: string | null
          uid: string
          user_client_id: string | null
        }
        Insert: {
          service_id?: string | null
          uid?: string
          user_client_id?: string | null
        }
        Update: {
          service_id?: string | null
          uid?: string
          user_client_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_user_client_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Service"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "service_user_client_user_client_id_fkey"
            columns: ["user_client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
        ]
      }
      ServiceFamily: {
        Row: {
          created_at: string
          department_id: string | null
          id: number
          name: string | null
          uid: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: number
          name?: string | null
          uid?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: number
          name?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "ServiceFamily_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Stock: {
        Row: {
          created_at: string
          department_id: string
          expiry_date: string | null
          id: number
          location: string | null
          name: string
          owner: string | null
          payment_method: string | null
          purchase_date: string | null
          quantity: number | null
          type: string | null
          uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          expiry_date?: string | null
          id?: never
          location?: string | null
          name: string
          owner?: string | null
          payment_method?: string | null
          purchase_date?: string | null
          quantity?: number | null
          type?: string | null
          uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          expiry_date?: string | null
          id?: never
          location?: string | null
          name?: string
          owner?: string | null
          payment_method?: string | null
          purchase_date?: string | null
          quantity?: number | null
          type?: string | null
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Stock_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Student: {
        Row: {
          address: string | null
          avatar: string | null
          budget: string
          client_id: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          id: number
          images: string[] | null
          last_name: string
          level: string | null
          notes: string | null
          payment_method: string | null
          phone: string
          qcm_answers: Json | null
          registration_date: string | null
          social_security_number: string | null
          status: string | null
          uid: string
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          budget?: string
          client_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          id?: number
          images?: string[] | null
          last_name: string
          level?: string | null
          notes?: string | null
          payment_method?: string | null
          phone: string
          qcm_answers?: Json | null
          registration_date?: string | null
          social_security_number?: string | null
          status?: string | null
          uid?: string
        }
        Update: {
          address?: string | null
          avatar?: string | null
          budget?: string
          client_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: number
          images?: string[] | null
          last_name?: string
          level?: string | null
          notes?: string | null
          payment_method?: string | null
          phone?: string
          qcm_answers?: Json | null
          registration_date?: string | null
          social_security_number?: string | null
          status?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Student_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
        ]
      }
      SuperAdmin: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          first_name: string
          gender: string | null
          id: number
          last_name: string
          phone: string
          status: string
          uid: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          first_name: string
          gender?: string | null
          id?: never
          last_name: string
          phone: string
          status: string
          uid?: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          first_name?: string
          gender?: string | null
          id?: never
          last_name?: string
          phone?: string
          status?: string
          uid?: string
          updated_at?: string
        }
        Relationships: []
      }
      Supplier: {
        Row: {
          address: string | null
          bank_account: string | null
          city: string | null
          country: string | null
          created_at: string
          cuurency: Database["public"]["Enums"]["currency_enum"] | null
          department_id: string | null
          email: string | null
          fax: string | null
          name: string | null
          phone_number: string | null
          profesional_id: string | null
          representative_company: string | null
          state_province: string | null
          supplier_category: string | null
          supplier_type:
            | Database["public"]["Enums"]["supplier_type_enum"]
            | null
          tva: number | null
          uid: string
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          cuurency?: Database["public"]["Enums"]["currency_enum"] | null
          department_id?: string | null
          email?: string | null
          fax?: string | null
          name?: string | null
          phone_number?: string | null
          profesional_id?: string | null
          representative_company?: string | null
          state_province?: string | null
          supplier_category?: string | null
          supplier_type?:
            | Database["public"]["Enums"]["supplier_type_enum"]
            | null
          tva?: number | null
          uid?: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          cuurency?: Database["public"]["Enums"]["currency_enum"] | null
          department_id?: string | null
          email?: string | null
          fax?: string | null
          name?: string | null
          phone_number?: string | null
          profesional_id?: string | null
          representative_company?: string | null
          state_province?: string | null
          supplier_category?: string | null
          supplier_type?:
            | Database["public"]["Enums"]["supplier_type_enum"]
            | null
          tva?: number | null
          uid?: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Supplier_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      Task: {
        Row: {
          address: string
          bien_id: string | null
          client_id: string
          color: string | null
          column_id: string | null
          confirmed: boolean
          cost: number | null
          created_at: string
          department_id: string
          depend_on_id: string | null
          description: string | null
          end_date: string
          end_hour: string | null
          files: string[] | null
          id: number
          images: string[] | null
          lattitude: number | null
          long: number | null
          priority: string | null
          profit_net: number | null
          selected_products_in_stock: Json[] | null
          selected_products_out_stock: Json[] | null
          selling_price: number | null
          services: Json[] | null
          start_date: string
          start_hour: string | null
          status: string
          task_type: string
          title: string
          uid: string
          updated_at: string
          worker_cost: number | null
          workers: Json[] | null
        }
        Insert: {
          address: string
          bien_id?: string | null
          client_id: string
          color?: string | null
          column_id?: string | null
          confirmed?: boolean
          cost?: number | null
          created_at?: string
          department_id: string
          depend_on_id?: string | null
          description?: string | null
          end_date: string
          end_hour?: string | null
          files?: string[] | null
          id?: never
          images?: string[] | null
          lattitude?: number | null
          long?: number | null
          priority?: string | null
          profit_net?: number | null
          selected_products_in_stock?: Json[] | null
          selected_products_out_stock?: Json[] | null
          selling_price?: number | null
          services?: Json[] | null
          start_date: string
          start_hour?: string | null
          status?: string
          task_type?: string
          title: string
          uid?: string
          updated_at?: string
          worker_cost?: number | null
          workers?: Json[] | null
        }
        Update: {
          address?: string
          bien_id?: string | null
          client_id?: string
          color?: string | null
          column_id?: string | null
          confirmed?: boolean
          cost?: number | null
          created_at?: string
          department_id?: string
          depend_on_id?: string | null
          description?: string | null
          end_date?: string
          end_hour?: string | null
          files?: string[] | null
          id?: never
          images?: string[] | null
          lattitude?: number | null
          long?: number | null
          priority?: string | null
          profit_net?: number | null
          selected_products_in_stock?: Json[] | null
          selected_products_out_stock?: Json[] | null
          selling_price?: number | null
          services?: Json[] | null
          start_date?: string
          start_hour?: string | null
          status?: string
          task_type?: string
          title?: string
          uid?: string
          updated_at?: string
          worker_cost?: number | null
          workers?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_related_task"
            columns: ["depend_on_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Task_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Task_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "TaskColumn"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "Task_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      task_draft: {
        Row: {
          address: string
          bien_id: string | null
          client_id: string
          color: string | null
          column_id: string | null
          confirmed: boolean
          cost: number | null
          created_at: string
          department_id: string
          depend_on_id: string | null
          description: string | null
          end_date: string
          end_hour: string | null
          files: string[] | null
          id: number
          images: string[] | null
          lattitude: number | null
          long: number | null
          priority: string | null
          profit_net: number | null
          selected_products_in_stock: Json[] | null
          selected_products_out_stock: Json[] | null
          selling_price: number | null
          services: Json[] | null
          start_date: string
          start_hour: string | null
          status: string
          task_type: string
          title: string
          uid: string
          updated_at: string
          user_id: string | null
          worker_cost: number | null
          workers: Json[] | null
        }
        Insert: {
          address: string
          bien_id?: string | null
          client_id: string
          color?: string | null
          column_id?: string | null
          confirmed?: boolean
          cost?: number | null
          created_at?: string
          department_id: string
          depend_on_id?: string | null
          description?: string | null
          end_date: string
          end_hour?: string | null
          files?: string[] | null
          id?: never
          images?: string[] | null
          lattitude?: number | null
          long?: number | null
          priority?: string | null
          profit_net?: number | null
          selected_products_in_stock?: Json[] | null
          selected_products_out_stock?: Json[] | null
          selling_price?: number | null
          services?: Json[] | null
          start_date: string
          start_hour?: string | null
          status?: string
          task_type?: string
          title: string
          uid?: string
          updated_at?: string
          user_id?: string | null
          worker_cost?: number | null
          workers?: Json[] | null
        }
        Update: {
          address?: string
          bien_id?: string | null
          client_id?: string
          color?: string | null
          column_id?: string | null
          confirmed?: boolean
          cost?: number | null
          created_at?: string
          department_id?: string
          depend_on_id?: string | null
          description?: string | null
          end_date?: string
          end_hour?: string | null
          files?: string[] | null
          id?: never
          images?: string[] | null
          lattitude?: number | null
          long?: number | null
          priority?: string | null
          profit_net?: number | null
          selected_products_in_stock?: Json[] | null
          selected_products_out_stock?: Json[] | null
          selling_price?: number | null
          services?: Json[] | null
          start_date?: string
          start_hour?: string | null
          status?: string
          task_type?: string
          title?: string
          uid?: string
          updated_at?: string
          user_id?: string | null
          worker_cost?: number | null
          workers?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "task_draft_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_draft_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "TaskColumn"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_draft_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_draft_depend_on_id_fkey"
            columns: ["depend_on_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
        ]
      }
      task_user_students: {
        Row: {
          task_id: string
          user_student_id: string
        }
        Insert: {
          task_id: string
          user_student_id: string
        }
        Update: {
          task_id?: string
          user_student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_user_students_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_user_students_user_student_id_fkey"
            columns: ["user_student_id"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["uid"]
          },
        ]
      }
      task_user_students_draft: {
        Row: {
          task_id: string
          user_student_id: string
        }
        Insert: {
          task_id: string
          user_student_id: string
        }
        Update: {
          task_id?: string
          user_student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_user_students_draft_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_draft"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_user_students_draft_user_student_id_fkey"
            columns: ["user_student_id"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["uid"]
          },
        ]
      }
      task_user_worker: {
        Row: {
          task_id: string
          user_worker_id: string
        }
        Insert: {
          task_id: string
          user_worker_id: string
        }
        Update: {
          task_id?: string
          user_worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_task_user_worker_user_worker_id_fkey"
            columns: ["user_worker_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_user_worker_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
        ]
      }
      task_user_worker_draft: {
        Row: {
          task_id: string
          user_worker_id: string
        }
        Insert: {
          task_id: string
          user_worker_id: string
        }
        Update: {
          task_id?: string
          user_worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_user_worker_draft_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_draft"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "task_user_worker_draft_user_worker_id_fkey"
            columns: ["user_worker_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
        ]
      }
      TaskColumn: {
        Row: {
          created_at: string
          department_id: string
          id: number
          title: string
          uid: string
        }
        Insert: {
          created_at?: string
          department_id?: string
          id?: number
          title: string
          uid?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: number
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Status_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      TaskCost: {
        Row: {
          created_at: string
          date_issued: string | null
          description: string | null
          id: number
          name: string
          price: number
          status: string
          task_id: string
          type: string
          uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_issued?: string | null
          description?: string | null
          id?: never
          name: string
          price: number
          status: string
          task_id: string
          type: string
          uid?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_issued?: string | null
          description?: string | null
          id?: never
          name?: string
          price?: number
          status?: string
          task_id?: string
          type?: string
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_TaskCost_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["uid"]
          },
        ]
      }
      TVA: {
        Row: {
          country: string | null
          created_at: string
          department_id: string
          description: string | null
          id: number
          name: string
          uid: string
          updated_at: string
          value: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          department_id: string
          description?: string | null
          id?: never
          name: string
          uid?: string
          updated_at?: string
          value: number
        }
        Update: {
          country?: string | null
          created_at?: string
          department_id?: string
          description?: string | null
          id?: never
          name?: string
          uid?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "TVA_service_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "Department"
            referencedColumns: ["uid"]
          },
        ]
      }
      UserWorker: {
        Row: {
          address: string | null
          avatar: string | null
          city: string | null
          color: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          employment_date: string | null
          files: string[] | null
          first_name: string
          gender: string
          hours_worked: number | null
          id: number
          images: string[] | null
          job_position: string | null
          last_name: string
          licence_number: string | null
          notes: string | null
          phone: string
          salary_day: number
          salary_hour: number
          salary_month: number | null
          security_number: string | null
          state_province: string | null
          status: string | null
          supervisor_id: string | null
          task_cost_id: string | null
          uid: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          color?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          employment_date?: string | null
          files?: string[] | null
          first_name: string
          gender?: string
          hours_worked?: number | null
          id?: never
          images?: string[] | null
          job_position?: string | null
          last_name: string
          licence_number?: string | null
          notes?: string | null
          phone: string
          salary_day?: number
          salary_hour?: number
          salary_month?: number | null
          security_number?: string | null
          state_province?: string | null
          status?: string | null
          supervisor_id?: string | null
          task_cost_id?: string | null
          uid: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          color?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          employment_date?: string | null
          files?: string[] | null
          first_name?: string
          gender?: string
          hours_worked?: number | null
          id?: never
          images?: string[] | null
          job_position?: string | null
          last_name?: string
          licence_number?: string | null
          notes?: string | null
          phone?: string
          salary_day?: number
          salary_hour?: number
          salary_month?: number | null
          security_number?: string | null
          state_province?: string | null
          status?: string | null
          supervisor_id?: string | null
          task_cost_id?: string | null
          uid?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_UserWorker_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "UserWorker"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "UserWorker_task_cost_id_fkey"
            columns: ["task_cost_id"]
            isOneToOne: false
            referencedRelation: "TaskCost"
            referencedColumns: ["uid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_permissions: {
        Args: {
          json_data: Json
          role_name: string
        }
        Returns: undefined
      }
      adjust_permissions2: {
        Args: {
          json_data: Json
          role_name: string
          user_id: string
        }
        Returns: undefined
      }
      check_user_exists: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      create_and_adjust_role: {
        Args: {
          data_submitted: Json
          new_role_name: string
          department_uid: string
        }
        Returns: undefined
      }
      create_and_adjust_role_first_working_backup: {
        Args: {
          data_submitted: Json
          new_role_name: string
          service_uid: string
        }
        Returns: undefined
      }
      create_user_role_second: {
        Args: {
          user_id: string
          access_to_first: boolean
          access_to_second: boolean
          access_to_third: boolean
        }
        Returns: undefined
      }
      drop_roles: {
        Args: {
          role_names: string[]
        }
        Returns: undefined
      }
      get_all_roles: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_column_privileges: {
        Args: {
          grantee_name: string
          tables_input: string[]
        }
        Returns: Json
      }
      get_custom_database_roles: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_invoices_by_year: {
        Args: {
          dept_id: string
          yr: number
        }
        Returns: {
          client_id: string | null
          company_id: string | null
          confirmed: boolean
          created_at: string
          currency: string | null
          date_issued: string | null
          department_id: string | null
          due_date: string | null
          id: number
          invoice_price: number | null
          link_in_bucket: string | null
          reference: string
          status: string | null
          task_id: string | null
          title: string | null
          type: string | null
          uid: string
          updated_at: string
          worker_id: string | null
        }[]
      }
      get_public_table_names: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_true_coll: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_user_table: {
        Args: {
          user_uid: string
        }
        Returns: string
      }
      give_role: {
        Args: {
          user_email: string
          role_name: string
        }
        Returns: undefined
      }
      revoke_privileges_for_roles: {
        Args: {
          role_names: string[]
        }
        Returns: undefined
      }
      rpc_function_to_update_linked_task_real_table: {
        Args: {
          task_id: string
          new_end_date: string
        }
        Returns: undefined
      }
      update_linked_tasks_rpc: {
        Args: {
          task_id: number
          new_end_date: string
        }
        Returns: undefined
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      currency_enum:
        | "AED"
        | "AFN"
        | "ALL"
        | "AMD"
        | "ANG"
        | "AOA"
        | "ARS"
        | "AUD"
        | "AWG"
        | "AZN"
        | "BAM"
        | "BBD"
        | "BDT"
        | "BGN"
        | "BHD"
        | "BIF"
        | "BMD"
        | "BND"
        | "BOB"
        | "BRL"
        | "BSD"
        | "BTC"
        | "BTN"
        | "BWP"
        | "BYN"
        | "BZD"
        | "CAD"
        | "CDF"
        | "CHF"
        | "CLF"
        | "CLP"
        | "CNH"
        | "CNY"
        | "COP"
        | "CRC"
        | "CUC"
        | "CUP"
        | "CVE"
        | "CZK"
        | "DJF"
        | "DKK"
        | "DOP"
        | "DZD"
        | "EGP"
        | "ERN"
        | "ETB"
        | "EUR"
        | "FJD"
        | "FKP"
        | "GBP"
        | "GEL"
        | "GGP"
        | "GHS"
        | "GIP"
        | "GMD"
        | "GNF"
        | "GTQ"
        | "GYD"
        | "HKD"
        | "HNL"
        | "HRK"
        | "HTG"
        | "HUF"
        | "IDR"
        | "ILS"
        | "IMP"
        | "INR"
        | "IQD"
        | "IRR"
        | "ISK"
        | "JEP"
        | "JMD"
        | "JOD"
        | "JPY"
        | "KES"
        | "KGS"
        | "KHR"
        | "KMF"
        | "KPW"
        | "KRW"
        | "KWD"
        | "KYD"
        | "KZT"
        | "LAK"
        | "LBP"
        | "LKR"
        | "LRD"
        | "LSL"
        | "LYD"
        | "MAD"
        | "MDL"
        | "MGA"
        | "MKD"
        | "MMK"
        | "MNT"
        | "MOP"
        | "MRU"
        | "MUR"
        | "MVR"
        | "MWK"
        | "MXN"
        | "MYR"
        | "MZN"
        | "NAD"
        | "NGN"
        | "NIO"
        | "NOK"
        | "NPR"
        | "NZD"
        | "OMR"
        | "PAB"
        | "PEN"
        | "PGK"
        | "PHP"
        | "PKR"
        | "PLN"
        | "PYG"
        | "QAR"
        | "RON"
        | "RSD"
        | "RUB"
        | "RWF"
        | "SAR"
        | "SBD"
        | "SCR"
        | "SDG"
        | "SEK"
        | "SGD"
        | "SHP"
        | "SLL"
        | "SOS"
        | "SRD"
        | "SSP"
        | "STD"
        | "STN"
        | "SVC"
        | "SYP"
        | "SZL"
        | "THB"
        | "TJS"
        | "TMT"
        | "TND"
        | "TOP"
        | "TRY"
        | "TTD"
        | "TWD"
        | "TZS"
        | "UAH"
        | "UGX"
        | "USD"
        | "UYU"
        | "UZS"
        | "VEF"
        | "VES"
        | "VND"
        | "VUV"
        | "WST"
        | "XAF"
        | "XAG"
        | "XAU"
        | "XCD"
        | "XDR"
        | "XOF"
        | "XPD"
        | "XPF"
        | "XPT"
        | "YER"
        | "ZAR"
        | "ZMW"
        | "ZWL"
      service_type_enum: "hour" | "day"
      supplier_type_enum:
        | "Governmental"
        | "Large company"
        | "Medium company"
        | "Individual"
        | "other"
        | "Small company"
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
