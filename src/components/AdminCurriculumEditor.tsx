"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MoreVertical, ChevronDown, ChevronRight, Folder, FileText, PlayCircle, Plus, Layers } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Lesson {
  id: string;
  title: string;
  type: 'document' | 'video';
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

interface Level {
  id: string;
  title: string;
  status: 'published' | 'draft';
  modules: Module[];
  isExpanded?: boolean;
}

interface AdminCurriculumEditorProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
}

const AdminCurriculumEditor: React.FC<AdminCurriculumEditorProps> = ({ courseId, courseTitle, onBack }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const docRef = doc(db, 'courses', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.curriculum) {
            setLevels(data.curriculum);
          }
        }
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculum();
  }, [courseId]);

  const saveCurriculum = async (newLevels: Level[]) => {
    try {
      const docRef = doc(db, 'courses', courseId);
      await updateDoc(docRef, { curriculum: newLevels });
    } catch (error) {
      console.error("Error saving curriculum:", error);
    }
  };

  const handleAddLevel = () => {
    const newLevel: Level = {
      id: Date.now().toString(),
      title: `Level ${levels.length + 1}: New Level`,
      status: 'draft',
      modules: [],
      isExpanded: true,
    };
    const newLevels = [...levels, newLevel];
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const handleAddModule = (levelId: string) => {
    const newLevels = levels.map(level => {
      if (level.id === levelId) {
        const newModule: Module = {
          id: Date.now().toString(),
          title: `Module ${level.modules.length + 1}: New Module`,
          lessons: [],
          isExpanded: true,
        };
        return { ...level, modules: [...level.modules, newModule], isExpanded: true };
      }
      return level;
    });
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const handleAddLesson = (levelId: string, moduleId: string) => {
    const newLevels = levels.map(level => {
      if (level.id === levelId) {
        const newModules = level.modules.map(mod => {
          if (mod.id === moduleId) {
            const newLesson: Lesson = {
              id: Date.now().toString(),
              title: 'New Lesson',
              type: 'document',
            };
            return { ...mod, lessons: [...mod.lessons, newLesson] };
          }
          return mod;
        });
        return { ...level, modules: newModules };
      }
      return level;
    });
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const updateLevelTitle = (levelId: string, newTitle: string) => {
    const newLevels = levels.map(l => l.id === levelId ? { ...l, title: newTitle } : l);
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const updateModuleTitle = (levelId: string, moduleId: string, newTitle: string) => {
    const newLevels = levels.map(l => {
      if (l.id === levelId) {
        return {
          ...l,
          modules: l.modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m)
        };
      }
      return l;
    });
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const updateLessonTitle = (levelId: string, moduleId: string, lessonId: string, newTitle: string) => {
    const newLevels = levels.map(l => {
      if (l.id === levelId) {
        return {
          ...l,
          modules: l.modules.map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                lessons: m.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson)
              };
            }
            return m;
          })
        };
      }
      return l;
    });
    setLevels(newLevels);
    saveCurriculum(newLevels);
  };

  const toggleLevel = (levelId: string) => {
    setLevels(levels.map(l => l.id === levelId ? { ...l, isExpanded: !l.isExpanded } : l));
  };

  const toggleModule = (levelId: string, moduleId: string) => {
    setLevels(levels.map(l => {
      if (l.id === levelId) {
        return {
          ...l,
          modules: l.modules.map(m => m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m)
        };
      }
      return l;
    }));
  };

  if (isLoading) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f9fa] dark:bg-[#1a1d27]">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8f9fa] dark:bg-[#1a1d27]">
      {/* Header */}
      <div className="bg-white dark:bg-[#252a36] px-4 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full mr-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Course Editor
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#d4a017] hover:text-[#b8860b] transition-colors">
            <Bell size={20} fill="currentColor" />
          </button>
          <div className="w-8 h-8 rounded-md bg-[#f3d5b5] overflow-hidden border border-gray-200 flex items-center justify-center">
            <div className="w-3 h-4 bg-white/50 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-6">
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase mb-2">Editing Curriculum</h2>
            <h1 className="text-3xl font-bold text-[#001f3f] dark:text-white">{courseTitle}</h1>
          </div>

          <button 
            onClick={handleAddLevel}
            className="mb-8 px-5 py-2.5 bg-[#d4a017] hover:bg-[#b8860b] text-gray-900 rounded-md font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Level
          </button>

          <div className="space-y-6">
            {levels.map((level) => (
              <div key={level.id} className="bg-white dark:bg-[#252a36] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Level Header */}
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleLevel(level.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={level.status === 'published' ? "text-[#d4a017]" : "text-gray-400"}>
                      <Layers size={24} fill="currentColor" className="opacity-80" />
                    </div>
                    <input 
                      type="text"
                      value={level.title}
                      onChange={(e) => updateLevelTitle(level.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg font-bold text-[#001f3f] dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                      placeholder="Level Title"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {level.status === 'draft' && (
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold tracking-wider rounded-md">DRAFT</span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                      {level.isExpanded !== false ? <MoreVertical size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Level Content (Modules) */}
                {level.isExpanded !== false && (
                  <div className="px-5 pb-6 pt-0">
                    <div className="pl-6 border-l-2 border-gray-100 dark:border-gray-800 space-y-6 ml-3">
                      
                      {level.modules.map((module) => (
                        <div key={module.id} className="pt-2">
                          {/* Module Header */}
                          <div 
                            className="flex items-center justify-between cursor-pointer group mb-4"
                            onClick={() => toggleModule(level.id, module.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Folder size={18} className="text-[#001f3f] dark:text-gray-300" fill="currentColor" />
                              <input 
                                type="text"
                                value={module.title}
                                onChange={(e) => updateModuleTitle(level.id, module.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-[#001f3f] dark:text-white text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                placeholder="Module Title"
                              />
                            </div>
                            <button className="text-gray-400">
                              {module.isExpanded !== false ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </div>

                          {/* Module Content (Lessons) */}
                          {module.isExpanded !== false && (
                            <div className="space-y-3 pl-2">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="bg-[#f8f9fa] dark:bg-[#1a1d27] rounded-lg p-4 flex items-center gap-4">
                                  <div className="text-[#d4a017]">
                                    {lesson.type === 'document' ? <FileText size={18} fill="currentColor" className="text-[#d4a017]" /> : <PlayCircle size={18} fill="currentColor" className="text-[#d4a017]" />}
                                  </div>
                                  <input 
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => updateLessonTitle(level.id, module.id, lesson.id, e.target.value)}
                                    className="text-gray-800 dark:text-gray-200 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                    placeholder="Lesson Title"
                                  />
                                </div>
                              ))}
                              
                              <button 
                                onClick={() => handleAddLesson(level.id, module.id)}
                                className="w-full py-3.5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 font-bold text-[11px] tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                              >
                                <div className="bg-gray-400 text-white rounded-full p-0.5">
                                  <Plus size={12} strokeWidth={3} />
                                </div>
                                ADD LESSON
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="pt-2">
                        <button 
                          onClick={() => handleAddModule(level.id)}
                          className="text-[#d4a017] font-bold text-[11px] tracking-wider flex items-center gap-2 hover:text-[#b8860b] transition-colors uppercase"
                        >
                          <div className="relative">
                            <Folder size={16} className="text-[#d4a017]" fill="currentColor" />
                            <div className="absolute -top-1 -right-1.5 bg-white dark:bg-[#252a36] rounded-full">
                              <Plus size={10} className="text-[#d4a017]" strokeWidth={4} />
                            </div>
                          </div>
                          ADD MODULE
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminCurriculumEditor;
