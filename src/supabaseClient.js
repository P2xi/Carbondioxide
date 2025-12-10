// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// BURAYA kendi Supabase URL ve anon key'ini koyacaksın:
const supabaseUrl = 'https://wmqduixubyqpvkeipqgu.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtcWR1aXh1YnlxcHZrZWlwcWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzAyNzcsImV4cCI6MjA4MDcwNjI3N30.KFsrdnVavZ18xlzjBoruVo0qk8lR3JxtzRO1tbeIOMs'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
