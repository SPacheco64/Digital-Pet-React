import React, { useEffect } from 'react';
import { TimeOfDayProps } from '../../types';
import daySymbol from '../../graphics/time_of_day/sun.png'
import eveningSymbol from '../../graphics/time_of_day/sun-cloud.png'
import nightSymbol from '../../graphics/time_of_day/moon.png'

const TimeOfDay: React.FC<TimeOfDayProps> = (props: TimeOfDayProps) => {
    const {
        currentTime,
        setCurrentTime,
    } = props;

    // Determine the time of day based on the current hour
    // 'Day,' 'Evening,' or 'Night'
    const determineTimeOfDay = (hour: number) => {
        if (hour >= 6 && hour < 18) {
            return 'Day';
        }
        return hour >= 18 && hour < 21 ? 'Evening' : 'Night';
    };

    useEffect(() => {
        const updateTimeOfDay = () => {
            const nextTimeOfDay = determineTimeOfDay(new Date().getHours());
            setCurrentTime((currentTime) => (
                currentTime === nextTimeOfDay ? currentTime : nextTimeOfDay
            ));
        };

        updateTimeOfDay();
        
        // Update the time of day every 10 minutes (600,000 milliseconds)
        const timeListener = window.setInterval(updateTimeOfDay, 600000);

        return () => window.clearInterval(timeListener);
    }, [setCurrentTime]);

    const timeSymbols: Record<string, string> = {
        Day: daySymbol,
        Evening: eveningSymbol,
        Night: nightSymbol,
    };

    return (
        <div id='TimeOfDay'>
            <img src={timeSymbols[currentTime] ?? nightSymbol} alt={`${currentTime} time of day`} />
        </div>
    );
};

export default TimeOfDay;