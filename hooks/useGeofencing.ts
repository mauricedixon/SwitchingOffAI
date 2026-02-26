'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';

function haversineDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
): number {
    const R = 6371e3; // meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useGeofencing() {
    const settings = useAppStore((s) => s.settings);
    const mode = useAppStore((s) => s.mode);
    const transitionMode = useAppStore((s) => s.transitionMode);
    const updateSettings = useAppStore((s) => s.updateSettings);
    const graceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!('geolocation' in navigator)) return;

        const onPosition = (pos: GeolocationPosition) => {
            const { latitude, longitude } = pos.coords;

            // Check work zone
            if (settings.work_zone_lat != null && settings.work_zone_lng != null) {
                const distToWork = haversineDistance(
                    latitude, longitude,
                    settings.work_zone_lat, settings.work_zone_lng
                );

                if (distToWork > settings.work_zone_radius && mode === 'work') {
                    // Left work zone — start grace period
                    if (!graceRef.current) {
                        graceRef.current = setTimeout(() => {
                            transitionMode('transition');
                            graceRef.current = null;
                        }, settings.transition_grace_minutes * 60000);
                    }
                } else if (distToWork <= settings.work_zone_radius) {
                    // In work zone — clear grace
                    if (graceRef.current) {
                        clearTimeout(graceRef.current);
                        graceRef.current = null;
                    }
                }
            }

            // Check home zone
            if (settings.home_zone_lat != null && settings.home_zone_lng != null) {
                const distToHome = haversineDistance(
                    latitude, longitude,
                    settings.home_zone_lat, settings.home_zone_lng
                );

                if (distToHome <= settings.home_zone_radius && mode === 'transition') {
                    setTimeout(() => {
                        transitionMode('chill');
                    }, settings.chill_settle_minutes * 60000);
                }
            }
        };

        const onError = (err: GeolocationPositionError) => {
            console.warn('Geofencing error:', err.message);
        };

        const watchId = navigator.geolocation.watchPosition(onPosition, onError, {
            enableHighAccuracy: false,
            maximumAge: 60000,
        });

        // Time-based fallback
        const timeInterval = setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentMinutes = hours * 60 + minutes;

            const [startH, startM] = settings.work_hours_start.split(':').map(Number);
            const [endH, endM] = settings.work_hours_end.split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            const dayOfWeek = now.getDay();
            const isWorkDay = settings.work_days.includes(dayOfWeek);
            const isWorkHours = currentMinutes >= startMinutes && currentMinutes < endMinutes;

            if (mode === 'work' && (!isWorkDay || !isWorkHours)) {
                transitionMode('transition');
            }
        }, 60000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            clearInterval(timeInterval);
            if (graceRef.current) clearTimeout(graceRef.current);
        };
    }, [mode, settings, transitionMode]);

    const captureWorkZone = useCallback(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            updateSettings({
                work_zone_lat: pos.coords.latitude,
                work_zone_lng: pos.coords.longitude,
            });
        });
    }, [updateSettings]);

    const captureHomeZone = useCallback(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            updateSettings({
                home_zone_lat: pos.coords.latitude,
                home_zone_lng: pos.coords.longitude,
            });
        });
    }, [updateSettings]);

    return { captureWorkZone, captureHomeZone };
}
