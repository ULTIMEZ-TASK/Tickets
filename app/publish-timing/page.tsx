'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';

// --- Types ---
type PublishOption = 'draft' | 'publish-now' | 'schedule' | 'schedule-repeated';
type RepeatType = 'Daily' | 'Weekly' | 'Monthly' | 'AllIndianFestivals' | 'AllInternationalDays';

export default function PublishTimingPage() {
  // State for form visibility logic
  const [publishOption, setPublishOption] = useState<PublishOption>('schedule');
  const [repeatType, setRepeatType] = useState<RepeatType>('Daily');
  
  // State for dynamic fields
  const [dailyTimes, setDailyTimes] = useState<string[]>(['12:00 PM']);
  const [weeklyTimes, setWeeklyTimes] = useState<string[]>(['11:00 AM']);
  
  // Helper to add/remove time slots
  const addTimeSlot = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '12:00 PM']);
  };
  
  const removeTimeSlot = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Form Submitted as: ${publishOption}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] p-6 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Publish Timing</h2>

          {/* --- Radio Options --- */}
          <div className="space-y-4 mb-6">
            {[
              { id: 'draft', label: 'Draft', sub: 'Save for now' },
              { id: 'publish-now', label: 'Publish Now', sub: 'Post right away' },
              { id: 'schedule', label: 'Schedule for later', sub: 'Pick date and time to publish once automatically' },
              { id: 'schedule-repeated', label: 'Schedule Repeated Post', sub: 'Set up a recurring schedule' },
            ].map((opt) => (
              <div key={opt.id} className="flex items-start space-x-3">
                <input
                  id={opt.id}
                  type="radio"
                  name="publish-option"
                  value={opt.id}
                  checked={publishOption === opt.id}
                  onChange={(e) => setPublishOption(e.target.value as PublishOption)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor={opt.id} className="text-base font-medium text-gray-800 block cursor-pointer">
                    {opt.label}
                  </label>
                  <p className="text-sm text-gray-600">{opt.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* --- Schedule Single Post Logic --- */}
          {publishOption === 'schedule' && (
            <div className="pl-7 mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="mm/dd/yyyy" className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm pr-10 focus:border-blue-500 outline-none" required />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="12:00 AM" className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm pr-10 focus:border-blue-500 outline-none" required />
                  <Clock className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          )}

          {/* --- Schedule Repeated Post Logic --- */}
          {publishOption === 'schedule-repeated' && (
            <div className="pl-7 mb-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Configure Recurring Schedule</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Repeat Type</label>
                <select 
                  value={repeatType} 
                  onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                  className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="AllIndianFestivals">All Indian Festivals</option>
                  <option value="AllInternationalDays">All International Days</option>
                </select>
              </div>

              {/* Dynamic Sub-Sections based on Repeat Type */}
              
              {/* 1. DAILY */}
              {repeatType === 'Daily' && (
                <div className="space-y-4">
                   <p className="text-sm text-gray-600">Set start date and daily time(s).</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative">
                           <input type="text" placeholder="mm/dd/yyyy" className="block w-full rounded-lg border-gray-300 border p-2.5 text-sm pr-10" />
                           <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        </div>
                      </div>
                   </div>
                   {/* Dynamic Time Slots */}
                   {dailyTimes.map((time, idx) => (
                     <div key={idx} className="flex items-end gap-2">
                        <div className="flex-grow relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot {idx + 1}</label>
                          <input type="text" defaultValue={time} className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm pr-10" />
                          <Clock className="absolute right-3 top-9 text-gray-400" size={18} />
                        </div>
                        {idx > 0 && (
                          <button type="button" onClick={() => removeTimeSlot(idx, setDailyTimes)} className="p-2 text-gray-400 hover:text-red-500 mb-1">
                            <Trash2 size={18} />
                          </button>
                        )}
                     </div>
                   ))}
                   <button type="button" onClick={() => addTimeSlot(setDailyTimes)} className="text-sm text-red-600 font-medium flex items-center gap-1 mt-2">
                     <Plus size={16} /> Add Daily Time Slot
                   </button>
                </div>
              )}

              {/* 2. WEEKLY */}
              {repeatType === 'Weekly' && (
                 <div className="space-y-4">
                    {weeklyTimes.map((time, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Days</label>
                            <select multiple className="block w-full rounded-lg border border-gray-300 p-2 text-sm h-24">
                              <option>Monday</option>
                              <option>Tuesday</option>
                              <option>Wednesday</option>
                              <option>Thursday</option>
                              <option>Friday</option>
                              <option>Saturday</option>
                              <option>Sunday</option>
                            </select>
                         </div>
                         <div className="flex items-end gap-2">
                            <div className="relative flex-grow">
                               <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                               <input type="text" defaultValue={time} className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm pr-10" />
                               <Clock className="absolute right-3 top-9 text-gray-400" size={18} />
                            </div>
                            {idx > 0 && (
                              <button type="button" onClick={() => removeTimeSlot(idx, setWeeklyTimes)} className="p-2 text-gray-400 hover:text-red-500 mb-1">
                                <Trash2 size={18} />
                              </button>
                            )}
                         </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addTimeSlot(setWeeklyTimes)} className="text-sm text-red-600 font-medium flex items-center gap-1">
                     <Plus size={16} /> Add More Time
                   </button>
                 </div>
              )}

              {/* 3. OTHERS (Monthly / Festivals) - Simplified for brevity */}
              {(repeatType === 'Monthly' || repeatType.includes('All')) && (
                 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-600 mt-2">
                    Configuration for <strong>{repeatType}</strong> is active.
                 </div>
              )}

            </div>
          )}

          {/* --- Submit Button --- */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              className={`w-full px-6 py-2 text-white rounded-lg transition duration-150 shadow-md ${
                publishOption === 'draft' ? 'bg-gray-500 hover:bg-gray-600' :
                publishOption === 'schedule-repeated' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {publishOption === 'draft' ? 'Save Draft' : 
               publishOption === 'schedule-repeated' ? 'Schedule Recurring' : 'Submit Post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}