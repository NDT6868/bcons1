
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Lead } from '../types';
import { BCONS_PROJECTS as DEFAULT_PROJECTS } from '../constants';

interface AdminUser {
  username: string;
  password: string;
}

interface ProjectContextType {
  projects: Project[];
  isAdmin: boolean;
  adminUsers: AdminUser[];
  leads: Lead[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProject: (updatedProject: Project) => void;
  addProject: (newProject: Project) => void;
  deleteProject: (id: string) => void;
  addAdmin: (user: AdminUser) => void;
  deleteAdmin: (username: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  resetToDefault: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Project State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('bcons_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bcons_admin_auth') === 'true';
  });

  // Admin Users List State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('bcons_admin_users');
    return saved ? JSON.parse(saved) : [{ username: 'admin', password: 'admin123' }];
  });

  // Leads State
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('bcons_leads');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bcons_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('bcons_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('bcons_leads', JSON.stringify(leads));
  }, [leads]);

  const login = (username: string, password: string) => {
    const user = adminUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAdmin(true);
      localStorage.setItem('bcons_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('bcons_admin_auth');
  };

  const addAdmin = (newUser: AdminUser) => {
    if (adminUsers.some(u => u.username === newUser.username)) {
      throw new Error('Tên tài khoản đã tồn tại');
    }
    setAdminUsers(prev => [...prev, newUser]);
  };

  const deleteAdmin = (username: string) => {
    if (adminUsers.length <= 1) {
      throw new Error('Không thể xóa tài khoản admin cuối cùng');
    }
    setAdminUsers(prev => prev.filter(u => u.username !== username));
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const addProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Lead Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Mới'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Hành động này sẽ khôi phục dữ liệu gốc (Dự án, Tài khoản & Khách hàng). Bạn có chắc không?')) {
      setProjects(DEFAULT_PROJECTS);
      setAdminUsers([{ username: 'admin', password: 'admin123' }]);
      setLeads([]);
      localStorage.removeItem('bcons_projects');
      localStorage.removeItem('bcons_admin_users');
      localStorage.removeItem('bcons_leads');
      window.location.reload();
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      isAdmin,
      adminUsers,
      leads,
      login,
      logout,
      updateProject, 
      addProject, 
      deleteProject,
      addAdmin,
      deleteAdmin,
      addLead,
      updateLeadStatus,
      deleteLead,
      resetToDefault 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
