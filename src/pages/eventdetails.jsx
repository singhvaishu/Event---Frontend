
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign } from 'react-icons/fa';
const socket = io("https://event-backend-production-c3a4.up.railway.app", {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
});

socket.on("connect", () => console.log("🟢 WebSocket connected:", socket.id));
socket.on("disconnect", () => console.log("🔴 WebSocket disconnected"));

const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return jwtDecode(token).userId;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

const EventDetail = () => {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStatus, setUserStatus] = useState({});

    useEffect(() => {
        const storedStatus = JSON.parse(localStorage.getItem("userStatus")) || {};
        setUserStatus(storedStatus);

        const fetchEvents = async () => {
            try {
                setLoading(true);
                const url = eventId
                    ? `https://event-backend-production-c3a4.up.railway.app/api/events/${eventId}`
                    : `https://event-backend-production-c3a4.up.railway.app/api/events`;

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch event details");

                const data = await response.json();
                setEvents(eventId ? [data] : data);

                const userId = getUserIdFromToken();
                if (userId) {
                    const statusResponse = await fetch(`https://event-backend-production-c3a4.up.railway.app/api/user/events`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    if (statusResponse.ok) {
                        const enrolledEvents = await statusResponse.json();
                        const statusMap = enrolledEvents.reduce((acc, { _id }) => ({ ...acc, [_id]: true }), {});
                        setUserStatus(statusMap);
                        localStorage.setItem("userStatus", JSON.stringify(statusMap));
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        const updateAttendees = ({ eventId, peopleAttend }) => {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === eventId ? { ...event, peopleAttend } : event
                )
            );
        };

        socket.on("attendeeCountUpdated", updateAttendees);
        return () => socket.off("attendeeCountUpdated", updateAttendees);
    }, [eventId]);

    const handleJoinEvent = async (eventId) => {
        if (userStatus[eventId]) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`https://event-backend-production-c3a4.up.railway.app/api/${eventId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to join event");

            setUserStatus((prev) => {
                const updatedStatus = { ...prev, [eventId]: true };
                localStorage.setItem("userStatus", JSON.stringify(updatedStatus));
                return updatedStatus;
            });
        } catch (error) {
            console.error("Join event error:", error.message);
        }
    };

    const handleWithdrawEvent = async (eventId) => {
        if (!userStatus[eventId]) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`https://event-backend-production-c3a4.up.railway.app/api/${eventId}/withdraw`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to withdraw from event");

            setUserStatus((prev) => {
                const updatedStatus = { ...prev, [eventId]: false };
                localStorage.setItem("userStatus", JSON.stringify(updatedStatus));
                return updatedStatus;
            });
        } catch (error) {
            console.error("Withdraw event error:", error.message);
        }
    };

    if (loading) return <div className="text-center text-gray-500">Loading event details...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full max-w-7xl">

                <h1 className="text-3xl font-bold text-center mb-6">Event Details</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white shadow-md rounded-lg p-6">
                            {/* Event Image */}
                            <img src={event.imageUrl || "https://via.placeholder.com/600x400"} alt={event.name} className="w-full h-64 object-cover rounded-lg" />

                            <h2 className="text-2xl font-bold mt-4">{event.name}</h2>

                            <p className="mt-2">{event.description}</p>

                            <div className="flex items-center text-gray-600 mt-2">
                                <FaCalendarAlt className="mr-2 text-gray-500" />
                                <p>{event.date}</p>
                            </div>
                            <div className="flex items-center text-gray-600 mt-2">
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


                            <div className="mt-4 flex gap-4">
                                <button onClick={() => handleJoinEvent(event._id)} className={`px-4 py-2 rounded-lg ${userStatus[event._id] ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`} disabled={userStatus[event._id]}>
                                    {userStatus[event._id] ? "Enrolled" : "Enroll"}
                                </button>
                                <button onClick={() => handleWithdrawEvent(event._id)} className={`px-4 py-2 rounded-lg ${!userStatus[event._id] ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white"}`} disabled={!userStatus[event._id]}>
                                    {userStatus[event._id] ? "Withdraw" : "Withdrawn"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default EventDetail;
