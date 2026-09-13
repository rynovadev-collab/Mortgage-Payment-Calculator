import { supabase } from "@/integrations/supabase/client";

interface LoginAttemptData {
  email: string;
  success: boolean;
  failureReason?: string;
}

interface LoginHistoryData {
  userId: string;
  deviceInfo?: string;
}

interface SecurityAlertData {
  userId: string;
  alertType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata?: Record<string, any>;
}

export const useSecurityTracking = () => {
  const getUserAgent = () => navigator.userAgent;
  
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = "Unknown";
    
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      device = "Mobile";
    } else if (/Tablet/.test(ua)) {
      device = "Tablet";
    } else {
      device = "Desktop";
    }
    
    return device;
  };

  const trackLoginAttempt = async (data: LoginAttemptData) => {
    try {
      await supabase.from("login_attempts").insert({
        email: data.email,
        user_agent: getUserAgent(),
        success: data.success,
        failure_reason: data.failureReason,
      });
    } catch (error) {
      console.error("Failed to track login attempt:", error);
    }
  };

  const trackLoginHistory = async (data: LoginHistoryData) => {
    try {
      await supabase.from("login_history").insert({
        user_id: data.userId,
        user_agent: getUserAgent(),
        device_info: data.deviceInfo || getDeviceInfo(),
      });
    } catch (error) {
      console.error("Failed to track login history:", error);
    }
  };

  const createSecurityAlert = async (data: SecurityAlertData) => {
    try {
      await supabase.from("security_alerts").insert({
        user_id: data.userId,
        alert_type: data.alertType,
        severity: data.severity,
        description: data.description,
        metadata: data.metadata,
      });
    } catch (error) {
      console.error("Failed to create security alert:", error);
    }
  };

  const checkAccountLockout = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc("is_account_locked", { user_email: email });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error("Failed to check account lockout:", error);
      return false;
    }
  };

  const getRecentFailedAttempts = async (email: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .rpc("get_recent_failed_attempts", { user_email: email });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error("Failed to get failed attempts:", error);
      return 0;
    }
  };

  return {
    trackLoginAttempt,
    trackLoginHistory,
    createSecurityAlert,
    checkAccountLockout,
    getRecentFailedAttempts,
  };
};
