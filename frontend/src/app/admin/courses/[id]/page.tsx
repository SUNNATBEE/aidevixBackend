'use client';

import React, { useEffect, useState } from 'react';
import { getCourseById, updateCourse, getCourseVideos, createVideo, updateVideo, deleteVideo } from '@/api/adminApi';
import { useParams, useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiVideo, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    level: '',
    category: '',
    isPublished: false,
  });

  // Video Form
  const [activeVideoForm, setActiveVideoForm] = useState<string | null>(null);
  const [videoData, setVideoData] = useState({ title: '', description: '', url: '', duration: 0, order: 0, isFree: false });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, vRes] = await Promise.all([
        getCourseById(id),
        getCourseVideos(id)
      ]);
      const c = cRes.data;
      setCourse(c);
      setFormData({
        title: c.title || '',
        description: c.description || '',
        price: c.price || 0,
        level: c.level || '',
        category: c.category || '',
        isPublished: c.isPublished || false,
      });
      setVideos(vRes.data?.videos || []);
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCourse(id, formData);
      toast.success('Course updated successfully!');
    } catch (error) {
      toast.error('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const openVideoModal = (vid?: any) => {
    if (vid) {
      setActiveVideoForm(vid._id);
      setVideoData({
        title: vid.title,
        description: vid.description || '',
        url: vid.url || '',
        duration: vid.duration || 0,
        order: vid.order || 0,
        isFree: vid.isFree || false
      });
    } else {
      setActiveVideoForm('new');
      setVideoData({
        title: '',
        description: '',
        url: '',
        duration: 0,
        order: videos.length + 1,
        isFree: false
      });
    }
  };

  const handleSaveVideo = async () => {
    try {
      if (activeVideoForm === 'new') {
        await createVideo({ ...videoData, course: id });
        toast.success('Video added!');
      } else {
        await updateVideo(activeVideoForm, videoData);
        toast.success('Video updated!');
      }
      setActiveVideoForm(null);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const handleDeleteVideo = async (vidId: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      await deleteVideo(vidId);
      toast.success('Video deleted');
      setVideos(prev => prev.filter(v => v._id !== vidId));
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-indigo-500"><span className="loading loading-spinner loading-lg text-indigo-500"></span></div>;
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition">
            <FiArrowLeft className="text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">Edit "{course?.title}"</h1>
            <p className="text-sm text-slate-400 mt-1">Make changes to course information and manage its video lessons.</p>
          </div>
        </div>
        <button 
          onClick={handleSaveCourse}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 w-full md:w-auto justify-center"
        >
          {saving ? <span className="loading loading-spinner loading-sm" /> : <FiSave />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-4">Basic Information</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Course Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm custom-scrollbar leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Price ($)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Level</label>
                  <select 
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Publish Course</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Make this course visible to students</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Video Manager */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-lg font-semibold text-white">Course Curriculum</h2>
              <button onClick={() => openVideoModal()} className="text-sm bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-medium border border-indigo-500/20 hover:border-indigo-500">
                <FiPlus /> Add Video
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {videos.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                  <FiVideo className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-500 text-sm">No videos found. <br/>Upload your first lesson.</p>
                </div>
              ) : (
                videos.map((vid, idx) => (
                  <div key={vid._id} className="group relative bg-slate-950 border border-slate-800 rounded-xl p-3 flex gap-3 hover:border-indigo-500/50 transition-colors">
                    <div className="w-20 h-14 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-700">
                      <FiVideo className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 truncate pr-8">{vid.order}. {vid.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center"><FiClock className="mr-1"/> {vid.duration || 0}m</span>
                        {vid.isFree ? <span className="text-emerald-400">Free Preview</span> : <span className="text-amber-400">Premium</span>}
                      </div>
                    </div>
                    {/* Floating Actions */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg">
                      <button onClick={() => openVideoModal(vid)} className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded hover:text-indigo-300">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteVideo(vid._id)} className="p-1.5 text-red-500 hover:bg-red-500/20 rounded hover:text-red-400">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {activeVideoForm === 'new' ? 'Add New Lesson' : 'Edit Lesson'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Video Title</label>
                  <input 
                    type="text" 
                    value={videoData.title}
                    onChange={e => setVideoData({...videoData, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Video URL / BunnyID</label>
                  <input 
                    type="text" 
                    value={videoData.url}
                    onChange={e => setVideoData({...videoData, url: e.target.value})}
                    placeholder="Bunny Video ID or URL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Duration (min)</label>
                    <input 
                      type="number" 
                      value={videoData.duration}
                      onChange={e => setVideoData({...videoData, duration: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Order</label>
                    <input 
                      type="number" 
                      value={videoData.order}
                      onChange={e => setVideoData({...videoData, order: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="isFreePreview" 
                    checked={videoData.isFree}
                    onChange={e => setVideoData({...videoData, isFree: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="isFreePreview" className="text-sm font-medium text-slate-300">Set as Free Preview</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => setActiveVideoForm(null)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveVideo}
                  className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Save Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
