
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agentId, setAgentId] = useState('');
  const [newCourier, setNewCourier] = useState({
    fromName: '',
    fromMobile: '',
    fromPlace: '',
    toName: '',
    toMobile: '',
    toPlace: '',
    pickupDate: '',
    expectedDeliveryDate: '',
    remarks: '',
    courierAmount: 0
  });
  const [trackingUpdate, setTrackingUpdate] = useState({ courierId: '', status: '' });
  const [myCouriers, setMyCouriers] = useState([
    { id: 'JOH123', fromName: 'John Doe', toName: 'Jane Smith', fromPlace: 'New York', toPlace: 'Los Angeles', status: 'In Transit', pickupDate: '2024-01-15', expectedDeliveryDate: '2024-01-18', courierAmount: 200 },
    { id: 'SAR789', fromName: 'Sarah Brown', toName: 'Tom Davis', fromPlace: 'Seattle', toPlace: 'Denver', status: 'Picked Up', pickupDate: '2024-01-16', expectedDeliveryDate: '2024-01-19', courierAmount: 200 }
  ]);
  const [deliverySelfies, setDeliverySelfies] = useState({});
  const [deliveryModal, setDeliveryModal] = useState({ isOpen: false, courierId: '' });
  const [customerNote, setCustomerNote] = useState('');
  const [changePassword, setChangePassword] = useState({ current: '', new: '', confirm: '' });
  const [uploadStatus, setUploadStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('agentAuth');
    const id = localStorage.getItem('agentId');
    if (!auth) {
      router.push('/agent/login');
    } else {
      setAgentId(id || '');
    }
  }, [router]);

  const generateCourierId = (toName: string) => {
    const initials = toName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 3);
    const numbers = Math.floor(Math.random() * 900) + 100;
    return `${initials}${numbers}`;
  };

  const calculateCourierAmount = (fromPlace: string, toPlace: string) => {
    const cityRates = {
      'Mumbai': 300,
      'Delhi': 300,
      'Bangalore': 280,
      'Chennai': 280,
      'Hyderabad': 270,
      'Kolkata': 270,
      'Pune': 260,
      'Ahmedabad': 250,

      'Jaipur': 220,
      'Lucknow': 210,
      'Kanpur': 200,
      'Nagpur': 200,
      'Indore': 190,
      'Thane': 240,
      'Bhopal': 180,
      'Visakhapatnam': 180,
      'Patna': 170,
      'Vadodara': 190,
      'Ludhiana': 180,
      'Agra': 170,
      'Nashik': 180,
      'Faridabad': 200,
      'Meerut': 170,
      'Rajkot': 180,
      'Kalyan-Dombivli': 220,
      'Vasai-Virar': 210,
      'Varanasi': 160,
      'Srinagar': 200,
      'Aurangabad': 170,
      'Dhanbad': 160,
      'Amritsar': 180,
      'Navi Mumbai': 240,
      'Allahabad': 160,
      'Ranchi': 170,
      'Howrah': 200,
      'Coimbatore': 180,
      'Jabalpur': 160,
      'Gwalior': 160,
      'Vijayawada': 170,
      'Jodhpur': 170,
      'Madurai': 170,
      'Raipur': 160,
      'Kota': 160,
      'Chandigarh': 200,
      'Guwahati': 180,
      'Solapur': 160,
      'Hubli-Dharwad': 160,
      'Bareilly': 150,
      'Moradabad': 150,
      'Mysore': 170,
      'Gurgaon': 220,
      'Aligarh': 150,
      'Jalandhar': 170,
      'Tiruchirappalli': 160,
      'Bhubaneswar': 170,
      'Salem': 160,
      'Mira-Bhayandar': 220,
      'Warangal': 150,
      'Thiruvananthapuram': 180,
      'Guntur': 150,
      'Bhiwandi': 200,
      'Saharanpur': 150,
      'Gorakhpur': 150,
      'Bikaner': 160,
      'Amravati': 150,
      'Noida': 210,
      'Jamshedpur': 160,
      'Bhilai': 150,
      'Cuttack': 160,
      'Firozabad': 140,
      'Kochi': 180,
      'Bhavnagar': 160,
      'Dehradun': 170,
      'Durgapur': 150,
      'Asansol': 150,
      'Nanded': 140,
      'Kolhapur': 150,
      'Ajmer': 150,
      'Gulbarga': 140,
      'Jamnagar': 160,
      'Ujjain': 140,
      'Loni': 180,
      'Siliguri': 150,
      'Jhansi': 140,
      'Ulhasnagar': 200,
      'Nellore': 140,
      'Jammu': 180,
      'Sangli-Miraj & Kupwad': 150,
      'Belgaum': 150,
      'Mangalore': 170,
      'Ambattur': 200,
      'Tirunelveli': 150,
      'Malegaon': 160,
      'Gaya': 130,
      'Jalgaon': 150,
      'Udaipur': 160,
      'Maheshtala': 180,

      'Dubai': 1500,
      'London': 2000,
      'New York': 2200,
      'Singapore': 1800,
      'Bangkok': 1600,
      'Kuala Lumpur': 1700,
      'Hong Kong': 1900,
      'Tokyo': 2500,
      'Sydney': 2300,
      'Toronto': 2100,
      'Paris': 2000,
      'Berlin': 1900,
      'Amsterdam': 1800,
      'Zurich': 2200,
      'Seoul': 2000,
      'Beijing': 1800,
      'Shanghai': 1900,
      'Manila': 1600,
      'Jakarta': 1500,
      'Riyadh': 1700,
      'Doha': 1600,
      'Abu Dhabi': 1500,
      'Kuwait City': 1600,
      'Muscat': 1400,
      'Manama': 1500,
      'Colombo': 1200,
      'Dhaka': 1000,
      'Kathmandu': 800,
      'Thimphu': 900,
      'Male': 1300,
      'Karachi': 1100,
      'Lahore': 1000,
      'Islamabad': 1100,
      'Kabul': 1200,
      'Tehran': 1500,
      'Baghdad': 1600,
      'Cairo': 1400,
      'Nairobi': 1600,
      'Cape Town': 1800,
      'Lagos': 1500,
      'Addis Ababa': 1400,
      'Casablanca': 1500,
      'Tunis': 1300,
      'Algiers': 1400,
      'Accra': 1500,
      'Dar es Salaam': 1400,
      'Kampala': 1300,
      'Khartoum': 1200,
      'Lusaka': 1300,
      'Harare': 1200,
      'Antananarivo': 1500
    };

    const fromRate = cityRates[fromPlace] || 120;
    const toRate = cityRates[toPlace] || 120;

    const baseAmount = (fromRate + toRate) / 2;

    const isInternational = fromRate > 1000 || toRate > 1000;
    if (isInternational) {
      return Math.round(baseAmount * 1.2);
    }

    return Math.round(baseAmount);
  };

  const handleFromPlaceChange = (value: string) => {
    const updatedCourier = { ...newCourier, fromPlace: value };
    if (updatedCourier.toPlace) {
      updatedCourier.courierAmount = calculateCourierAmount(value, updatedCourier.toPlace);
    }
    setNewCourier(updatedCourier);
  };

  const handleToPlaceChange = (value: string) => {
    const updatedCourier = { ...newCourier, toPlace: value };
    if (updatedCourier.fromPlace) {
      updatedCourier.courierAmount = calculateCourierAmount(updatedCourier.fromPlace, value);
    }
    setNewCourier(updatedCourier);
  };

  const handleAddCourier = (e: React.FormEvent) => {
    e.preventDefault();
    const courierId = generateCourierId(newCourier.toName);
    const courier = {
      id: courierId,
      ...newCourier,
      status: 'Picked Up'
    };
    setMyCouriers([...myCouriers, courier]);
    setNewCourier({
      fromName: '',
      fromMobile: '',
      fromPlace: '',
      toName: '',
      toMobile: '',
      toPlace: '',
      pickupDate: '',
      expectedDeliveryDate: '',
      remarks: '',
      courierAmount: 0
    });

    const receipt = `CourierPro Receipt\n${'='.repeat(30)}\nCourier ID: ${courierId}\nFrom: ${newCourier.fromName} (${newCourier.fromPlace})\nTo: ${newCourier.toName} (${newCourier.toPlace})\nPickup Date: ${newCourier.pickupDate}\nExpected Delivery Date: ${newCourier.expectedDeliveryDate}\nCourier Amount: ₹${newCourier.courierAmount}\nRemarks: ${newCourier.remarks}\nAgent: ${agentId}\nStatus: Picked Up\n${'='.repeat(30)}`;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${courierId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpdateTracking = (e: React.FormEvent) => {
    e.preventDefault();

    if (trackingUpdate.status === 'Delivered') {
      setUploadStatus('Cannot mark as delivered without uploading selfie first. Use the delivery completion feature.');
      return;
    }

    setMyCouriers(myCouriers.map(courier =>
      courier.id === trackingUpdate.courierId
        ? { ...courier, status: trackingUpdate.status }
        : courier
    ));
    setTrackingUpdate({ courierId: '', status: '' });
    setUploadStatus('');
  };

  const openDeliveryModal = (courierId: string) => {
    setDeliveryModal({ isOpen: true, courierId });
    setCustomerNote('');
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setUploadStatus('Selfie must be less than 500KB');
      return;
    }

    setDeliverySelfies({
      ...deliverySelfies,
      [deliveryModal.courierId]: { file, customerNote }
    });
    setUploadStatus('Selfie uploaded successfully');
  };

  const handleDeliveryComplete = () => {
    const courierId = deliveryModal.courierId;
    const deliveryData = deliverySelfies[courierId];

    if (!deliveryData?.file) {
      setUploadStatus('Please upload a selfie to complete delivery');
      return;
    }

    if (!customerNote.trim()) {
      setUploadStatus('Please add a customer note');
      return;
    }

    setMyCouriers(myCouriers.map(courier =>
      courier.id === courierId
        ? { ...courier, status: 'Delivered' }
        : courier
    ));

    setDeliverySelfies({
      ...deliverySelfies,
      [courierId]: { ...deliveryData, customerNote }
    });

    setDeliveryModal({ isOpen: false, courierId: '' });
    setCustomerNote('');
    setUploadStatus('Delivery completed successfully!');
  };

  const exportStats = () => {
    const delivered = myCouriers.filter(c => c.status === 'Delivered').length;
    const pending = myCouriers.filter(c => c.status !== 'Delivered').length;

    const stats = `Agent Stats Report - ${agentId}\n${'='.repeat(40)}\n\nToday's Stats:\nDelivered: ${delivered}\nPending: ${pending}\nTotal Revenue: ₹${delivered * 200}\n\nMy Couriers:\n${myCouriers.map(c =>
      `${c.id}: ${c.fromName} → ${c.toName} (${c.status})`
    ).join('\n')}\n\nGenerated on: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([stats], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-stats-${agentId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('agentAuth');
    localStorage.removeItem('agentId');
    router.push('/agent/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
              CourierPro
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">Agent: {agentId}</span>
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
        {/* Status Message */}
        {uploadStatus && (
          <div className={`mb-4 p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${uploadStatus.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {uploadStatus}
          </div>
        )}

        {/* Navigation Tabs - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex space-x-1 sm:space-x-8 border-b overflow-x-auto">
            {[{
              id: 'overview',
              label: 'Overview',
              icon: 'ri-dashboard-line'
            }, {
              id: 'add-courier',
              label: 'Add',
              icon: 'ri-add-line'
            }, {
              id: 'update-tracking',
              label: 'Update',
              icon: 'ri-refresh-line'
            }, {
              id: 'my-stats',
              label: 'Stats',
              icon: 'ri-bar-chart-line'
            }, {
              id: 'settings',
              label: 'Settings',
              icon: 'ri-settings-line'
            }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
                <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-truck-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-green-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">My Couriers</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{myCouriers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-check-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-blue-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{myCouriers.filter(c => c.status === 'Delivered').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-time-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-orange-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{myCouriers.filter(c => c.status !== 'Delivered').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                  <i className="ri-money-dollar-circle-line w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-purple-600"></i>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">₹{myCouriers.filter(c => c.status === 'Delivered').length * 200}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Courier Tab */}
        {activeTab === 'add-courier' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Courier</h2>
            </div>
            <div className="p-3 sm:p-6">
              <form onSubmit={handleAddCourier} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">From Details</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <input
                        type="text"
                        value={newCourier.fromName}
                        onChange={(e) => setNewCourier({ ...newCourier, fromName: e.target.value })}
                        placeholder="From Name"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="tel"
                        value={newCourier.fromMobile}
                        onChange={(e) => setNewCourier({ ...newCourier, fromMobile: e.target.value })}
                        placeholder="From Mobile"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={newCourier.fromPlace}
                        onChange={(e) => handleFromPlaceChange(e.target.value)}
                        placeholder="From Place"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">To Details</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <input
                        type="text"
                        value={newCourier.toName}
                        onChange={(e) => setNewCourier({ ...newCourier, toName: e.target.value })}
                        placeholder="To Name"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="tel"
                        value={newCourier.toMobile}
                        onChange={(e) => setNewCourier({ ...newCourier, toMobile: e.target.value })}
                        placeholder="To Mobile"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        value={newCourier.toPlace}
                        onChange={(e) => handleToPlaceChange(e.target.value)}
                        placeholder="To Place"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                    <input
                      type="date"
                      value={newCourier.pickupDate}
                      onChange={(e) => setNewCourier({ ...newCourier, pickupDate: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                    <input
                      type="date"
                      value={newCourier.expectedDeliveryDate}
                      onChange={(e) => setNewCourier({ ...newCourier, expectedDeliveryDate: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Courier Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        value={newCourier.courierAmount}
                        onChange={(e) => setNewCourier({ ...newCourier, courierAmount: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                        min="0"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Amount calculated based on city rates</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Remarks</label>
                    <textarea
                      value={newCourier.remarks}
                      onChange={(e) => setNewCourier({ ...newCourier, remarks: e.target.value })}
                      placeholder="Add any special instructions or remarks"
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                      maxLength={500}
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Additional Remarks</label>
                  <textarea
                    value={newCourier.remarks}
                    onChange={(e) => setNewCourier({ ...newCourier, remarks: e.target.value })}
                    placeholder="Add any special instructions or remarks"
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                    maxLength={500}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap text-xs sm:text-sm"
                >
                  <i className="ri-add-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                  Add Courier & Generate Receipt
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Update Tracking Tab */}
        {activeTab === 'update-tracking' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Update Tracking</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Note: To mark as delivered, use the delivery completion feature below</p>
              </div>
              <div className="p-3 sm:p-6">
                <form onSubmit={handleUpdateTracking} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <input
                    type="text"
                    value={trackingUpdate.courierId}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, courierId: e.target.value })}
                    placeholder="Courier ID"
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                  <select
                    value={trackingUpdate.status}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, status: e.target.value })}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm pr-8"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm"
                  >
                    Update Status
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Couriers</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Expected</th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myCouriers.map(courier => (
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
                            courier.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : courier.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <span className="hidden sm:inline">{courier.status}</span>
                            <span className="sm:hidden">
                              {courier.status === 'Delivered' ? 'Del' : courier.status === 'In Transit' ? 'Transit' : 'Picked'}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{courier.expectedDeliveryDate}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium">
                          {courier.status !== 'Delivered' ? (
                            <button
                              onClick={() => openDeliveryModal(courier.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 whitespace-nowrap"
                            >
                              <span className="hidden sm:inline">Complete</span>
                              <span className="sm:hidden">✓</span>
                            </button>
                          ) : (
                            <span className="text-green-600 text-xs">
                              <i className="ri-check-line w-3 h-3 sm:w-4 sm:h-4 inline-flex items-center justify-center"></i>
                              <span className="hidden sm:inline ml-1">Delivered</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* My Stats Tab */}
        {activeTab === 'my-stats' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Performance Stats</h2>
                <button
                  onClick={exportStats}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap text-xs sm:text-sm"
                >
                  <i className="ri-download-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                  Export Stats
                </button>
              </div>
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{myCouriers.filter(c => c.status === 'Delivered').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Today's Deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{myCouriers.filter(c => c.status !== 'Delivered').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">₹{myCouriers.filter(c => c.status === 'Delivered').length * 200}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Today's Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600">{myCouriers.length * 15}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Monthly Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Change Password</h2>
            </div>
            <div className="p-3 sm:p-6">
              <form className="max-w-md space-y-3 sm:space-y-4">
                <input
                  type="password"
                  value={changePassword.current}
                  onChange={(e) => setChangePassword({ ...changePassword, current: e.target.value })}
                  placeholder="Current Password"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                />
                <input
                  type="password"
                  value={changePassword.new}
                  onChange={(e) => setChangePassword({ ...changePassword, new: e.target.value })}
                  placeholder="New Password"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                />
                <input
                  type="password"
                  value={changePassword.confirm}
                  onChange={(e) => setChangePassword({ ...changePassword, confirm: e.target.value })}
                  placeholder="Confirm New Password"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Completion Modal */}
        {deliveryModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Complete Delivery</h3>
                <button
                  onClick={() => setDeliveryModal({ isOpen: false, courierId: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-gray-600">Courier ID: {deliveryModal.courierId}</p>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Upload Delivery Selfie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Max file size: 500KB</p>
                  {deliverySelfies[deliveryModal.courierId]?.file && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-600">
                        ✓ Selfie uploaded: {deliverySelfies[deliveryModal.courierId].file.name}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Customer Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Add a note about the delivery (e.g., customer feedback, delivery location details)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                    maxLength={500}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setDeliveryModal({ isOpen: false, courierId: '' })}
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeliveryComplete}
                    className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm"
                  >
                    Complete Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
