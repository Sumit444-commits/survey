"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const Location = () => {
    const [location, setLocation] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const location = router.query && router.query.location;
            if (location) {
                setLocation(location);
            }
        }
    }, [router.isReady, router.query]);

    const handleLocationChange = (event) => {
        const newLocation = event.target.value;
        setLocation(newLocation);
        router.push(`/Location?location=${newLocation}`, undefined, { shallow: true });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Location selected: ${location}`);
    };

    return (
        <form id="locationForm" onSubmit={handleSubmit}>
            <label id="locationLabel" htmlFor="locationDropdown">
                {location ? location : 'Select Location'}
            </label>
            <select
                id="locationDropdown"
                name="location"
                value={location}
                onChange={handleLocationChange}
            >
                <option value="">Select a location</option>
                <option value="AbuDhabi">Abu Dhabi</option>
                <option value="Dubai">Dubai</option>
                <option value="Sharjah">Sharjah</option>
            </select>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default Location;
