
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [category, setCategory] = useState("All");
    const [dateFilter, setDateFilter] = useState("upcoming");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch('https://event-backend-production-c3a4.up.railway.app/api/events')
            .then(response => response.json())
            .then(data => {
                setEvents(data);
                setFilteredEvents(data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    // Filtering logic
    useEffect(() => {
        let filtered = events;

        // Filter by category
        if (category !== "All") {
            filtered = filtered.filter(event => event.category === category);
        }

        // Filter by date
        const currentDate = new Date();
        if (dateFilter === "upcoming") {
            filtered = filtered.filter(event => new Date(event.date) >= currentDate);
        } else {
            filtered = filtered.filter(event => new Date(event.date) < currentDate);
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredEvents(filtered);
    }, [category, dateFilter, searchQuery, events]);

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-6">Dashboard - Events</h1>
                {/* Buttons for navigation */}
                <div className="mt-4 mb-4 flex justify-center gap-6">
                    <Link to="/create-event">
                        <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform hover:bg-green-600 hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out">
                            Create Event
                        </button>
                    </Link>
                    <Link to="/event-detail">
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform hover:bg-blue-600 hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out">
                            Event Details
                        </button>
                    </Link>
                </div>


                {/* Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded-md w-full sm:w-1/3"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="All">All Categories</option>
                        <option value="Music">Music</option>
                        <option value="Tech">Tech</option>
                        <option value="Business">Business</option>
                        <option value="Sports">Sports</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="upcoming">Upcoming Events</option>
                        <option value="past">Past Events</option>
                    </select>
                </div>
                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                                <img
                                    src={event.imageUrl || "https://res.cloudinary.com/dqns11yj7/image/upload/v1739196869/r3_pa3s5z.png"}
                                    alt={event.name}
                                    className="w-full h-52 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                                <p className="mt-2 text-gray-700">{event.description}</p>

                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                    <FaCalendarAlt className="mr-2 text-gray-500" />
                                    <p>{event.date}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                    <p>{event.location}</p>
                                </div>

                                <div className="flex items-center text-lg font-semibold text-blue-600 mt-3">
                                    <FaDollarSign className="mr-2 text-gray-500" />
                                    <p>${event.price}</p>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <FaUsers className="mr-2" />
                                    <p>{event.peopleAttend} Attendees</p>
                                </div>

                                <Link to={`/event-detail/${event._id}`}>
                                    <button className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out">
                                        View Event
                                    </button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No events available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
