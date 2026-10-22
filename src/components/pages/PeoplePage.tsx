import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { StorageService } from '../../services/storage';
import { UserLeaderboardItem } from '../../types';
import { TrendUpIcon, TrendDownIcon } from '../Icons';
import { Search, Plus, Trash2, Mail, Building2, X } from 'lucide-react';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<UserLeaderboardItem[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Operations Specialist');
  const [department, setDepartment] = useState('Engineering');
  const [points, setPoints] = useState(120);

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const loadPeople = () => {
    setPeople(StorageService.getPeople());
  };

  useEffect(() => {
    loadPeople();
    const handleUpdate = () => loadPeople();
    window.addEventListener('tesla_storage_updated', handleUpdate);
    return () => window.removeEventListener('tesla_storage_updated', handleUpdate);
  }, []);

  const departments = ['All', 'Engineering', 'Product Quality', 'Sales & Ops', 'Production', 'Field Operations', 'Safety & Compliance'];

  const filteredPeople = people.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
      (p.role && p.role.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      departmentFilter === 'All' || p.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // GSAP table rows staggered entrance
  useGSAP(
    () => {
      if (tableBodyRef.current) {
        gsap.fromTo(
          tableBodyRef.current.children,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            duration: 0.35,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: tableBodyRef, dependencies: [departmentFilter, filteredPeople.length] }
  );

  const handleRowHover = (e: React.MouseEvent<HTMLTableRowElement>, enter: boolean) => {
    const row = e.currentTarget;
    const avatar = row.querySelector('.employee-avatar');

    gsap.to(row, {
      backgroundColor: enter ? 'rgba(249, 250, 252, 0.95)' : 'transparent',
      duration: 0.2,
      ease: 'power2.out',
    });

    if (avatar) {
      gsap.to(avatar, {
        scale: enter ? 1.1 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    StorageService.addPerson({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role,
      department,
      points: Number(points) || 100,
      accuracy: 94,
      trend: 'up',
      completedQuizzes: 4,
      status: 'active',
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
  };

  const handleDelete = (idOrName: string) => {
    if (confirm(`Remove ${idOrName} from localhost roster?`)) {
      StorageService.deletePerson(idOrName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#151E23] tracking-tight">
            Workforce Directory ({people.length} Members)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage enrolled staff, performance badges, and assignments. All modifications sync directly to Localhost.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#EFF0F6] text-xs focus:outline-none focus:border-[#1B59F8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-[#1B59F8] text-white'
                  : 'bg-white border border-[#EFF0F6] text-gray-600 hover:text-gray-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* People Table Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-[#EFF0F6] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Rank &amp; Employee</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Points</th>
                <th className="py-3.5 px-6">Accuracy</th>
                <th className="py-3.5 px-6">Trend</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="divide-y divide-[#EFF0F6]/60">
              {filteredPeople.map((person) => (
                <tr
                  key={person.id || person.name}
                  onMouseEnter={(e) => handleRowHover(e, true)}
                  onMouseLeave={(e) => handleRowHover(e, false)}
                  className="transition-colors group cursor-default"
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-bold text-gray-400">
                        #{person.rank}
                      </span>
                      <img
                        src={person.avatarUrl}
                        alt={person.name}
                        className="employee-avatar w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            person.name
                          )}&background=EFF0F6&color=151E23&bold=true`;
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-[#1B59F8] transition-colors">
                          {person.name}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>
                            {person.email ||
                              `${person.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>{person.department || 'Engineering'}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {person.role || 'Staff Member'}
                    </div>
                  </td>

                  <td className="py-3 px-6 font-semibold text-gray-900">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1B59F8] font-bold">
                      {person.points} pts
                    </span>
                  </td>

                  <td className="py-3 px-6 font-semibold text-gray-900">
                    {person.accuracy ? `${person.accuracy}%` : '85%'}
                  </td>

                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      {person.trend === 'up' ? (
                        <>
                          <TrendUpIcon className="w-3 h-3 text-[#1FE08F]" />
                          <span className="text-[11px] font-semibold text-emerald-600">
                            Rising
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendDownIcon className="w-3 h-3 text-[#FF3E13]" />
                          <span className="text-[11px] font-semibold text-rose-600">
                            Drop
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => handleDelete(person.id || person.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Person Modal */}
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
                  Add Employee to Localhost Roster
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPerson} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="jordan.vance@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    >
                      {departments.filter((d) => d !== 'All').map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Starting Points
                    </label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
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
                    Save Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
