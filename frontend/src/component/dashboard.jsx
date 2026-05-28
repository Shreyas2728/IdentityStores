import React, { useState, useRef, useEffect } from 'react';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('home'); // home, drops, cart, orders, settings, editor, profile
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Notifications Dropdown Ref
  const notificationRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [orderTab, setOrderTab] = useState('present');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const uploadInputRef = useRef(null);

  // Editor State
  const [garmentStyle, setGarmentStyle] = useState('half');
  const [garmentView, setGarmentView] = useState('front');
  const [garmentSize, setGarmentSize] = useState('M');
  const [garmentColor, setGarmentColor] = useState('transparent');
  const [designScale, setDesignScale] = useState(100);
  const [designRotate, setDesignRotate] = useState(0);
  const [designOpacity, setDesignOpacity] = useState(100);
  const [customText, setCustomText] = useState('');
  const [textInputVal, setTextInputVal] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(32);
  const [textFont, setTextFont] = useState("'Inter', sans-serif");
  const [cartItems, setCartItems] = useState([]);
  const [savedDrops, setSavedDrops] = useState([]);

  // Position state for draggable design
  const [designPos, setDesignPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - designPos.x,
      y: e.clientY - designPos.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setDesignPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Garment photos mapping
  const garmentPhotos = {
    half: {
      front: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=90',
      back: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=600&q=90',
    },
    full: {
      front: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=90',
      back: 'https://images.unsplash.com/photo-1618354691249-18772bb100fa?auto=format&fit=crop&w=600&q=90',
    },
    hood: {
      front: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=600&q=90',
      back: 'https://images.unsplash.com/photo-1556821838-89c0b115cb9e?auto=format&fit=crop&w=600&q=90',
    },
    tank: {
      front: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=90',
      back: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=90',
    },
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedDesign(event.target.result);
        setCurrentView('editor');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDesign = () => {
    const newItem = {
      id: Date.now(),
      garment: garmentStyle,
      size: garmentSize,
      color: garmentColor,
      frontImage: garmentPhotos[garmentStyle].front,
      designImage: uploadedDesign,
      timestamp: new Date().toLocaleDateString(),
    };
    setSavedDrops([newItem, ...savedDrops]);
    setCartItems([newItem, ...cartItems]);
    alert('Design successfully added to Cart and saved in Drops!');
    setCurrentView('cart');
  };

  const renderSidebar = () => (
    <aside className="w-[260px] bg-zinc-950 border-r border-zinc-900 flex flex-col p-6 z-10">
      <div className="flex items-center gap-3 mb-12">
        <div className="inline-flex justify-center items-center w-10 h-10 bg-white/5 rounded-xl border border-white/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E01E2E" />
                <stop offset="1" stopColor="#B80F1E" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="2" y1="19.5" x2="22" y2="19.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E01E2E" />
                <stop offset="1" stopColor="#B80F1E" />
              </linearGradient>
              <linearGradient id="paint2_linear" x1="2" y1="14.5" x2="22" y2="14.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E01E2E" />
                <stop offset="1" stopColor="#B80F1E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white font-black tracking-tight">IdentityStores</h2>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${currentView === 'home' ? 'bg-red-600/10 text-red-600' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('drops')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${currentView === 'drops' ? 'bg-red-600/10 text-red-600' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path>
          </svg>
          Products
        </button>
        <button
          onClick={() => setCurrentView('orders')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${currentView === 'orders' ? 'bg-red-600/10 text-red-600' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Orders
        </button>
        <button
          onClick={() => setCurrentView('cart')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${currentView === 'cart' ? 'bg-red-600/10 text-red-600' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Cart
        </button>
      </nav>

      <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-zinc-800">
        <button
          onClick={() => setCurrentView('settings')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${currentView === 'settings' ? 'bg-red-600/10 text-red-600' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </button>
        <button
          onClick={() => {}}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );

  const renderHeader = () => (
    <header className="h-[80px] flex items-center justify-between px-8 bg-zinc-950 border-b border-zinc-900 z-10 w-full relative">
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 w-[400px] transition-all focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-600/25">
        <svg className="w-4 h-4 text-zinc-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search across identity stores..." className="bg-transparent border-none text-white w-full outline-none text-sm placeholder:text-zinc-400" />
      </div>

      <div className="flex items-center gap-6 relative">
        <button
          className="bg-transparent border-none text-zinc-400 cursor-pointer w-10 h-10 rounded-full flex justify-center items-center relative hover:bg-zinc-900 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-black"></span>
        </button>

        {isNotificationOpen && (
          <div ref={notificationRef} className="absolute top-[50px] right-14 w-[320px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 font-semibold text-white">Recent Notifications</div>
            <div className="flex flex-col">
              <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 flex flex-col gap-1 cursor-pointer hover:bg-zinc-800/50">
                <span className="font-semibold text-sm text-white">Order #ORD-8821 Processing</span>
                <span className="text-xs text-zinc-400">2 mins ago</span>
              </div>
              <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 flex flex-col gap-1 cursor-pointer hover:bg-zinc-800/50">
                <span className="font-semibold text-sm text-white">New exclusive drop: Neon Cyber</span>
                <span className="text-xs text-zinc-400">1 hour ago</span>
              </div>
              <div className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-zinc-800/30">
                <span className="font-medium text-sm text-zinc-300">Order #ORD-8799 Shipped</span>
                <span className="text-xs text-zinc-400">Yesterday</span>
              </div>
            </div>
          </div>
        )}

        <div className="cursor-pointer border-2 border-transparent hover:border-red-600 rounded-full transition-colors" onClick={() => setCurrentView('profile')}>
          <img src="https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff&rounded=true" alt="User Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
  );

  const renderHomeView = () => (
    <div className="relative z-10 text-center p-8 flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white mb-6">
        Wear Your <br/><span className="text-red-500">Identity</span>
      </h1>
      <p className="text-zinc-400 text-lg mb-12 max-w-lg mx-auto font-medium">Design, customize, and order premium apparel that speaks for you. No limits.</p>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={() => { uploadInputRef.current?.click(); }}
          className="bg-white text-black rounded-xl p-5 flex items-center justify-center gap-3 cursor-pointer transition-transform hover:-translate-y-1 w-[220px] font-bold text-lg shadow-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload Design
        </button>
        
        <button className="bg-red-600 text-white rounded-xl p-5 flex items-center justify-center gap-3 cursor-pointer transition-transform hover:-translate-y-1 w-[220px] font-bold text-lg shadow-lg hover:bg-red-500">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Generate Design
        </button>
        
        <button onClick={() => setCurrentView('drops')} className="bg-zinc-800 text-white rounded-xl p-5 flex items-center justify-center gap-3 cursor-pointer transition-transform hover:-translate-y-1 w-[220px] font-bold text-lg shadow-lg hover:bg-zinc-700">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Explore Drops
        </button>
      </div>
    </div>
  );

  const renderDropsView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Latest Drops</h2>
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:bg-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {[
          { title: "True Never Dies Skull Tee", time: "Dropped just now", img: "/skull_design.jpg" },
          { title: "Miles Morales Spider Hoodie", time: "Dropped just now", img: "/spider_design.jpg" },
          { title: "Neon Cyber Hoodie", time: "Dropped 2 days ago", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { title: "Identity Core Tee", time: "Dropped 5 days ago", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
          { title: "Urban Tech Jacket", time: "Dropped 1 week ago", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
        ].map((drop, idx) => (
          <div key={idx} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-zinc-600 shadow-xl">
            <div className="w-full h-[250px] overflow-hidden" onClick={() => setPreviewImage(drop.img)}>
              <img src={drop.img} alt={drop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{drop.title}</h3>
                <p className="text-sm text-zinc-400">{drop.time}</p>
              </div>
              <a href={drop.img} download target="_blank" rel="noreferrer" className="flex justify-center items-center w-10 h-10 bg-red-600/10 text-red-600 rounded-full transition-all duration-200 hover:bg-red-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>
            </div>
          </div>
        ))}
        {savedDrops.map((drop, idx) => (
           <div key={`saved-${idx}`} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-zinc-600 shadow-xl">
           <div className="w-full h-[250px] overflow-hidden relative" style={{ backgroundColor: drop.color !== 'transparent' ? drop.color : '#f1f5f9' }} onClick={() => setPreviewImage(drop.frontImage)}>
             <img src={drop.frontImage} alt="Custom Design" className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
             <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%]">
                 <img src={drop.designImage} className="max-w-full" alt="Design overlay" />
             </div>
           </div>
           <div className="p-6 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-semibold text-white mb-1">Custom {drop.garment.charAt(0).toUpperCase() + drop.garment.slice(1)} ({drop.size})</h3>
               <p className="text-sm text-zinc-400">Saved {drop.timestamp}</p>
             </div>
           </div>
         </div>
        ))}
      </div>
    </div>
  );

  const renderCartView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Your Cart</h2>
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:bg-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-50 mb-4"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {cartItems.map((item, idx) => (
             <div key={idx} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="w-full h-[250px] overflow-hidden relative" style={{ backgroundColor: item.color !== 'transparent' ? item.color : '#f1f5f9' }}>
                  <img src={item.frontImage} alt="Custom Design" className="w-full h-full object-cover mix-blend-multiply" />
                  <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%]">
                      <img src={item.designImage} className="max-w-full" alt="Design overlay" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-1">Custom {item.garment.charAt(0).toUpperCase() + item.garment.slice(1)} ({item.size})</h3>
                  <p className="text-sm text-zinc-400">Added {item.timestamp}</p>
                  <button className="mt-4 w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-medium transition-colors">Checkout</button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  const renderOrdersView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Your Orders</h2>
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors hover:bg-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2">
        {['present', 'recent', 'completed'].map(tab => (
          <button 
            key={tab}
            onClick={() => setOrderTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${orderTab === tab ? 'bg-red-700 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-16">
        {orderTab === 'present' && (
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=150&q=80" alt="Order" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">Custom Hoodie (L)</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">Processing</span>
              </div>
              <p className="text-sm text-zinc-400 mb-2">Order #ORD-8821 • Placed Today</p>
              <p className="font-semibold text-white">$45.00</p>
            </div>
          </div>
        )}

        {orderTab === 'recent' && (
          <>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80" alt="Order" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">Urban Tech Half Sleeve (M)</h3>
                  <span className="px-3 py-1 bg-red-600/20 text-red-500 border border-red-600/30 rounded-full text-xs font-semibold">Shipped</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2">Order #ORD-8799 • Shipped Yesterday</p>
                <p className="font-semibold text-white">$32.50</p>
              </div>
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                <img src="https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=150&q=80" alt="Order" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">Neon Cyber Tank Top (S)</h3>
                  <span className="px-3 py-1 bg-red-600/20 text-red-500 border border-red-600/30 rounded-full text-xs font-semibold">Shipped</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2">Order #ORD-8750 • Shipped 3 days ago</p>
                <p className="font-semibold text-white">$28.00</p>
              </div>
            </div>
          </>
        )}

        {orderTab === 'completed' && (
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
              <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=150&q=80" alt="Order" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">Identity Core Full Sleeve (XL)</h3>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">Delivered</span>
              </div>
              <p className="text-sm text-zinc-400 mb-2">Order #ORD-8610 • Delivered last week</p>
              <p className="font-semibold text-white">$38.00</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Your Profile</h2>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
          <img src="https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff&rounded=true" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-zinc-800" />
          <div>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Change Avatar</button>
          </div>
        </div>
        <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">Full Name</label>
              <input type="text" defaultValue="Identity User" className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <input type="email" defaultValue="user@identitystores.com" className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">Phone Number</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Shipping Address</label>
            <textarea rows="3" defaultValue="123 Identity Street&#10;Fashion District&#10;NY 10001" className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none resize-none"></textarea>
          </div>
          <button className="bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-6 rounded-xl mt-4 self-start transition-colors">Save Profile Settings</button>
        </form>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="w-full max-w-[1200px] p-8 flex flex-col z-10 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-white border-b border-zinc-800 pb-4">Edit Profile</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-300">Full Name</span>
              <input type="text" defaultValue="Identity User" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none w-1/2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-300">Email</span>
              <input type="email" defaultValue="user@identitystores.com" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none w-1/2" />
            </div>
            <button className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 rounded-lg mt-2 transition-colors">Save Changes</button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-white border-b border-zinc-800 pb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300">Light Mode</span>
              <span className="text-sm text-zinc-500">Switch to a bright, clean theme</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={theme === 'light'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-white border-b border-zinc-800 pb-4">Notifications</h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300">Email Alerts</span>
              <span className="text-sm text-zinc-500">Receive updates about your drops</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300">SMS Notifications</span>
              <span className="text-sm text-zinc-500">Get text messages for shipping</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-white border-b border-zinc-800 pb-4">System Permissions</h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300">Location Access</span>
              <span className="text-sm text-zinc-500">Used for estimating shipping</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300">Analytics Tracking</span>
              <span className="text-sm text-zinc-500">Help us improve experience</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditorView = () => (
    <div className="grid grid-cols-[1fr_350px] w-full h-full overflow-hidden relative z-10">
      {/* Mockup Stage */}
      <div className="bg-black flex justify-center items-center relative p-8 overflow-hidden">
        <div className="relative w-[420px] h-[520px] flex justify-center items-center rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <img src={garmentPhotos[garmentStyle][garmentView]} className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300" alt="Garment Mockup" />
          <div className="absolute inset-0 w-full h-full mix-blend-multiply rounded-2xl pointer-events-none transition-colors duration-300" style={{ backgroundColor: garmentColor }}></div>
          
          <div 
            className="absolute z-10 flex flex-col items-center mix-blend-multiply origin-center w-[180px] cursor-grab active:cursor-grabbing"
            style={{
              top: `calc(32% + ${designPos.y}px)`,
              left: `calc(50% + ${designPos.x}px)`,
              transform: `translate(-50%, -50%) scale(${designScale / 100}) rotate(${designRotate}deg)`,
              opacity: designOpacity / 100
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {uploadedDesign && <img src={uploadedDesign} className="max-w-full max-h-[200px] object-contain pointer-events-none" alt="Uploaded Design" />}
            {customText && (
              <div className="mt-4 font-extrabold uppercase drop-shadow-md pointer-events-none" style={{ color: textColor, fontSize: `${textSize}px`, fontFamily: textFont }}>
                {customText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white font-black tracking-tight mb-2">Design Studio</h2>
        
        {/* Garment Style */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400">Garment Style</label>
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg mb-2">
            <button className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${garmentView === 'front' ? 'bg-red-700 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`} onClick={() => setGarmentView('front')}>Front</button>
            <button className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${garmentView === 'back' ? 'bg-red-700 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`} onClick={() => setGarmentView('back')}>Back</button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'half', label: 'Half Sleeve', icon: <path d="M14,6 Q20,11 26,6 L34,10 L31,18 L29,16 L29,46 L11,46 L11,16 L9,18 L6,10 Z"/> },
              { id: 'full', label: 'Full Sleeve', icon: <path d="M16,6 Q20,11 24,6 L36,11 L37,28 L30,30 L29,46 L11,46 L10,30 L3,28 L4,11 Z"/> },
              { id: 'hood', label: 'Hoodie', icon: <path d="M14,8 Q20,13 26,8 L36,12 L37,30 L29,31 L29,46 L11,46 L11,31 L3,30 L4,12 Z M14,8 Q18,3 20,2 Q22,3 26,8 Q23,5 20,5 Q17,5 14,8 Z"/> },
              { id: 'tank', label: 'Tank Top', icon: <path d="M14,5 Q20,8 26,5 L28,7 Q24,10 23,11 L23,46 L17,46 L17,11 Q16,10 12,7 Z"/> }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setGarmentStyle(item.id)}
                className={`flex flex-col items-center gap-2 p-3 border rounded-xl text-xs font-medium transition-colors ${garmentStyle === item.id ? 'border-red-600 text-white bg-red-600/10' : 'border-zinc-800 text-zinc-400 hover:border-red-600/50 hover:text-zinc-200 bg-white/5'}`}
              >
                <svg viewBox="0 0 40 50" fill="currentColor" className="w-7 h-9 opacity-80"><path d={item.icon.props.d}/></svg>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400">Size</label>
          <div className="flex gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
              <button 
                key={s} 
                onClick={() => setGarmentSize(s)}
                className={`flex-1 py-2 border rounded-lg font-medium text-sm transition-colors ${garmentSize === s ? 'border-red-600 text-white bg-red-600' : 'border-zinc-800 text-zinc-300 hover:border-zinc-500'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Garment Color */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400">Garment Color</label>
          <div className="flex flex-wrap gap-3">
            {['#ffffff', '#0f172a', '#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#64748b', '#1e1b4b'].map(c => (
              <button 
                key={c} 
                onClick={() => setGarmentColor(c === '#ffffff' ? 'transparent' : c)}
                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110" 
                style={{ backgroundColor: c, borderColor: garmentColor === c || (garmentColor === 'transparent' && c === '#ffffff') ? '#fff' : 'rgba(255,255,255,0.2)' }}
              ></button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400 flex justify-between">Design Scale: <span className="text-white">{designScale}%</span></label>
          <input type="range" min="10" max="200" value={designScale} onChange={e => setDesignScale(e.target.value)} className="w-full accent-red-600" />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400 flex justify-between">Rotation: <span className="text-white">{designRotate}°</span></label>
          <input type="range" min="0" max="360" value={designRotate} onChange={e => setDesignRotate(e.target.value)} className="w-full accent-red-600" />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400 flex justify-between">Opacity: <span className="text-white">{designOpacity}%</span></label>
          <input type="range" min="0" max="100" value={designOpacity} onChange={e => setDesignOpacity(e.target.value)} className="w-full accent-red-600" />
        </div>

        {/* Custom Text */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-400">Custom Text</label>
          <input type="text" placeholder="Type text here..." value={textInputVal} onChange={e => setTextInputVal(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600" />
          
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-2 mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Color</label>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-8 p-0 border-none bg-transparent cursor-pointer rounded" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Size</label>
              <input type="range" min="10" max="100" value={textSize} onChange={e => setTextSize(e.target.value)} className="w-full accent-red-600 mt-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Font</label>
              <select value={textFont} onChange={e => setTextFont(e.target.value)} className="w-full p-1.5 bg-black border border-zinc-800 text-white rounded text-xs outline-none">
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Times New Roman', serif">Serif</option>
                <option value="'Courier New', monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="Impact, sans-serif">Impact</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button onClick={() => setCustomText(textInputVal)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">Update Text</button>
            <button onClick={() => { setCustomText(''); setTextInputVal(''); }} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 py-2 rounded-lg font-medium transition-colors text-sm">Delete</button>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
          <button onClick={handleSaveDesign} className="flex-2 flex justify-center items-center gap-2 bg-red-700 hover:bg-red-800 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-lg shadow-red-600/25 flex-grow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Save & Add to Cart
          </button>
          <button onClick={() => setCurrentView('home')} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {renderSidebar()}
      
      <div className="flex-grow flex flex-col relative overflow-hidden">
        {renderHeader()}
        
        <main className="flex-grow relative flex justify-center items-center overflow-hidden">


          {currentView === 'home' && renderHomeView()}
          {currentView === 'drops' && renderDropsView()}
          {currentView === 'cart' && renderCartView()}
          {currentView === 'orders' && renderOrdersView()}
          {currentView === 'settings' && renderSettingsView()}
          {currentView === 'profile' && renderProfileView()}
          {currentView === 'editor' && renderEditorView()}
        </main>
      </div>

      {/* Hidden File Input */}
      <input type="file" ref={uploadInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-12 right-0 text-white hover:text-zinc-300 text-4xl cursor-pointer bg-transparent border-none" onClick={() => setPreviewImage(null)}>&times;</button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
