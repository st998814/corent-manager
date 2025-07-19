import React from 'react'
import { useState } from 'react';
import AddButton from '../components/AddButton';
import AnnouncementForm from './AnnouncementForm';

interface Announcement {
  title: string;
  description: string;
}



const AnnouncementCard = () => {
    const [showForm, setShowForm] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const handleAddAnnouncement = (data: { title: string; description: string }) => {
        const newAnnouncement: Announcement = { ...data };
        setAnnouncements((prev) => [newAnnouncement, ...prev]);
        setShowForm(false);
    };


  return (
       <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-end">
        <AddButton onClick={() => setShowForm(true)} />
      </div>
      {showForm && (
        <AnnouncementForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddAnnouncement}
        />
      )}
      {announcements.map((ann, index) => (
        <div key={index} className="mb-4 text-black">
          <h3 className="text-lg font-bold">{ann.title}</h3>
          <p>{ann.description}</p>
        </div>
      ))}
    </div>
  )
}

export default AnnouncementCard





