"use client";
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminAuthorEditorProps {
  onClose: () => void;
  onSave: (authorName: string) => void;
}

const AdminAuthorEditor: React.FC<AdminAuthorEditorProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [websiteLinks, setWebsiteLinks] = useState<string[]>(['']);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddSocialLink = () => setSocialLinks([...socialLinks, '']);
  const handleUpdateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };
  const handleRemoveSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks.length ? newLinks : ['']);
  };

  const handleAddWebsiteLink = () => setWebsiteLinks([...websiteLinks, '']);
  const handleUpdateWebsiteLink = (index: number, value: string) => {
    const newLinks = [...websiteLinks];
    newLinks[index] = value;
    setWebsiteLinks(newLinks);
  };
  const handleRemoveWebsiteLink = (index: number) => {
    const newLinks = websiteLinks.filter((_, i) => i !== index);
    setWebsiteLinks(newLinks.length ? newLinks : ['']);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Author name is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Clean up empty links
      const cleanedSocialLinks = socialLinks.filter(link => link.trim() !== '');
      const cleanedWebsiteLinks = websiteLinks.filter(link => link.trim() !== '');

      const authorData = {
        name: name.trim(),
        title: title.trim(),
        profilePicture: profilePicture.trim(),
        description: description.trim(),
        socialLinks: cleanedSocialLinks,
        websiteLinks: cleanedWebsiteLinks,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'authors'), authorData);
      onSave(authorData.name);
    } catch (err: any) {
      console.error('Error saving author:', err);
      setError(err.message || 'Failed to save author');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#f8f9fa] dark:bg-[#1a1d27]">
      {/* Header */}
      <div className="bg-white dark:bg-[#252a36] px-4 py-4 flex items-center shadow-sm z-10">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Create New Author
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#252a36] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-8">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Author Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Agronomist"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base"
            />
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Profile Picture URL</label>
            <input 
              type="text" 
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base"
            />
            {profilePicture && (
              <div className="mt-4 relative rounded-full overflow-hidden w-24 h-24 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img 
                  src={profilePicture} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150?text=Invalid+URL'; }} 
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Author biography or description..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base resize-y"
            />
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Social Media Links</label>
            {socialLinks.map((link, index) => (
              <div key={`social-${index}`} className="flex gap-2">
                <input 
                  type="text" 
                  value={link}
                  onChange={(e) => handleUpdateSocialLink(index, e.target.value)}
                  placeholder="e.g. https://instagram.com/johndoe"
                  className="flex-1 min-w-0 px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={handleAddSocialLink}
              className="text-sm font-bold text-[#d4a017] hover:text-[#b8860b] flex items-center gap-1 transition-colors"
            >
              <Plus size={16} /> Add another social link
            </button>
          </div>

          {/* Website Links */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-wider text-gray-900 dark:text-white uppercase">Website Links</label>
            {websiteLinks.map((link, index) => (
              <div key={`website-${index}`} className="flex gap-2">
                <input 
                  type="text" 
                  value={link}
                  onChange={(e) => handleUpdateWebsiteLink(index, e.target.value)}
                  placeholder="e.g. https://johndoe.com"
                  className="flex-1 min-w-0 px-4 py-3 bg-gray-50 dark:bg-[#1a1d27] border border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#252a36] focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all text-base"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveWebsiteLink(index)}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={handleAddWebsiteLink}
              className="text-sm font-bold text-[#d4a017] hover:text-[#b8860b] flex items-center gap-1 transition-colors"
            >
              <Plus size={16} /> Add another website link
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-[#d4a017] hover:bg-[#b8860b] text-white rounded-xl font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md"
            >
              <span>{isSaving ? 'Saving...' : 'Save Author'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminAuthorEditor;
