
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types';
import { BCONS_PROJECTS as DEFAULT_PROJECTS } from '../constants';

interface AdminUser {
  username: string;
  password: string;
}

interface ProjectContextType {
  projects: Project[];
  isAdmin: boolean;
  adminUsers: AdminUser[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProject: (updatedProject: Project) => void;
  addProject: (newProject: Project) => void;
  deleteProject: (id: string) => void;
  addAdmin: (user: AdminUser) => void;
  deleteAdmin: (username: string) => void;
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
    // Default account if none exists
    return saved ? JSON.parse(saved) : [{ username: 'admin', password: 'admin123' }];
  });

  useEffect(() => {
    localStorage.setItem('bcons_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('bcons_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

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

  const resetToDefault = () => {
    if (window.confirm('Hành động này sẽ khôi phục dữ liệu gốc (Dự án & Tài khoản). Bạn có chắc không?')) {
      setProjects(DEFAULT_PROJECTS);
      setAdminUsers([{ username: 'admin', password: 'admin123' }]);
      localStorage.removeItem('bcons_projects');
      localStorage.removeItem('bcons_admin_users');
      window.location.reload();
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      isAdmin,
      adminUsers,
      login,
      logout,
      updateProject, 
      addProject, 
      deleteProject,
      addAdmin,
      deleteAdmin,
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
