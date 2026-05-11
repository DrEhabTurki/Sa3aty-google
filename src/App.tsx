import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  BarChart3, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Download,
  XCircle,
  ChevronRight,
  UserPlus,
  Globe,
  Edit2,
  Briefcase,
  FileText,
  Palette,
  Settings,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

type Language = 'ar' | 'en';

interface Translations {
  appName: string;
  activeEmployees: string;
  totalHours: string;
  newRecord: string;
  employeeName: string;
  employeePlaceholder: string;
  date: string;
  checkIn: string;
  checkOut: string;
  saveRecord: string;
  monthlyReport: string;
  thisMonth: string;
  noDataMonth: string;
  fullHistory: string;
  deleteAll: string;
  searchPlaceholder: string;
  noHistory: string;
  manageEmployees: string;
  addEmployee: string;
  editEmployee: string;
  employeeList: string;
  noEmployees: string;
  allEmployees: string;
  selectMonth: string;
  exportReport: string;
  addTab: string;
  reportTab: string;
  historyTab: string;
  employeesTab: string;
  successSave: string;
  successDelete: string;
  errorFill: string;
  confirmDelete: string;
  confirmClear: string;
  cancel: string;
  update: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    appName: 'ساعاتي',
    activeEmployees: 'موظفين نشيطين',
    totalHours: 'إجمالي الساعات',
    newRecord: 'تسجيل جديد',
    employeeName: 'اسم الموظف',
    employeePlaceholder: 'من الموظف؟',
    date: 'التاريخ',
    checkIn: 'الحضور',
    checkOut: 'الانصراف',
    saveRecord: 'إضافة السجل',
    monthlyReport: 'تقرير السجل',
    thisMonth: 'ساعات العمل',
    noDataMonth: 'لا يوجد بيانات لهذه التصفية',
    fullHistory: 'السجل الكامل',
    deleteAll: 'حذف الكل',
    searchPlaceholder: 'ابحث عن موظف...',
    noHistory: 'السجل فارغ',
    manageEmployees: 'إدارة الموظفين',
    addEmployee: 'إضافة موظف',
    editEmployee: 'تعديل موظف',
    employeeList: 'قائمة الموظفين',
    noEmployees: 'لا يوجد موظفين مضافين',
    allEmployees: 'الكل',
    selectMonth: 'اختر الشهر',
    exportReport: 'تصدير التقرير',
    addTab: 'إضافة',
    reportTab: 'تقرير',
    historyTab: 'السجل',
    employeesTab: 'الموظفين',
    successSave: 'تم الحفظ بنجاح',
    successDelete: 'تم الحذف بنجاح',
    errorFill: 'يرجى ملء جميع الحقول',
    confirmDelete: 'هل أنت متأكد؟',
    confirmClear: 'سيتم مسح جميع البيانات نهائياً؟',
    cancel: 'إلغاء',
    update: 'تحديث'
  },
  en: {
    appName: 'Sa3aty',
    activeEmployees: 'Active Employees',
    totalHours: 'Total Hours',
    newRecord: 'New Entry',
    employeeName: 'Employee Name',
    employeePlaceholder: 'Who is the employee?',
    date: 'Date',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    saveRecord: 'Add Record',
    monthlyReport: 'Report Analysis',
    thisMonth: 'Total Hours',
    noDataMonth: 'No data for this filter',
    fullHistory: 'Full History',
    deleteAll: 'Clear All',
    searchPlaceholder: 'Search employee...',
    noHistory: 'History is empty',
    manageEmployees: 'Staff Management',
    addEmployee: 'Add Staff',
    editEmployee: 'Edit Staff',
    employeeList: 'Staff Directory',
    noEmployees: 'No staff added',
    allEmployees: 'All',
    selectMonth: 'Select Month',
    exportReport: 'Export Report',
    addTab: 'Add',
    reportTab: 'Report',
    historyTab: 'History',
    employeesTab: 'Staff',
    successSave: 'Saved successfully',
    successDelete: 'Deleted successfully',
    errorFill: 'Please fill all fields',
    confirmDelete: 'Are you sure?',
    confirmClear: 'Clear all data permanently?',
    cancel: 'Cancel',
    update: 'Update'
  }
};

interface Employee {
  id: string;
  name: string;
  role?: string;
  createdAt: string;
}

interface WorkEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
}

interface MonthlySummary {
  [name: string]: number;
}

type ThemeType = 'classic' | 'midnight' | 'silver' | 'emerald' | 'cyber' | 'rose';

interface ThemeConfig {
  name: string;
  nameAr: string;
  id: ThemeType;
  primary: string;
  dark: string;
  bg: string;
  card: string;
  text: string;
  glass: string;
  shadow: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
  classic: {
    name: 'Classic Gold',
    nameAr: 'الذهبي الكلاسيكي',
    id: 'classic',
    primary: '#C5A059',
    dark: '#8E6E37',
    bg: '#fbfbfd',
    card: '#ffffff',
    text: '#1d1d1f',
    glass: 'rgba(255, 255, 255, 0.72)',
    shadow: 'rgba(0, 0, 0, 0.05)'
  },
  midnight: {
    name: 'Midnight Pro',
    nameAr: 'منتصف الليل',
    id: 'midnight',
    primary: '#3a3a3c',
    dark: '#1c1c1e',
    bg: '#000000',
    card: '#1c1c1e',
    text: '#f5f5f7',
    glass: 'rgba(28, 28, 30, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.5)'
  },
  silver: {
    name: 'Silver Titanium',
    nameAr: 'تيتانيوم فضي',
    id: 'silver',
    primary: '#8e8e93',
    dark: '#636366',
    bg: '#f2f2f7',
    card: '#ffffff',
    text: '#1d1d1f',
    glass: 'rgba(242, 242, 247, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.03)'
  },
  emerald: {
    name: 'Emerald Regal',
    nameAr: 'الزمرد الملكي',
    id: 'emerald',
    primary: '#064e3b',
    dark: '#065f46',
    bg: '#f0fdf4',
    card: '#ffffff',
    text: '#064e3b',
    glass: 'rgba(255, 255, 255, 0.7)',
    shadow: 'rgba(6, 78, 59, 0.1)'
  },
  cyber: {
    name: 'Cyber Future',
    nameAr: 'سايبر فيوتشر',
    id: 'cyber',
    primary: '#007aff',
    dark: '#5856d6',
    bg: '#0a0a0a',
    card: '#161616',
    text: '#ffffff',
    glass: 'rgba(22, 22, 22, 0.8)',
    shadow: 'rgba(0, 122, 255, 0.3)'
  },
  rose: {
    name: 'Rose Copper',
    nameAr: 'النحاس الوردي',
    id: 'rose',
    primary: '#e19488',
    dark: '#b56e63',
    bg: '#fff9f8',
    card: '#ffffff',
    text: '#4a3735',
    glass: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(181, 110, 99, 0.15)'
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [themeId, setThemeId] = useState<ThemeType>('classic');
  const [prevLightTheme, setPrevLightTheme] = useState<ThemeType>('classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'report' | 'history' | 'employees'>('add');
  
  // Form State
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIn, setCheckIn] = useState('08:00');
  const [checkOut, setCheckOut] = useState('16:00');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportEmployeeId, setReportEmployeeId] = useState('all');
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Employee management state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeNameInput, setEmployeeNameInput] = useState('');
  const [employeeRoleInput, setEmployeeRoleInput] = useState('');

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    const saved = localStorage.getItem('workEntries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved entries', e);
      }
    }
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (e) {
        console.error('Failed to parse saved employees', e);
      }
    }
    const savedLang = localStorage.getItem('appLang') as Language;
    if (savedLang) setLang(savedLang);
    
    const savedTheme = localStorage.getItem('appTheme') as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setThemeId(savedTheme);
      if (savedTheme !== 'midnight' && savedTheme !== 'cyber') {
        setPrevLightTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    const currentTheme = themes[themeId];
    if (themeId !== 'midnight' && themeId !== 'cyber') {
      setPrevLightTheme(themeId);
    }
    const root = document.documentElement;
    root.style.setProperty('--premium-primary', currentTheme.primary);
    root.style.setProperty('--premium-dark', currentTheme.dark);
    root.style.setProperty('--app-bg', currentTheme.bg);
    root.style.setProperty('--app-card', currentTheme.card);
    root.style.setProperty('--app-text', currentTheme.text);
    root.style.setProperty('--app-glass', currentTheme.glass);
    root.style.setProperty('--tw-shadow-color', currentTheme.shadow);
    localStorage.setItem('appTheme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('workEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const calculateHours = (start: string, end: string): number => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (minutes < 0) minutes += 24 * 60;
    return Number((minutes / 60).toFixed(2));
  };

  // Helper to generate IDs that works everywhere
  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return Math.random().toString(36).substring(2, 11);
    }
  };

  const handleSaveEntry = () => {
    if (!selectedEmployeeId || !date || !checkIn || !checkOut) {
      showNotification('error', t.errorFill);
      return;
    }

    const employee = employees.find(e => e.id === selectedEmployeeId);
    if (!employee) return;

    const hours = calculateHours(checkIn, checkOut);
    
    if (editingEntryId) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntryId 
          ? { ...entry, employeeId: employee.id, employeeName: employee.name, date, checkIn, checkOut, hours }
          : entry
      ));
      setEditingEntryId(null);
      showNotification('success', t.successSave);
    } else {
      const newEntry: WorkEntry = {
        id: generateId(),
        employeeId: employee.id,
        employeeName: employee.name,
        date,
        checkIn,
        checkOut,
        hours
      };
      setEntries(prev => [newEntry, ...prev]);
      showNotification('success', t.successSave);
    }
    
    // Reset form
    setSelectedEmployeeId('');
    setDate(new Date().toISOString().split('T')[0]);
    setCheckIn('08:00');
    setCheckOut('16:00');
  };

  const startEditingEntry = (entry: WorkEntry) => {
    setEditingEntryId(entry.id);
    setSelectedEmployeeId(entry.employeeId);
    setDate(entry.date);
    setCheckIn(entry.checkIn);
    setCheckOut(entry.checkOut);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    if (themeId === 'midnight') {
      setThemeId(prevLightTheme);
    } else {
      setThemeId('midnight');
    }
  };

  const handleAddEmployee = () => {
    if (!employeeNameInput.trim()) {
      showNotification('error', t.errorFill);
      return;
    }

    if (editingEmployee) {
      setEmployees(prev => prev.map(e => 
        e.id === editingEmployee.id ? { ...e, name: employeeNameInput.trim(), role: employeeRoleInput.trim() } : e
      ));
      setEntries(prev => prev.map(entry => 
        entry.employeeId === editingEmployee.id ? { ...entry, employeeName: employeeNameInput.trim() } : entry
      ));
      setEditingEmployee(null);
    } else {
      const newEmployee: Employee = {
        id: generateId(),
        name: employeeNameInput.trim(),
        role: employeeRoleInput.trim(),
        createdAt: new Date().toISOString()
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    
    setEmployeeNameInput('');
    setEmployeeRoleInput('');
    showNotification('success', t.successSave);
  };

  const deleteEmployee = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      showNotification('success', t.successDelete);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteEntry = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const clearAllData = () => {
    if (confirm(t.confirmClear)) {
      setEntries([]);
      localStorage.removeItem('workEntries');
    }
  };

  const monthlySummary = useMemo(() => {
    const summary: MonthlySummary = {};
    entries.forEach(entry => {
      const matchMonth = entry.date.startsWith(reportMonth);
      const matchEmployee = reportEmployeeId === 'all' || entry.employeeId === reportEmployeeId;
      
      if (matchMonth && matchEmployee) {
        summary[entry.employeeName] = (summary[entry.employeeName] || 0) + entry.hours;
      }
    });
    return summary;
  }, [entries, reportMonth, reportEmployeeId]);

  const chartData = useMemo(() => {
    return Object.entries(monthlySummary).map(([name, hours]) => ({
      name: name.split(' ')[0], 
      fullName: name,
      hours: Number(hours.toFixed(2))
    })).sort((a, b) => b.hours - a.hours);
  }, [monthlySummary]);

  const currentMonthDisplay = useMemo(() => {
    const [year, month] = reportMonth.split('-');
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' }).format(new Date(parseInt(year), parseInt(month) - 1));
  }, [reportMonth, lang]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => 
      entry.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  const exportToCSV = () => {
    const headers = lang === 'ar' ? ['الموظف', 'التاريخ', 'الحضور', 'الانصراف', 'الساعات'] : ['Employee', 'Date', 'Check In', 'Check Out', 'Hours'];
    const rows = entries.map(e => [e.employeeName, e.date, e.checkIn, e.checkOut, e.hours]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `history_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const reportEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchMonth = entry.date.startsWith(reportMonth);
      const matchEmployee = reportEmployeeId === 'all' || entry.employeeId === reportEmployeeId;
      return matchMonth && matchEmployee;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, reportMonth, reportEmployeeId]);

  const exportReportToPDF = async () => {
    const [yearStr, monthStr] = reportMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1));
    
    const selectedEmp = employees.find(e => e.id === reportEmployeeId);
    const empName = selectedEmp ? selectedEmp.name : (lang === 'ar' ? 'جميع الموظفين' : 'All Staff');
    const totalHours = reportEntries.reduce((acc: number, curr) => acc + curr.hours, 0).toFixed(2);

    // Calculate days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Create a temporary container for the report
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.color = 'black';
    container.style.fontFamily = 'Arial, sans-serif';
    container.dir = 'ltr'; 

    container.innerHTML = `
      <div style="display: flex; justify-content: flex-start; align-items: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; background-color: #ffffff;">
        <div style="background-color: #333; color: white; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; margin-right: 20px;">S</div>
        <div>
          <h1 style="margin: 0; font-size: 28px; color: #000; font-weight: 900;">Sa3aty - ساعاتي</h1>
          <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Premium Time Management System</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #ffffff; color: #000;">
        <div style="width: 60%;">
          <h2 style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: #000; text-transform: uppercase;">Monthly Timesheet Record</h2>
          <div style="font-size: 14px; color: #000; line-height: 1.6;">
            <div><strong>Employee:</strong> ${empName}</div>
            <div><strong>Report Period:</strong> ${currentMonthName}</div>
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
        </div>
        <div style="background-color: #333; color: white; padding: 20px; border-radius: 12px; width: 150px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 11px; font-weight: 900; margin-bottom: 5px; opacity: 0.8;">TOTAL HOURS</div>
          <div style="font-size: 28px; font-weight: 900;">${totalHours} <span style="font-size: 14px;">H</span></div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; color: #000; background-color: #ffffff;">
        <thead>
          <tr style="background-color: #4a4a4a; color: #ffffff;">
            <th style="padding: 12px 8px; border: 1px solid #333; text-align: left; font-weight: 900; text-transform: uppercase; vertical-align: middle;">Date</th>
            <th style="padding: 12px 8px; border: 1px solid #333; text-align: left; font-weight: 900; text-transform: uppercase; vertical-align: middle;">Day</th>
            <th style="padding: 12px 8px; border: 1px solid #333; text-align: center; font-weight: 900; text-transform: uppercase; vertical-align: middle;">Check In</th>
            <th style="padding: 12px 8px; border: 1px solid #333; text-align: center; font-weight: 900; text-transform: uppercase; vertical-align: middle;">Check Out</th>
            <th style="padding: 12px 8px; border: 1px solid #333; text-align: right; font-weight: 900; text-transform: uppercase; vertical-align: middle;">Daily Total</th>
          </tr>
        </thead>
        <tbody>
          ${allDays.map(dayNum => {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const entry = reportEntries.find(e => e.date === dateStr);
            const dateObj = new Date(year, month - 1, dayNum);
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);
            const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';

            return `
              <tr style="border-bottom: 1px solid #ddd; ${isWeekend ? 'background-color: #f9f9f9;' : ''}">
                <td style="padding: 10px 8px; border: 1px solid #ddd; vertical-align: middle;">${dateStr}</td>
                <td style="padding: 10px 8px; border: 1px solid #ddd; vertical-align: middle; ${isWeekend ? 'color: #999;' : ''}">${dayName}</td>
                <td style="padding: 10px 8px; border: 1px solid #ddd; text-align: center; vertical-align: middle;">${entry ? entry.checkIn : '-'}</td>
                <td style="padding: 10px 8px; border: 1px solid #ddd; text-align: center; vertical-align: middle;">${entry ? entry.checkOut : '-'}</td>
                <td style="padding: 10px 8px; border: 1px solid #ddd; text-align: right; font-weight: 700; vertical-align: middle; ${entry ? 'color: #000;' : 'color: #ccc;'}">
                  ${entry ? entry.hours.toFixed(2) + ' hrs' : '0.00'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 11px; color: #666; text-align: center;">
        Sa3aty Premium Management | Authorized Time Record | Generated ${new Date().toLocaleString()}
      </div>
    `;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Report_${empName.replace(/ /g, '_')}_${reportMonth}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(container);
    }
  };

  const exportReportToCSV = () => {
    const headers = lang === 'ar' ? ['الموظف', 'الشهر', 'إجمالي الساعات'] : ['Employee', 'Month', 'Total Hours'];
    const rows = (Object.entries(monthlySummary)).map(([name, total]) => [name, reportMonth, total]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${reportMonth}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans pb-32 selection:bg-premium/20 antialiased overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-10 h-10 bg-premium rounded-xl flex items-center justify-center shadow-lg shadow-premium/20 overflow-hidden transition-colors duration-500">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const icon = document.createElement('div');
                      icon.className = 'fallback-icon relative z-10';
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-app-text leading-none mb-0.5">{t.appName}</h1>
                <p className="text-[9px] font-black text-premium tracking-[0.1em] uppercase">{lang === 'ar' ? 'الإصدار المتميز' : 'Premium Edition'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2.5 bg-premium/5 hover:bg-premium/10 text-premium rounded-full transition-all"
              title={themeId === 'midnight' ? 'Light Mode' : 'Dark Mode'}
            >
              {themeId === 'midnight' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="p-2.5 bg-premium/5 hover:bg-premium/10 text-premium rounded-full transition-all"
            >
              <Palette className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 p-2 px-3 bg-premium/5 text-premium rounded-full text-xs font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </motion.button>
          </div>
        </div>

        {/* Theme Selector Popover */}
        <AnimatePresence>
          {showThemeSelector && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mt-4 p-4 glass rounded-[2rem] border border-premium/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-xs font-black uppercase tracking-widest text-premium">{lang === 'ar' ? 'اختر المظهر' : 'CHOOSE THEME'}</span>
                <Sparkles className="w-4 h-4 text-premium" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(Object.values(themes) as ThemeConfig[]).map((theme) => (
                  <button 
                    key={theme.id}
                    onClick={() => {
                      setThemeId(theme.id);
                      setShowThemeSelector(false);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${themeId === theme.id ? 'border-premium bg-premium/10 scale-105' : 'border-premium/10 hover:border-premium/30 bg-white/50'}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})` }}
                    />
                    <span className="text-[9px] font-black tracking-tighter text-app-text whitespace-nowrap">{lang === 'ar' ? theme.nameAr : theme.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Stats (Apple Style) */}
      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-app-card p-5 rounded-[2rem] shadow-apple border border-premium/10 flex items-center gap-4 transition-all duration-500">
            <div className="w-12 h-12 bg-premium/10 text-premium rounded-2xl flex items-center justify-center transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-app-text/50 font-bold mb-0.5">{t.activeEmployees}</p>
              <p className="text-2xl font-black tracking-tight text-app-text">{Object.keys(monthlySummary).length}</p>
            </div>
          </div>
          <div className="bg-premium p-5 rounded-[2rem] text-white shadow-xl shadow-premium/20 flex items-center gap-4 border border-white/10 transition-all duration-500">
            <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-0.5">{t.totalHours}</p>
              <p className="text-2xl font-black tracking-tight">
                {(Object.values(monthlySummary) as number[]).reduce((a, b) => a + b, 0).toFixed(0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`mb-6 p-4 rounded-2xl shadow-xl backdrop-blur-xl flex items-center justify-center gap-3 ${
                notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}
            >
              <span className="text-sm font-bold tracking-tight">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'add' && (
            <motion.div 
              key="add"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              className="space-y-6"
            >
              <section className="bg-app-card/60 backdrop-blur-sm rounded-[2.5rem] p-8 border border-premium/10 shadow-apple space-y-6 transition-all duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-premium/10 text-premium rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-app-text">
                    {editingEntryId ? (lang === 'ar' ? 'تعديل السجل' : 'Edit Entry') : t.newRecord}
                  </h2>
                </div>

                <div className="space-y-4">
                  <InputGroup label={t.employeeName} icon={<Users className="w-4 h-4" />}>
                    {employees.length > 0 ? (
                      <select 
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className={`w-full bg-transparent text-lg font-medium border-none outline-none py-2 appearance-none transition-colors ${isRtl ? 'text-right' : 'text-left'} ${!selectedEmployeeId ? 'text-app-text/40' : 'text-app-text'}`}
                      >
                        <option value="" disabled>{t.employeePlaceholder}</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    ) : (
                      <button 
                        onClick={() => setActiveTab('employees')}
                        className={`w-full text-left py-2 text-rose-500 font-bold text-sm ${isRtl ? 'text-right' : 'text-left'}`}
                      >
                        + {t.addEmployee}
                      </button>
                    )}
                  </InputGroup>

                  <InputGroup label={t.date} icon={<Calendar className="w-4 h-4" />}>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full bg-transparent text-lg border-none outline-none py-2 text-app-text transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                  </InputGroup>

                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label={t.checkIn} icon={<Clock className="w-4 h-4" />}>
                      <input 
                        type="time" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-lg border-none outline-none py-2 text-app-text transition-colors"
                      />
                    </InputGroup>
                    <InputGroup label={t.checkOut} icon={<Clock className="w-4 h-4" />}>
                      <input 
                        type="time" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-lg border-none outline-none py-2 text-app-text transition-colors"
                      />
                    </InputGroup>
                  </div>

                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveEntry}
                      className="flex-1 bg-premium text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-premium/20 flex items-center justify-center gap-3 transition-all"
                    >
                      {editingEntryId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
                      {editingEntryId ? (lang === 'ar' ? 'تحديث السجل' : 'Update Entry') : t.saveRecord}
                    </motion.button>
                    {editingEntryId && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingEntryId(null);
                          setSelectedEmployeeId('');
                          setDate(new Date().toISOString().split('T')[0]);
                          setCheckIn('08:00');
                          setCheckOut('16:00');
                        }}
                        className="p-4 bg-app-text/10 text-app-text rounded-2xl font-bold"
                      >
                        {t.cancel}
                      </motion.button>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-app-text">{t.monthlyReport}</h2>
                <div className="flex items-center gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={exportReportToCSV}
                    className="p-2 bg-premium/5 text-premium rounded-xl hover:bg-premium/10 transition-all flex items-center gap-2 px-4 border border-premium/10"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-bold">CSV</span>
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={exportReportToPDF}
                    className="p-2 bg-premium text-white rounded-xl hover:shadow-lg shadow-premium/20 transition-all flex items-center gap-2 px-4 shadow-apple"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold">{t.exportReport} (PDF)</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-app-card p-3 rounded-2xl border border-premium/10 shadow-sm transition-all duration-500">
                  <p className="text-[10px] font-bold text-app-text/40 uppercase tracking-widest mb-1">{t.selectMonth}</p>
                  <input 
                    type="month" 
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className="w-full text-sm font-bold bg-transparent outline-none text-app-text transition-colors"
                  />
                </div>
                <div className="bg-app-card p-3 rounded-2xl border border-premium/10 shadow-sm transition-all duration-500">
                  <p className="text-[10px] font-bold text-app-text/40 uppercase tracking-widest mb-1">{t.employeeName}</p>
                  <select 
                    value={reportEmployeeId}
                    onChange={(e) => setReportEmployeeId(e.target.value)}
                    className="w-full text-sm font-bold bg-transparent outline-none appearance-none text-app-text transition-colors"
                  >
                    <option value="all">{t.allEmployees}</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {chartData.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-app-card p-6 rounded-[2.5rem] border border-premium/10 shadow-apple mb-6 h-64 transition-all duration-500 overflow-hidden"
                >
                  <p className="text-[10px] font-black text-premium uppercase tracking-[0.2em] mb-4 text-center">
                    {lang === 'ar' ? 'توزيع ساعات العمل' : 'HOURS DISTRIBUTION'}
                  </p>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: themes[themeId].text, fontWeight: 'bold' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: themes[themeId].text, opacity: 0.5 }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          backgroundColor: themes[themeId].card,
                          color: themes[themeId].text,
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Bar 
                        dataKey="hours" 
                        radius={[6, 6, 0, 0]} 
                        barSize={32}
                      >
                        {chartData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={themes[themeId].primary} fillOpacity={1 - (index * 0.15)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              <div className="space-y-4">
                {Object.keys(monthlySummary).length > 0 ? (
                  (Object.entries(monthlySummary) as [string, number][]).map(([name, total]) => (
                    <div key={name} className="bg-app-card p-5 rounded-[2rem] shadow-apple border border-premium/10 flex items-center justify-between transition-all duration-500">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-premium/5 rounded-2xl flex items-center justify-center border border-premium/10">
                          <span className="text-lg font-bold text-premium">{name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-app-text">{name}</p>
                          <p className="text-xs text-app-text/50 font-medium">{currentMonthDisplay}</p>
                        </div>
                      </div>
                      <div className={isRtl ? 'text-left' : 'text-right'}>
                        <span className="text-2xl font-black text-premium transition-colors">{total.toFixed(2)}</span>
                        <span className="text-[10px] text-app-text/50 font-bold mx-1 uppercase tracking-widest">H</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-app-card/40 rounded-[2.5rem] border border-dashed border-premium/20">
                    <p className="text-app-text/40 font-medium">{t.noDataMonth}</p>
                  </div>
                )}
              </div>

              {reportEntries.length > 0 && (
                <div className="mt-8 space-y-3">
                  <p className="text-[10px] font-black text-premium uppercase tracking-[0.2em] mb-4 text-center">
                    {lang === 'ar' ? 'سجلات الفترة المحددة' : 'PERIOD RECORDS'}
                  </p>
                  {reportEntries.map(entry => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-app-card p-4 rounded-[1.5rem] border border-premium/5 flex items-center justify-between hover:border-premium/20 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-premium/10 text-premium rounded-xl flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-app-text">{entry.employeeName}</p>
                          <p className="text-[10px] text-app-text/40 font-bold">{entry.date} • {entry.checkIn} - {entry.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="bg-premium/5 px-2 py-1 rounded-lg">
                          <span className="text-[10px] font-black text-premium">{entry.hours.toFixed(1)}h</span>
                        </div>
                        <button 
                          onClick={() => startEditingEntry(entry)}
                          className="p-2 text-app-text/40 hover:text-premium rounded-full hover:bg-premium/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 text-app-text/40 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-tight text-app-text">{t.fullHistory}</h2>
                <button 
                  onClick={clearAllData}
                  className="text-xs font-bold text-rose-500 underline"
                >
                  {t.deleteAll}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none`}>
                  <Users className="w-4 h-4 text-app-text/30" />
                </div>
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-app-card border border-premium/10 rounded-2xl py-4 shadow-sm outline-none focus:ring-2 focus:ring-premium/20 transition-all font-medium text-app-text ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                />
              </div>

              <div className="space-y-3 pb-8">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map(entry => (
                    <motion.div 
                      layout
                      key={entry.id} 
                      className="bg-app-card p-4 rounded-[1.5rem] border border-premium/10 flex items-center justify-between group shadow-apple transition-all duration-500"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-premium/5 border border-premium/10 rounded-xl flex items-center justify-center text-xs font-black text-premium transition-colors">
                          {entry.hours}h
                        </div>
                        <div>
                          <p className="font-bold text-sm text-app-text">{entry.employeeName}</p>
                          <p className="text-[10px] text-app-text/40 font-semibold">{entry.date} • {entry.checkIn} - {entry.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => startEditingEntry(entry)}
                          className="p-2 text-app-text/40 hover:text-premium rounded-full hover:bg-premium/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 text-app-text/40 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 text-app-text/30">
                    <p>{t.noHistory}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'employees' && (
            <motion.div 
              key="employees"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-app-text">
                  {editingEmployee ? t.editEmployee : t.manageEmployees}
                </h2>
                {!editingEmployee && (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const section = document.getElementById('employee-form');
                      if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3 bg-premium text-white rounded-2xl shadow-lg shadow-premium/20 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              <section id="employee-form" className="bg-app-card rounded-[2.5rem] p-8 border border-premium/10 shadow-apple space-y-6 relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Users className="w-24 h-24 text-premium" />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <p className="text-[10px] font-black text-app-text/40 uppercase tracking-widest mb-1.5 px-1">{t.employeeName}</p>
                      <div className="relative group">
                        <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none group-focus-within:text-premium transition-colors`}>
                          <Users className="w-4 h-4" />
                        </div>
                        <input 
                          type="text" 
                          value={employeeNameInput}
                          onChange={(e) => setEmployeeNameInput(e.target.value)}
                          placeholder={t.employeePlaceholder}
                          className={`w-full bg-premium/5 border border-premium/10 rounded-[1.25rem] py-4 shadow-sm outline-none focus:ring-2 focus:ring-premium/20 transition-all font-bold text-app-text ${isRtl ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'}`}
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <p className="text-[10px] font-black text-app-text/40 uppercase tracking-widest mb-1.5 px-1">{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</p>
                      <div className="relative group">
                        <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none group-focus-within:text-premium transition-colors`}>
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <input 
                          type="text" 
                          value={employeeRoleInput}
                          onChange={(e) => setEmployeeRoleInput(e.target.value)}
                          placeholder={lang === 'ar' ? 'الوظيفة...' : 'Role...'}
                          className={`w-full bg-premium/5 border border-premium/10 rounded-[1.25rem] py-4 shadow-sm outline-none focus:ring-2 focus:ring-premium/20 transition-all font-medium text-app-text ${isRtl ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'}`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddEmployee}
                      className="flex-1 bg-premium text-white py-4 rounded-[1.25rem] font-bold shadow-lg shadow-premium/20 flex items-center justify-center gap-2 group"
                    >
                      {editingEmployee ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                      <span className="text-sm">{editingEmployee ? (lang === 'ar' ? 'تحديث البيانات' : 'Update Staff') : (lang === 'ar' ? 'إضافة موظف جديد' : 'Add New Staff')}</span>
                    </motion.button>
                    
                    {editingEmployee && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingEmployee(null);
                          setEmployeeNameInput('');
                          setEmployeeRoleInput('');
                        }}
                        className="bg-premium/5 text-app-text/60 px-6 rounded-[1.25rem] font-bold text-sm"
                      >
                        {t.cancel}
                      </motion.button>
                    )}
                  </div>
                </div>
              </section>

              <div className="space-y-4 pb-8">
                <div className="flex items-center justify-between px-4">
                  <p className="text-[10px] font-black text-app-text/40 uppercase tracking-[0.2em]">{t.employeeList}</p>
                  <span className="bg-premium text-white text-[10px] font-black px-2.5 py-1 rounded-lg">{employees.length}</span>
                </div>
                {employees.length > 0 ? (
                  employees.map(emp => (
                    <motion.div 
                      layout
                      key={emp.id} 
                      className="bg-app-card p-5 rounded-[2.2rem] shadow-apple border border-premium/10 group hover:border-premium/30 transition-all duration-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-premium/5 to-premium border-[3px] border-app-card text-premium rounded-2xl flex items-center justify-center font-black text-xl shadow-inner overflow-hidden transition-all">
                            <span className="group-hover:scale-110 transition-transform">{emp.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-black text-base text-app-text tracking-tight transition-colors">{emp.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {emp.role ? (
                                <span className="text-[10px] bg-premium/5 text-premium font-bold px-1.5 py-0.5 rounded-md transition-colors">{emp.role}</span>
                              ) : (
                                <span className="text-[10px] bg-premium/5 text-app-text/30 font-bold px-1.5 py-0.5 rounded-md">No Role</span>
                              )}
                              <span className="text-[10px] text-app-text/30 font-bold tracking-tight">#{emp.id.split('-')[0].toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingEmployee(emp);
                              setEmployeeNameInput(emp.name);
                              setEmployeeRoleInput(emp.role || '');
                              window.scrollTo({ top: document.getElementById('employee-form')?.offsetTop ? document.getElementById('employee-form')!.offsetTop - 100 : 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-premium bg-premium/5 hover:bg-premium/10 rounded-xl transition-all font-bold text-xs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </motion.button>
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteEmployee(emp.id)}
                            className="p-2.5 text-app-text/30 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-app-card/40 rounded-[2.5rem] border border-dashed border-premium/20 transition-all duration-500">
                    <div className="w-16 h-16 bg-premium/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-premium/40" />
                    </div>
                    <p className="font-bold text-app-text/40">{t.noEmployees}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50">
        <div className="glass max-w-md mx-auto rounded-[2rem] p-2 flex justify-between shadow-2xl border border-white/40">
          <NavButton 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')}
            icon={<Plus />}
            label={t.addTab}
          />
          <NavButton 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')}
            icon={<BarChart3 />}
            label={t.reportTab}
          />
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<History />}
            label={t.historyTab}
          />
          <NavButton 
            active={activeTab === 'employees'} 
            onClick={() => setActiveTab('employees')}
            icon={<Users />}
            label={t.employeesTab}
          />
        </div>
      </nav>
    </div>
  );
}

function InputGroup({ label, children, icon }: { label: string, children: ReactNode, icon: ReactNode }) {
  return (
    <div className="bg-premium/5 border border-premium/10 rounded-2xl p-4 transition-all focus-within:bg-app-card focus-within:shadow-apple-hover">
      <label className="text-[10px] uppercase tracking-widest text-app-text/40 font-bold mb-1 flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 flex-1 py-3 transition-all duration-300 rounded-[1.5rem] group overflow-hidden ${
        active ? 'text-premium' : 'text-app-text/40 hover:text-app-text'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-premium/10 transition-colors"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 mb-0.5' })}
        <span className="text-[10px] font-bold block">{label}</span>
      </div>
    </button>
  );
}
