
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [couriers, setCouriers] = useState([
    { id: 'JOH123', fromName: 'John Doe', toName: 'Jane Smith', fromPlace: 'Mumbai', toPlace: 'Delhi', status: 'In Transit', date: '2024-01-15', agent: 'Agent001' },
    { id: 'MAR456', fromName: 'Mark Johnson', toName: 'Lisa Wilson', fromPlace: 'Bangalore', toPlace: 'Chennai', status: 'Delivered', date: '2024-01-14', agent: 'Agent002' },
    { id: 'SAR789', fromName: 'Sarah Brown', toName: 'Tom Davis', fromPlace: 'Kolkata', toPlace: 'Hyderabad', status: 'Picked Up', date: '2024-01-16', agent: 'Agent001' }
  ]);
  const [agents, setAgents] = useState([
    { id: 'Agent001', name: 'Rajesh Kumar', email: 'rajesh@courier.com', status: 'Active', joinDate: '2024-01-01' },
    { id: 'Agent002', name: 'Priya Sharma', email: 'priya@courier.com', status: 'Active', joinDate: '2024-01-02' }
  ]);
  const [deliverySelfies, setDeliverySelfies] = useState([
    { id: 'JOH123', courierId: 'JOH123', agentId: 'Agent001', customerNote: 'Package delivered to customer at home', uploadTime: '2024-01-15 14:30', imageUrl: 'https://readdy.ai/api/search-image?query=delivery%20agent%20taking%20selfie%20with%20customer%20holding%20package%20at%20doorstep%2C%20professional%20uniform%2C%20Indian%20setting%2C%20daytime%20delivery%2C%20clear%20background%2C%20realistic%20photo&width=400&height=300&seq=delivery1&orientation=landscape' },
    { id: 'MAR456', courierId: 'MAR456', agentId: 'Agent002', customerNote: 'Successfully delivered to office reception', uploadTime: '2024-01-14 16:45', imageUrl: 'https://readdy.ai/api/search-image?query=female%20delivery%20agent%20selfie%20with%20office%20receptionist%2C%20professional%20delivery%20uniform%2C%20modern%20office%20background%2C%20package%20handover%2C%20Indian%20business%20setting%2C%20clear%20lighting&width=400&height=300&seq=delivery2&orientation=landscape' }
  ]);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '' });
  const [editingCourier, setEditingCourier] = useState<any>(null);
  const [resetPassword, setResetPassword] = useState({ current: '', new: '', confirm: '' });
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const addAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const agentId = `Agent${(agents.length + 1).toString().padStart(3, '0')}`;
    setAgents([...agents, { 
      id: agentId, 
      name: newAgent.name, 
      email: newAgent.email, 
      status: 'Active', 
      joinDate: new Date().toISOString().split('T')[0] 
    }]);
    setNewAgent({ name: '', email: '', password: '' });
  };

  const updateCourierStatus = (courierId: string, newStatus: string) => {
    setCouriers(couriers.map(courier => 
      courier.id === courierId ? { ...courier, status: newStatus } : courier
    ));
    setEditingCourier(null);
  };

  const exportData = () => {
    const data = `CourierPro Export Report\n${'='.repeat(50)}\n\nCouriers:\n${couriers.map(c => 
      `ID: ${c.id}, From: ${c.fromName} (${c.fromPlace}), To: ${c.toName} (${c.toPlace}), Status: ${c.status}, Date: ${c.date}, Agent: ${c.agent}`
    ).join('\n')}\n\nAgents:\n${agents.map(a => 
      `ID: ${a.id}, Name: ${a.name}, Email: ${a.email}, Status: ${a.status}, Join Date: ${a.joinDate}`
    ).join('\n')}`;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courier-report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
              CourierPro
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 flex items-center text-xs sm:text-sm"
              >
                <i className="ri-logout-circle-line w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex space-x-1 sm:space-x-8 border-b overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
              { id: 'couriers', label: 'Couriers', icon: 'ri-truck-line' },
              { id: 'agents', label: 'Agents', icon: 'ri-user-line' },
              { id: 'delivery-selfies', label: 'Selfies', icon: 'ri-camera-line' },
              { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' },
              { id: 'settings', label: 'Settings', icon: 'ri-settings-line' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mr-1 sm:mr-2`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-truck-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-blue-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Couriers</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{couriers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-check-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-green-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{couriers.filter(c => c.status === 'Delivered').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-time-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-orange-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{couriers.filter(c => c.status === 'In Transit').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-user-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-purple-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{agents.filter(a => a.status === 'Active').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Couriers Tab */}
        {activeTab === 'couriers' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Couriers</h2>
                <button
                  onClick={exportData}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center whitespace-nowrap text-xs sm:text-sm"
                >
                  <i className="ri-download-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                  Export Data
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Agent</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {couriers.map(courier => (
                    <tr key={courier.id}>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                        <div className="truncate max-w-20 sm:max-w-none">{courier.id}</div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                        <div className="truncate max-w-20 sm:max-w-none">{courier.fromName}</div>
                        <div className="text-gray-500 text-xs truncate max-w-20 sm:max-w-none">{courier.fromPlace}</div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                        <div className="truncate max-w-20 sm:max-w-none">{courier.toName}</div>
                        <div className="text-gray-500 text-xs truncate max-w-20 sm:max-w-none">{courier.toPlace}</div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${
                          courier.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          courier.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          <span className="hidden sm:inline">{courier.status}</span>
                          <span className="sm:hidden">
                            {courier.status === 'Delivered' ? 'Del' : 
                             courier.status === 'In Transit' ? 'Transit' : 'Picked'}
                          </span>
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{courier.date}</td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{courier.agent}</td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => setEditingCourier(courier)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Agent</h2>
              </div>
              <div className="p-3 sm:p-6">
                <form onSubmit={addAgent} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    placeholder="Agent Name"
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                  <input
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                    placeholder="Email"
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                  <input
                    type="password"
                    value={newAgent.password}
                    onChange={(e) => setNewAgent({...newAgent, password: e.target.value})}
                    placeholder="Password"
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap text-xs sm:text-sm"
                  >
                    Add Agent
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Agents</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map(agent => (
                      <tr key={agent.id}>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{agent.id}</td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{agent.name}</td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{agent.email}</td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{agent.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Selfies Tab */}
        {activeTab === 'delivery-selfies' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Delivery Selfies</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">View selfies uploaded by agents upon delivery completion</p>
            </div>
            <div className="p-3 sm:p-6">
              {deliverySelfies.length === 0 ? (
                <div className="text-center py-8">
                  <i className="ri-camera-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
                  <p className="text-gray-500">No delivery selfies uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {deliverySelfies.map(selfie => (
                    <div key={selfie.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={selfie.imageUrl} 
                          alt={`Delivery selfie for ${selfie.courierId}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Courier ID: {selfie.courierId}</p>
                            <p className="text-xs text-gray-600">Agent: {selfie.agentId}</p>
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <p className="text-xs text-gray-600 mb-1">Customer Note:</p>
                          <p className="text-xs text-gray-900">{selfie.customerNote}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          <i className="ri-time-line w-3 h-3 inline-flex items-center justify-center mr-1"></i>
                          {selfie.uploadTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Daily Stats</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Today's Deliveries</span>
                  <span className="text-xl sm:text-2xl font-semibold text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Revenue Today</span>
                  <span className="text-xl sm:text-2xl font-semibold text-blue-600">₹2,400</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Active Agents</span>
                  <span className="text-xl sm:text-2xl font-semibold text-purple-600">{agents.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Stats</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Monthly Deliveries</span>
                  <span className="text-xl sm:text-2xl font-semibold text-green-600">325</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Monthly Revenue</span>
                  <span className="text-xl sm:text-2xl font-semibold text-blue-600">₹65,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Success Rate</span>
                  <span className="text-xl sm:text-2xl font-semibold text-purple-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Reset Password</h2>
            </div>
            <div className="p-3 sm:p-6">
              <form className="max-w-md space-y-3 sm:space-y-4">
                <input
                  type="password"
                  value={resetPassword.new}
                  onChange={(e) => setResetPassword({...resetPassword, new: e.target.value})}
                  placeholder="New Password"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
                <input
                  type="password"
                  value={resetPassword.confirm}
                  onChange={(e) => setResetPassword({...resetPassword, confirm: e.target.value})}
                  placeholder="Confirm New Password"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap text-xs sm:text-sm"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit Courier Modal */}
      {editingCourier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Update Courier Status</h3>
              <button
                onClick={() => setEditingCourier(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600">Courier ID: {editingCourier.id}</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateCourierStatus(editingCourier.id, status)}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${
                      editingCourier.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
