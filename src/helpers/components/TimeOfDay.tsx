import React, { useEffect, useState } from 'react';
import { TimeOfDayProps } from '../../types';
import daySymbol from '../graphics/time_of_day/sun.png'
import eveningSymbol from '../graphics/time_of_day/sun-cloud.png'
import nightSymbol from '../graphics/time_of_day/moon.png'

const TimeOfDay: React.FC<TimeOfDayProps> = (props: TimeOfDayProps) => {
    // Destructure props for ease of access & documentation
    const {
        setCurrentTime,
    } = props;

    const determineSymbol = (hour: number) => {
        if (hour >= 6 && hour < 18) {
            setTimeSymbol(daySymbol);
            setCurrentTime('Day');
        } else if (hour >= 18 && hour < 21) {
            setTimeSymbol(eveningSymbol);
            setCurrentTime('Evening');
        } else {
            setTimeSymbol(nightSymbol);
            setCurrentTime('Night');
        }
    }

    const [timeSymbol, setTimeSymbol] = useState<string>(daySymbol);

    // Start the timer to check the time every 600000 milliseconds (10 minutes)
    const timeListener = setInterval(() => {
        const now = new Date();
        const hour = now.getHours();

        determineSymbol(hour);
    }, 600000);

    // Check time on initialization
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        console.log(`The hour is: ${hour}`);

        determineSymbol(hour);
    }, []);

    return (
        <div id='TimeOfDay'>
            <img src={timeSymbol} />
        </div>
    );
};

export default TimeOfDay;