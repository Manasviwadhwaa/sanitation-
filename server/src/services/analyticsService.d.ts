export declare const getFacilityHealthSummary: (facilityId: number) => {
    facility_id: number;
    cleanliness_score: number;
    occupancy_rate: number;
    queue_pressure: any;
    last_cleaned_at: any;
    time_since_last_clean_minutes: number;
    alerts_open_count: any;
    sla_breach_risk: string;
};
export declare const getGlobalKPIs: () => {
    total_facilities: any;
    open_alerts: any;
    tasks_in_progress: any;
    avg_response_time_mins_today: number;
    today_cost_inr: any;
    total_users_last_24h: any;
    overall_cleanliness_index: number;
};
//# sourceMappingURL=analyticsService.d.ts.map