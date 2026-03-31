import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Shield, Trash2, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employee list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setCreating(true);
    setSuccessMsg('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/users/register', newEmployee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg(`Employee ${newEmployee.name} created successfully!`);
      setIsModalOpen(false);
      setNewEmployee({ name: '', email: '', password: '', role: 'agent' });
      fetchEmployees();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="main-content animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Team Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your support staff and administrative roles.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add Employee
        </button>
      </header>

      {successMsg && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {loading ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ height: '50px', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '60px', margin: '1rem 1.5rem', borderRadius: '4px' }}></div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{emp.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${emp.role === 'admin' ? 'badge-open' : 'badge-pending'}`} style={{ fontSize: '0.65rem' }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteEmployee(emp.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add New Team Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={24} /></button>
            </header>

            {error && (
              <div style={{ background: '#fef2f2', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                />
              </div>

              <div>
                <label className="form-label">Official Email</label>
                <input 
                  type="email" 
                  required 
                  className="form-control" 
                  placeholder="john@example.com"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                />
              </div>

              <div>
                <label className="form-label">Temporary Password</label>
                <input 
                  type="password" 
                  required 
                  className="form-control" 
                  placeholder="••••••••"
                  value={newEmployee.password}
                  onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                />
              </div>

              <div>
                <label className="form-label">Access Role</label>
                <select 
                  className="form-control"
                  value={newEmployee.role}
                  onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                >
                  <option value="agent">Support Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ flex: 1, background: '#f1f5f9' }}>Cancel</button>
                <button type="submit" disabled={creating} className="btn btn-primary" style={{ flex: 2 }}>
                  {creating ? 'Creating...' : 'Invite Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
