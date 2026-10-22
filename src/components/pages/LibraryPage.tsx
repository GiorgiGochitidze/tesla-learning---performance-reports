import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import { StorageService } from '../../services/storage';
import { CourseItem } from '../../types';
import {
  Search,
  Plus,
  Play,
  Clock,
  BookOpen,
  Trash2,
  X,
  Award,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeQuizCourse, setActiveQuizCourse] = useState<CourseItem | null>(null);

  // New course form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Workplace Safety');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('20 min');
  const [newQuestions, setNewQuestions] = useState(30);
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newPassingGrade, setNewPassingGrade] = useState(80);

  // Quiz simulation state
  const [quizStep, setQuizStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const quizCelebrationRef = useRef<HTMLDivElement>(null);

  const loadCourses = () => {
    setCourses(StorageService.getCourses());
  };

  useEffect(() => {
    loadCourses();
    const handleUpdate = () => loadCourses();
    window.addEventListener('tesla_storage_updated', handleUpdate);
    return () => window.removeEventListener('tesla_storage_updated', handleUpdate);
  }, []);

  const categories = ['All', 'Workplace Safety', 'Regulatory', 'IT & Infrastructure', 'Health & Safety', 'Corporate Policy'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stagger entrance of courses
  useGSAP(
    () => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 20, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.45,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: gridRef, dependencies: [selectedCategory, filteredCourses.length] }
  );

  // Celebratory GSAP score animation when quiz finishes
  useEffect(() => {
    if (quizScore !== null && quizCelebrationRef.current) {
      gsap.fromTo(
        quizCelebrationRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }, [quizScore]);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      y: enter ? -5 : 0,
      scale: enter ? 1.015 : 1,
      borderColor: enter ? '#D3E0FD' : '#EFF0F6',
      boxShadow: enter
        ? '0 12px 24px -4px rgba(27, 89, 248, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
        : '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    StorageService.addCourse({
      title: newTitle,
      category: newCategory,
      description: newDescription || 'Standard operating and evaluation module.',
      duration: newDuration,
      questionsCount: Number(newQuestions) || 25,
      difficulty: newDifficulty,
      passingGrade: Number(newPassingGrade) || 80,
      imageUrl: '/images/Rectangle_2370_49x32.png',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this course from localhost?')) {
      StorageService.deleteCourse(id);
    }
  };

  // Start Quiz simulation
  const sampleQuestions = [
    {
      q: 'What is the required reaction time when detecting an emergency containment alarm?',
      options: ['Within 60 seconds', 'Immediate evacuation & signal protocol', 'Wait for shift supervisor review', 'Document in daily shift log'],
      correct: 1,
    },
    {
      q: 'Which authentication standard is enforced across high-voltage workstation terminals?',
      options: ['Single-factor badge tap', 'Zero-Trust MFA with hardware security token', 'Shared supervisor master key', 'Biometric only'],
      correct: 1,
    },
    {
      q: 'What is the minimum passing score required to maintain active certified status?',
      options: ['50%', '65%', '80%', '95%'],
      correct: 2,
    },
  ];

  const handleStartQuiz = (course: CourseItem) => {
    setActiveQuizCourse(course);
    setQuizStep(0);
    setUserAnswers([]);
    setQuizScore(null);
  };

  const handleSelectOption = (idx: number) => {
    const nextAnswers = [...userAnswers, idx];
    setUserAnswers(nextAnswers);

    if (quizStep < sampleQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Finished: calculate score
      let correctCount = 0;
      nextAnswers.forEach((ans, i) => {
        if (ans === sampleQuestions[i].correct) correctCount++;
      });
      const finalScore = Math.round((correctCount / sampleQuestions.length) * 100);
      setQuizScore(finalScore);

      // Save to localhost activities!
      const currentUser = StorageService.getCurrentUser();
      StorageService.logActivity({
        id: 'act-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarUrl,
        topicTitle: activeQuizCourse?.title || 'Knowledge Assessment',
        action: 'completed_quiz',
        score: finalScore,
        status: 'Completed',
        timestamp: new Date().toISOString(),
        formattedTime: 'Just now',
      });

      // Update onboarding task 3
      StorageService.completeOnboardingTask('task-3');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#151E23] tracking-tight">
            Training &amp; Assessment Library
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse corporate courses, take micro-quizzes, and manage custom modules saved to Localhost.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#EFF0F6] text-xs focus:outline-none focus:border-[#1B59F8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1B59F8] text-white'
                  : 'bg-white border border-[#EFF0F6] text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid with GSAP entrance & hover */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            className="bg-white border border-[#EFF0F6] rounded-[20px] p-5 shadow-2xs transition-colors flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B59F8]">
                  {course.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-gray-400">
                    {course.difficulty}
                  </span>
                  <button
                    onClick={(e) => handleDeleteCourse(course.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded-md"
                    title="Delete course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#151E23] mb-2 group-hover:text-[#1B59F8] transition-colors">
                {course.title}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                {course.description}
              </p>
            </div>

            <div>
              {/* Meta stats */}
              <div className="flex items-center justify-between text-xs text-gray-400 py-3 border-t border-[#EFF0F6]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  {course.questionsCount} questions
                </span>
                <span className="font-semibold text-gray-700">
                  Pass: {course.passingGrade}%
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartQuiz(course)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-[#1B59F8] text-gray-700 hover:text-white text-xs font-semibold transition-all cursor-pointer group-hover:bg-[#1B59F8] group-hover:text-white"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Take Quick Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#EFF0F6] z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EFF0F6] pb-3">
                <h3 className="text-base font-bold text-[#151E23]">
                  Add Course to Localhost
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Voltage Battery Assembly"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short course description..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Questions
                    </label>
                    <input
                      type="number"
                      value={newQuestions}
                      onChange={(e) => setNewQuestions(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFF0F6]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1B59F8] text-white font-semibold shadow-xs"
                  >
                    Save Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuizCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQuizCourse(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#EFF0F6] z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#EFF0F6] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#151E23]">
                    {activeQuizCourse.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Interactive Knowledge Check (Saved to Localhost)
                  </span>
                </div>
                <button
                  onClick={() => setActiveQuizCourse(null)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {quizScore === null ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Question {quizStep + 1} of {sampleQuestions.length}
                    </span>
                    <span>30 points available</span>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                    {sampleQuestions[quizStep].q}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {sampleQuestions[quizStep].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#1B59F8] hover:bg-blue-50/40 text-xs text-gray-800 transition-all cursor-pointer font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div ref={quizCelebrationRef} className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Quiz Completed!
                  </h4>
                  <div className="text-3xl font-extrabold text-[#1B59F8]">
                    {quizScore}% Score
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Your assessment results have been logged to the Localhost Activities audit trail and reflected in your knowledge scores.
                  </p>
                  <button
                    onClick={() => setActiveQuizCourse(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#1B59F8] text-white text-xs font-semibold shadow-xs"
                  >
                    Done &amp; Return to Library
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
