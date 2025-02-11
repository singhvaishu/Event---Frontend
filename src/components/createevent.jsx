

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaDollarSign } from "react-icons/fa";
const CreateEvent = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        description: "",
        price: "",
        image: null,
        status: "Upcoming",
        location: "",
        category: "Conference"
    });

    const [events, setEvents] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/events");
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEventData({ ...eventData, image: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `http://localhost:5000/api/events/${editingId}` : "http://localhost:5000/api/events";

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", eventData.name);
        formData.append("date", eventData.date);
        formData.append("description", eventData.description);
        formData.append("price", eventData.price);
        formData.append("status", eventData.status);
        formData.append("location", eventData.location);
        formData.append("category", eventData.category);

        if (eventData.image) {
            formData.append("image", eventData.image);
        }

        try {
            const response = await fetch(url, {
                method: method,
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchEvents();
                setEventData({
                    name: "",
                    date: "",
                    description: "",
                    price: "",
                    image: null,
                    status: "Upcoming",
                    location: "",
                    category: "Conference"
                });
                setEditingId(null);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    const handleEdit = (event) => {
        if (!event || !event._id) return;

        setEditingId(event._id);
        setEventData((prevData) => ({
            ...prevData,
            name: event.name || "",
            date: event.date || "",
            location: event.location || "",
            description: event.description || "",
            price: event.price || 0,
            imageUrl: event.imageUrl || "",
        }));
    };


    const handleDelete = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No auth token found. Please log in.");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete event");
            }

            console.log("Event deleted successfully!");
        } catch (error) {
            console.error("Delete event error:", error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">{editingId ? "Edit Event" : "Create Event"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Event Name" value={eventData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="date" name="date" value={eventData.date} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <textarea name="description" placeholder="Event Description" value={eventData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="number" name="price" placeholder="Ticket Price" value={eventData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input type="text" name="location" placeholder="Event Location" value={eventData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <select name="category" value={eventData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                        <option value="Conference">Conference</option>
                        <option value="Music">Music</option>
                        <option value="Art">Art</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                    </select>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        {editingId ? "Update Event" : "Create Event"}
                    </button>
                </form>
            </div>

            <div className="mt-8 w-full max-w-6xl">
                <h2 className="text-xl font-bold mb-4">Event List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event._id} className="bg-white shadow-md rounded-lg p-4">
                                <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-lg mb-2" />
                                <h3 className="text-lg font-bold">{event.name}</h3>
                                <p className="flex items-center gap-2"><FaCalendarAlt /> {event.date}</p>
                                <p className="flex items-center gap-2"><FaMapMarkerAlt /> {event.location}</p>
                                <p className="flex items-center gap-2"><FaInfoCircle /> {event.description}</p>
                                <p className="flex items-center gap-2"><FaDollarSign /> ${event.price}</p>
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => handleEdit(event)} className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
