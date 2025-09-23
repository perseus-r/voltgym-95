-- Criar UUIDs fixos para usuários mock
DO $$
DECLARE
    user_ids UUID[] := ARRAY[
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888',
        '99999999-9999-9999-9999-999999999999',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ];
    names TEXT[] := ARRAY[
        'Carlos "Beast" Silva',
        'Ana Powerhouse', 
        'João Ironman',
        'Maria Strong',
        'Pedro Titan',
        'Carla Warrior',
        'Rafael Beast',
        'Julia Thunder',
        'Bruno Legend',
        'Fernanda Force'
    ];
    i INTEGER;
BEGIN
    -- Inserir perfis mock
    FOR i IN 1..10 LOOP
        INSERT INTO public.profiles (
            user_id,
            display_name,
            experience_level,
            goal,
            workout_location,
            current_xp,
            total_workouts,
            streak_days,
            created_at,
            updated_at
        ) VALUES (
            user_ids[i],
            names[i],
            'intermediario',
            'massa',
            'academia',
            1000 + (i * 100),
            20 + i,
            10 + i,
            NOW() - INTERVAL '30 days',
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            current_xp = EXCLUDED.current_xp,
            total_workouts = EXCLUDED.total_workouts,
            streak_days = EXCLUDED.streak_days;
    END LOOP;

    -- Inserir dados de ranking
    INSERT INTO public.progress_rankings (
        user_id,
        period_start,
        period_end,
        total_volume,
        workouts_completed,
        consistency_score,
        strength_gains_score,
        overall_progress_score,
        ranking_position
    ) VALUES 
        (user_ids[1], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 52340, 28, 93.3, 87.5, 95.8, 1),
        (user_ids[2], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 48920, 26, 86.7, 85.2, 91.2, 2),
        (user_ids[3], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 45780, 25, 83.3, 82.8, 88.5, 3),
        (user_ids[4], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 43560, 24, 80.0, 81.3, 85.7, 4),
        (user_ids[5], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 41230, 23, 76.7, 79.8, 82.9, 5),
        (user_ids[6], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 39480, 22, 73.3, 78.2, 80.1, 6),
        (user_ids[7], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 37650, 21, 70.0, 76.5, 77.3, 7),
        (user_ids[8], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 35890, 20, 66.7, 74.8, 74.5, 8),
        (user_ids[9], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 34120, 19, 63.3, 73.1, 71.7, 9),
        (user_ids[10], CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 32340, 18, 60.0, 71.4, 68.9, 10)
    ON CONFLICT (user_id, period_start, period_end) DO UPDATE SET
        total_volume = EXCLUDED.total_volume,
        workouts_completed = EXCLUDED.workouts_completed,
        consistency_score = EXCLUDED.consistency_score,
        strength_gains_score = EXCLUDED.strength_gains_score,
        overall_progress_score = EXCLUDED.overall_progress_score,
        ranking_position = EXCLUDED.ranking_position;
END $$;