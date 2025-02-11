
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { MdLocationOn, MdDateRange, MdPeople } from "react-icons/md";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:5000/api/events")
            .then((response) => {
                setEvents(response.data);
                setFilteredEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    // Filter & Search Logic
    useEffect(() => {
        let updatedEvents = events;

        if (category !== "All") {
            updatedEvents = updatedEvents.filter(event => event.category === category);
        }

        if (searchQuery) {
            updatedEvents = updatedEvents.filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredEvents(updatedEvents);
    }, [searchQuery, category, events]);

    const handleViewDetails = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
            <div className="w-full bg-white p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">All Events</h1>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 border rounded-lg w-full sm:w-2/3 lg:w-1/2 focus:ring-2 focus:ring-blue-500 text-lg shadow-md"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-3 border rounded-lg w-full sm:w-1/3 lg:w-1/4 focus:ring-2 focus:ring-blue-500 text-lg shadow-md"
                    >
                        <option value="All">All Categories</option>
                        <option value="Conference">Conference</option>
                        <option value="Music">Music</option>
                        <option value="Art">Art</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                    </select>
                </div>

                {/* Event Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
                                <img
                                    src={event.imageUrl || "https://via.placeholder.com/400"}
                                    alt={event.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            {event.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <MdDateRange /> {event.date}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <MdLocationOn /> {event.location}
                                        </p>

                                        <div className="mt-4 flex justify-between items-center">
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <MdPeople /> Attendees: {event.peopleAttend}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleViewDetails} // Trigger modal on click
                                            className="mt-4 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-lg"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No events found.</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Registration Required</h2>
                        <p className="text-lg mb-4">You need to register to access and enroll in this event.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={closeModal} className="px-6 py-2 bg-gray-500 text-white rounded-lg">
                                Close
                            </button>
                            <button onClick={() => navigate("/signup")} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
