import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, PlusSquare, Film, User, Heart, MessageCircle, Send, Bookmark,
  MoreHorizontal, Compass, Sparkles, Image as ImageIcon, Smile, X, Check,
  Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, Settings, Grid,
  UserPlus, UserMinus, ShieldCheck, Share2, Trash2, Edit3, Camera, MapPin, Eye,
  Sliders, Wand2, Sticker, Layers, Zap, Flame, Award, Globe, Music
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut
} from 'firebase/auth';
import { 
  getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, addDoc, 
  deleteDoc, query, serverTimestamp 
} from 'firebase/firestore';

const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
let app, auth, db;

if (firebaseConfigStr) {
  try {
    const firebaseConfig = JSON.parse(firebaseConfigStr);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase setup failed, using local mode", e);
  }
}
const appId = typeof __app_id !== 'undefined' ? __app_id : 'insta-clone-app';

const PRESET_GALLERY = [
  { label: 'Cyberpunk City', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Tokyo Rain', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Northern Lights', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Minimal Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Gourmet Ramen', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Neon Skate', url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Abstract 3D Glass', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Tropical Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Cozy Cafe Latte', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Futuristic Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000' }
];

const SEED_USERS = [
  {
    id: 'user_alex',
    username: 'alex_dev',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: '⚡ Tech lead & UI Architect\n🚀 Building the future of social apps\n📍 San Francisco, CA',
    followersCount: 1420,
    followingCount: 389,
    verified: true,
  },
  {
    id: 'user_aura',
    username: 'cyber_aura',
    name: 'Aura Vance',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    bio: '🌌 Digital Artist & Cyberpunk Enthusiast\n🔮 Creating surreal neon dimensions\n✨ commissions open',
    followersCount: 3290,
    followingCount: 210,
    verified: true,
  },
  {
    id: 'user_luna',
    username: 'luna_design',
    name: 'Luna Chen',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    bio: '🎨 UI/UX Designer & Minimalist\n🌿 Coffee & clean lines lover',
    followersCount: 890,
    followingCount: 412,
    verified: false,
  },
  {
    id: 'user_marco',
    username: 'marco_cooks',
    name: 'Marco Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: '🍝 Chef & Gastronomy Explorer\n🔥 Handcrafted pasta & wood-fired pizza\n📍 Florence / NYC',
    followersCount: 4520,
    followingCount: 530,
    verified: true,
  },
  {
    id: 'user_sara',
    username: 'sara_travels',
    name: 'Sara Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: '✈️ 42 Countries & Counting\n🏔️ Alpine hiking & landscape photography\n📷 Shot on Sony A7IV',
    followersCount: 6810,
    followingCount: 310,
    verified: true,
  },
  {
    id: 'user_kai',
    username: 'kai_fit',
    name: 'Kai Nakamura',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    bio: '🏋️‍♂️ Calisthenics & Movement\n🧠 Mindset + Hydration + Consistency',
    followersCount: 2190,
    followingCount: 180,
    verified: false,
  },
  {
    id: 'user_elena',
    username: 'elena_style',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    bio: '👠 High Fashion & Sustainable Outfits\n✨ Paris Fashion Week Highlights in Bio',
    followersCount: 12400,
    followingCount: 640,
    verified: true,
  }
];

const SEED_STORIES = [
  {
    id: 'story_1',
    userId: 'user_aura',
    username: 'cyber_aura',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800', sticker: '✨ Tokyo Sunset', filter: 'neon' },
      { imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800', sticker: '🔮 Cyber Nights', filter: 'purple' }
    ],
    viewersCount: 142,
    timestamp: Date.now() - 3600000
  },
  {
    id: 'story_2',
    userId: 'user_luna',
    username: 'luna_design',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800', sticker: '☕ Morning Brew', filter: 'warm' },
      { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', sticker: '💻 Desk Essentials', filter: 'clean' }
    ],
    viewersCount: 98,
    timestamp: Date.now() - 5400000
  },
  {
    id: 'story_3',
    userId: 'user_sara',
    username: 'sara_travels',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', sticker: '🏔️ Swiss Alps Hike', filter: 'crisp' },
      { imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800', sticker: '🌌 Aurora Borealis', filter: 'cool' }
    ],
    viewersCount: 310,
    timestamp: Date.now() - 7200000
  },
  {
    id: 'story_4',
    userId: 'user_marco',
    username: 'marco_cooks',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800', sticker: '🍜 Fresh Tonkotsu', filter: 'vintage' }
    ],
    viewersCount: 215,
    timestamp: Date.now() - 10800000
  },
  {
    id: 'story_5',
    userId: 'user_elena',
    username: 'elena_style',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=800', sticker: '👠 Runway Prep', filter: 'glam' }
    ],
    viewersCount: 480,
    timestamp: Date.now() - 14400000
  },
  {
    id: 'story_6',
    userId: 'user_kai',
    username: 'kai_fit',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800', sticker: '🏜️ Dune Run 6AM', filter: 'warm' }
    ],
    viewersCount: 175,
    timestamp: Date.now() - 18000000
  },
  {
    id: 'story_7',
    userId: 'user_alex',
    username: 'alex_dev',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    slides: [
      { imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', sticker: '🎨 3D Shader Experiment', filter: 'neon' }
    ],
    viewersCount: 260,
    timestamp: Date.now() - 21600000
  }
];

const SEED_POSTS = [
  {
    id: 'post_1',
    userId: 'user_aura',
    username: 'cyber_aura',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1000'
    ],
    caption: 'Neon dreams in Tokyo nights 🌌 Discovered these hidden alleyways filled with cyberpunk lighting and rain reflections.',
    location: 'Shinjuku, Tokyo',
    likes: ['user_alex', 'user_luna', 'user_sara', 'user_marco'],
    comments: [
      { id: 'c1', userId: 'user_alex', username: 'alex_dev', text: 'Insane color grading! What lens are you using?', timestamp: Date.now() - 3600000 },
      { id: 'c2', userId: 'user_luna', username: 'luna_design', text: 'Love the purple tone vibes! ✨', timestamp: Date.now() - 1800000 }
    ],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'post_2',
    userId: 'user_sara',
    username: 'sara_travels',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000'
    ],
    caption: '4 stopovers in 4 days 🏔️ Swipe left to go from the Swiss Alps summit down to the Northern Lights night sky!',
    location: 'Zermatt, Switzerland',
    likes: ['user_aura', 'user_alex', 'user_elena', 'user_kai'],
    comments: [
      { id: 'c3', userId: 'user_kai', username: 'kai_fit', text: 'That summit view is unreal 🏔️💪', timestamp: Date.now() - 2500000 }
    ],
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'post_3',
    userId: 'user_marco',
    username: 'marco_cooks',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000'
    ],
    caption: 'Handcrafted broth simmered for 18 hours 🍜 Paired with artisanal espresso roast for a mid-afternoon boost.',
    location: 'Kyoto, Japan',
    likes: ['user_luna', 'user_aura', 'user_alex'],
    comments: [
      { id: 'c4', userId: 'user_luna', username: 'luna_design', text: 'Now I am craving ramen at 11 PM! 🤤', timestamp: Date.now() - 1200000 }
    ],
    createdAt: Date.now() - 14400000,
  },
  {
    id: 'post_4',
    userId: 'user_alex',
    username: 'alex_dev',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'
    ],
    caption: 'Late night coding setup ready! ☕ React + Tailwind + Firestore is the ultimate stack for speed and elegance.',
    location: 'Silicon Valley, CA',
    likes: ['user_aura', 'user_sara'],
    comments: [
      { id: 'c5', userId: 'user_aura', username: 'cyber_aura', text: 'Clean setup bro! Love the ambient lighting 🔥', timestamp: Date.now() - 800000 }
    ],
    createdAt: Date.now() - 18000000,
  },
  {
    id: 'post_5',
    userId: 'user_elena',
    username: 'elena_style',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000'
    ],
    caption: 'Monochrome urban aesthetics 🕶️ Minimalist cuts meeting brutalist architecture.',
    location: 'Paris, France',
    likes: ['user_sara', 'user_luna', 'user_aura', 'user_marco', 'user_kai'],
    comments: [],
    createdAt: Date.now() - 21600000,
  }
];

const SEED_REELS = [
  {
    id: 'reel_1',
    username: 'cyber_aura',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-lights-in-a-futuristic-city-43187-large.mp4',
    caption: 'Tokyo Synthwave Vibes 🌃 #cyberpunk #tokyo #nightlife',
    audio: 'CyberAura • Synthwave Original Sound',
    likes: 1240,
    commentsCount: 89,
    isLiked: false
  },
  {
    id: 'reel_2',
    username: 'alex_dev',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-43194-large.mp4',
    caption: '5 Tips for Clean Code Architecture 💻🚀',
    audio: 'AlexDev • Tech Beats Vol. 1',
    likes: 2890,
    commentsCount: 142,
    isLiked: true
  },
  {
    id: 'reel_3',
    username: 'sara_travels',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    caption: 'Chasing ocean waves at dawn 🌊 Maldives drone footage',
    audio: 'SaraTravels • Ambient Chill Waves',
    likes: 3410,
    commentsCount: 204,
    isLiked: false
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState(SEED_POSTS);
  const [users, setUsers] = useState(SEED_USERS);
  const [stories, setStories] = useState(SEED_STORIES);
  const [reels, setReels] = useState(SEED_REELS);
  const [followingMap, setFollowingMap] = useState({ 'user_aura': true, 'user_sara': true });
  const [savedPosts, setSavedPosts] = useState([]);
  
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [activeStoryViewer, setActiveStoryViewer] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [commentModalPost, setCommentModalPost] = useState(null);
  const [shareModalPost, setShareModalPost] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'like', username: 'cyber_aura', userAvatar: SEED_USERS[1].avatar, text: 'liked your multi-image carousel.', time: '2h ago', read: false },
    { id: 'n2', type: 'follow', username: 'sara_travels', userAvatar: SEED_USERS[4].avatar, text: 'started following you.', time: '4h ago', read: false },
    { id: 'n3', type: 'comment', username: 'marco_cooks', userAvatar: SEED_USERS[3].avatar, text: 'commented: "Incredible shot!"', time: '6h ago', read: true }
  ]);
  const [doubleTapAnimation, setDoubleTapAnimation] = useState(null);

  useEffect(() => {
    const defaultMe = {
      id: 'my_account',
      username: 'you_creator',
      name: 'You (Creator)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      bio: '🚀 Digital Creator | Building sleek interactive web applications',
      followersCount: 512,
      followingCount: 2,
      verified: true
    };

    if (!auth || !db) {
      setCurrentUser(defaultMe);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setCurrentUser(defaultMe);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          ...defaultMe,
          id: user.uid,
          username: user.email ? user.email.split('@')[0] : 'creative_user'
        });
      } else {
        setCurrentUser(defaultMe);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !currentUser) return;

    try {
      const postsRef = collection(db, 'artifacts', appId, 'public', 'data', 'posts');
      const unsubscribePosts = onSnapshot(postsRef, (snapshot) => {
        if (!snapshot.empty) {
          const loadedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(loadedPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        }
      }, (err) => console.log("Firestore fallback:", err));

      return () => unsubscribePosts();
    } catch (e) {
      console.warn("Firestore listener fallback.");
    }
  }, [currentUser]);

  const handleToggleLike = (postId) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(currentUser.id);
        const updatedLikes = hasLiked
          ? post.likes.filter(id => id !== currentUser.id)
          : [...post.likes, currentUser.id];
        return { ...post, likes: updatedLikes };
      }
      return post;
    }));
  };

  const handleDoubleTap = (postId) => {
    setDoubleTapAnimation(postId);
    setTimeout(() => setDoubleTapAnimation(null), 1000);
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId && !post.likes.includes(currentUser.id)) {
        return { ...post, likes: [...post.likes, currentUser.id] };
      }
      return post;
    }));
  };

  const handleAddComment = (postId, text) => {
    if (!text.trim() || !currentUser) return;
    const newComment = {
      id: `comment_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      text: text.trim(),
      timestamp: Date.now()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    if (commentModalPost && commentModalPost.id === postId) {
      setCommentModalPost(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
    }
  };

  const handleToggleFollow = (userId) => {
    setFollowingMap(prev => {
      const isFollowing = !!prev[userId];
      const nextState = { ...prev, [userId]: !isFollowing };
      
      setUsers(uList => uList.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            followersCount: isFollowing ? Math.max(0, u.followersCount - 1) : u.followersCount + 1
          };
        }
        return u;
      }));
      return nextState;
    });
  };

  const handleToggleBookmark = (postId) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleCreatePost = (newPostData) => {
    const createdPost = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      verified: currentUser.verified,
      images: newPostData.images,
      caption: newPostData.caption,
      location: newPostData.location || '',
      likes: [],
      comments: [],
      createdAt: Date.now()
    };

    setPosts(prev => [createdPost, ...prev]);

    if (db) {
      try {
        const postDoc = doc(db, 'artifacts', appId, 'public', 'data', 'posts', createdPost.id);
        setDoc(postDoc, createdPost);
      } catch (e) {
        console.error("Firestore post publish error:", e);
      }
    }
    setIsCreateModalOpen(false);
  };

  const handleCreateStory = (storySlides) => {
    const newStory = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      slides: storySlides,
      viewersCount: 1,
      timestamp: Date.now()
    };

    setStories(prev => [newStory, ...prev]);
    setIsCreateStoryModalOpen(false);
  };

  const activeProfileUser = selectedProfileId 
    ? users.find(u => u.id === selectedProfileId) || (selectedProfileId === currentUser?.id ? currentUser : SEED_USERS[0])
    : currentUser;

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-slate-100 flex flex-col md:flex-row antialiased font-sans selection:bg-purple-500 selection:text-white">
      
      {/* ================= DESKTOP LEFT SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-neutral-800/80 p-4 sticky top-0 h-screen bg-[#0d0d12] z-30 justify-between">
        <div className="space-y-6">
          <div className="px-3 py-2 flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedProfileId(null); }}>
            <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-2xl shadow-lg shadow-pink-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
              InstaPulse
            </span>
          </div>

          <nav className="space-y-1">
            <SidebarNavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setSelectedProfileId(null); }} />
            <SidebarNavItem icon={<Search />} label="Search" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            <SidebarNavItem icon={<Compass />} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
            <SidebarNavItem icon={<Film />} label="Reels" active={activeTab === 'reels'} onClick={() => setActiveTab('reels')} />
            <SidebarNavItem icon={<MessageCircle />} label="Messages" active={activeTab === 'dms'} badge={3} onClick={() => setActiveTab('dms')} />
            <SidebarNavItem icon={<Heart />} label="Notifications" active={activeTab === 'notifications'} badge={notifications.filter(n=>!n.read).length} onClick={() => setActiveTab('notifications')} />
            <SidebarNavItem icon={<PlusSquare />} label="Create Post" active={isCreateModalOpen} onClick={() => setIsCreateModalOpen(true)} highlight />
            <SidebarNavItem icon={<Wand2 />} label="Add Story" active={isCreateStoryModalOpen} onClick={() => setIsCreateStoryModalOpen(true)} />
            <SidebarNavItem 
              icon={<Avatar src={currentUser?.avatar} size="w-6 h-6" />} 
              label="Profile" 
              active={activeTab === 'profile' && !selectedProfileId} 
              onClick={() => { setSelectedProfileId(null); setActiveTab('profile'); }} 
            />
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedProfileId(null); setActiveTab('profile'); }}>
            <Avatar src={currentUser?.avatar} size="w-10 h-10" ring />
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{currentUser?.username}</p>
              <p className="text-xs text-neutral-400 truncate">{currentUser?.name}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditProfileOpen(true)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition"
            title="Edit Profile"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 flex justify-center min-h-screen pb-20 md:pb-0 overflow-x-hidden">
        <div className="w-full max-w-5xl px-0 sm:px-4 py-0 sm:py-6 flex gap-8 justify-center">
          
          <div className="flex-1 max-w-2xl w-full">
            
            {/* View: Home Feed */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* Story Highlights Bar */}
                <StoryTray 
                  stories={stories} 
                  currentUser={currentUser} 
                  onSelectStory={(s) => setActiveStoryViewer(s)} 
                  onAddStory={() => setIsCreateStoryModalOpen(true)}
                />

                {/* Feed Posts List */}
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      currentUserId={currentUser?.id}
                      isLiked={post.likes.includes(currentUser?.id)}
                      isSaved={savedPosts.includes(post.id)}
                      doubleTapActive={doubleTapAnimation === post.id}
                      onLike={() => handleToggleLike(post.id)}
                      onDoubleTap={() => handleDoubleTap(post.id)}
                      onOpenComments={() => setCommentModalPost(post)}
                      onOpenShare={() => setShareModalPost(post)}
                      onBookmark={() => handleToggleBookmark(post.id)}
                      onUserClick={(uId) => { setSelectedProfileId(uId); setActiveTab('profile'); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* View: Search & Discover */}
            {activeTab === 'search' && (
              <SearchView 
                users={users} 
                posts={posts}
                followingMap={followingMap}
                onToggleFollow={handleToggleFollow}
                onSelectUser={(uId) => { setSelectedProfileId(uId); setActiveTab('profile'); }}
                onOpenPost={(p) => setCommentModalPost(p)}
              />
            )}

            {/* View: Explore Grid */}
            {activeTab === 'explore' && (
              <ExploreGrid posts={posts} onSelectPost={(p) => setCommentModalPost(p)} />
            )}

            {/* View: Short Video Reels */}
            {activeTab === 'reels' && (
              <ReelsView reels={reels} onToggleLike={(rId) => {
                setReels(prev => prev.map(r => r.id === rId ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r));
              }} />
            )}

            {/* View: Direct Messages */}
            {activeTab === 'dms' && (
              <DirectMessagesView users={users} currentUser={currentUser} />
            )}

            {/* View: Notifications */}
            {activeTab === 'notifications' && (
              <NotificationsView notifications={notifications} onSelectUser={(uId) => { setSelectedProfileId(uId); setActiveTab('profile'); }} />
            )}

            {/* View: User Profile */}
            {activeTab === 'profile' && (
              <ProfileView 
                user={activeProfileUser}
                isSelf={activeProfileUser.id === currentUser?.id}
                isFollowing={!!followingMap[activeProfileUser.id]}
                posts={posts.filter(p => p.userId === activeProfileUser.id || p.username === activeProfileUser.username)}
                savedPosts={posts.filter(p => savedPosts.includes(p.id))}
                onToggleFollow={() => handleToggleFollow(activeProfileUser.id)}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onSelectPost={(p) => setCommentModalPost(p)}
              />
            )}

          </div>

          {/* ================= DESKTOP RIGHT SUGGESTIONS SIDEBAR ================= */}
          {activeTab === 'home' && (
            <aside className="hidden lg:block w-80 space-y-6 pt-2">
              <div className="flex items-center justify-between bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/50">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedProfileId(null); setActiveTab('profile'); }}>
                  <Avatar src={currentUser?.avatar} size="w-12 h-12" ring />
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-1">
                      {currentUser?.username}
                      {currentUser?.verified && <ShieldCheck className="w-4 h-4 text-purple-400 inline fill-purple-400/20" />}
                    </p>
                    <p className="text-xs text-neutral-400">{currentUser?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-xs text-purple-400 font-semibold hover:text-purple-300"
                >
                  Switch
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-neutral-400 font-semibold">Suggested for you</span>
                  <button onClick={() => setActiveTab('search')} className="text-slate-200 font-semibold hover:underline">See All</button>
                </div>

                <div className="space-y-3">
                  {users.map(u => {
                    const isFollowing = !!followingMap[u.id];
                    return (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-900/40 transition">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedProfileId(u.id); setActiveTab('profile'); }}>
                          <Avatar src={u.avatar} size="w-10 h-10" />
                          <div>
                            <p className="font-semibold text-xs flex items-center gap-1">
                              {u.username}
                              {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                            </p>
                            <p className="text-[11px] text-neutral-400 truncate max-w-[120px]">{u.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggleFollow(u.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                            isFollowing 
                              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                              : 'text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 space-y-2 px-1">
                <p>About • Help • Press • API • Jobs • Privacy • Terms</p>
                <p>© 2026 INSTAPULSE FROM CREATIVE LABS</p>
              </div>
            </aside>
          )}

        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d12]/95 backdrop-blur-md border-t border-neutral-800/80 px-4 py-2.5 flex justify-around items-center z-40">
        <button onClick={() => { setActiveTab('home'); setSelectedProfileId(null); }} className={`p-2 ${activeTab === 'home' ? 'text-purple-400' : 'text-neutral-400'}`}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('search')} className={`p-2 ${activeTab === 'search' ? 'text-purple-400' : 'text-neutral-400'}`}>
          <Search className="w-6 h-6" />
        </button>
        <button onClick={() => setIsCreateModalOpen(true)} className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg shadow-pink-500/20">
          <PlusSquare className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('reels')} className={`p-2 ${activeTab === 'reels' ? 'text-purple-400' : 'text-neutral-400'}`}>
          <Film className="w-6 h-6" />
        </button>
        <button onClick={() => { setSelectedProfileId(null); setActiveTab('profile'); }} className={`p-1 rounded-full ${activeTab === 'profile' ? 'ring-2 ring-purple-500' : ''}`}>
          <Avatar src={currentUser?.avatar} size="w-6 h-6" />
        </button>
      </div>

      {/* ================= MODALS & OVERLAYS ================= */}
      
      {/* 1. Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreatePost}
        />
      )}

      {/* 2. Create Story Modal */}
      {isCreateStoryModalOpen && (
        <CreateStoryModal 
          onClose={() => setIsCreateStoryModalOpen(false)}
          onSubmit={handleCreateStory}
        />
      )}

      {/* 3. Comments Modal / Drawer */}
      {commentModalPost && (
        <CommentsModal 
          post={commentModalPost} 
          currentUserId={currentUser?.id}
          onClose={() => setCommentModalPost(null)}
          onAddComment={(text) => handleAddComment(commentModalPost.id, text)}
        />
      )}

      {/* 4. Share Modal */}
      {shareModalPost && (
        <ShareModal 
          post={shareModalPost}
          onClose={() => setShareModalPost(null)}
        />
      )}

      {/* 5. Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal 
          user={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updated) => {
            setCurrentUser(prev => ({ ...prev, ...updated }));
            setIsEditProfileOpen(false);
          }}
        />
      )}

      {/* 6. Multi-Slide Story Viewer Overlay */}
      {activeStoryViewer && (
        <StoryViewerOverlay 
          story={activeStoryViewer} 
          onClose={() => setActiveStoryViewer(null)} 
        />
      )}

    </div>
  );
}

function SidebarNavItem({ icon, label, active, onClick, badge, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition font-medium text-sm group ${
        active 
          ? 'bg-neutral-800/80 text-purple-400 font-bold' 
          : 'text-neutral-300 hover:bg-neutral-800/40 hover:text-white'
      } ${highlight ? 'text-pink-400' : ''}`}
    >
      <div className="relative group-hover:scale-110 transition-transform duration-200">
        {icon}
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
            {badge}
          </span>
        )}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
}

function Avatar({ src, size = "w-10 h-10", ring = false }) {
  return (
    <div className={`relative rounded-full flex items-center justify-center p-[2px] ${
      ring ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-neutral-800'
    }`}>
      <img 
        src={src || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'} 
        alt="Avatar" 
        className={`${size} rounded-full object-cover border-2 border-[#0d0d12] bg-neutral-900`}
      />
    </div>
  );
}

function StoryTray({ stories, currentUser, onSelectStory, onAddStory }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-[#0d0d12] border border-neutral-800/80 rounded-2xl overflow-x-auto no-scrollbar shadow-md">
      {/* Create Story Button */}
      <div className="flex flex-col items-center gap-1.5 min-w-[68px] cursor-pointer group" onClick={onAddStory}>
        <div className="relative">
          <Avatar src={currentUser?.avatar} size="w-14 h-14" />
          <div className="absolute bottom-0 right-0 bg-purple-500 text-white p-1 rounded-full ring-2 ring-[#0d0d12] group-hover:scale-110 transition">
            <PlusSquare className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white transition">Your story</span>
      </div>

      {/* User Stories List */}
      {stories.map(s => (
        <div 
          key={s.id} 
          onClick={() => onSelectStory(s)}
          className="flex flex-col items-center gap-1.5 min-w-[68px] cursor-pointer group"
        >
          <Avatar src={s.userAvatar} size="w-14 h-14" ring />
          <span className="text-[11px] font-medium text-neutral-300 truncate w-16 text-center group-hover:text-purple-400 transition">
            {s.username}
          </span>
        </div>
      ))}
    </div>
  );
}

function PostCard({ post, currentUserId, isLiked, isSaved, doubleTapActive, onLike, onDoubleTap, onOpenComments, onOpenShare, onBookmark, onUserClick }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  return (
    <article className="bg-[#0d0d12] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-neutral-800/40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onUserClick(post.userId)}>
          <Avatar src={post.userAvatar} size="w-9 h-9" ring />
          <div>
            <p className="font-semibold text-xs flex items-center gap-1">
              {post.username}
              {post.verified && <ShieldCheck className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />}
            </p>
            {post.location && <p className="text-[10px] text-neutral-400">{post.location}</p>}
          </div>
        </div>
        <button className="text-neutral-400 hover:text-white p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Image Container with Carousel & Double Tap */}
      <div className="relative aspect-square bg-neutral-900 group select-none overflow-hidden" onDoubleClick={onDoubleTap}>
        <img 
          src={post.images[currentImageIdx]} 
          alt="Post" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Multi-Image Carousel Controls */}
        {post.images.length > 1 && (
          <>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white z-10">
              {currentImageIdx + 1}/{post.images.length}
            </div>
            {currentImageIdx > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(p => p - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentImageIdx < post.images.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(p => p + 1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {post.images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIdx ? 'bg-purple-500 w-4' : 'bg-white/50 w-1.5'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Double Tap Heart Pulse Effect */}
        {doubleTapActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 animate-ping">
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* Post Action Buttons */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onLike} className="transition transform active:scale-125">
              <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-300 hover:text-white'}`} />
            </button>
            <button onClick={onOpenComments} className="text-neutral-300 hover:text-white transition">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button onClick={onOpenShare} className="text-neutral-300 hover:text-white transition">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button onClick={onBookmark} className="text-neutral-300 hover:text-white transition">
            <Bookmark className={`w-6 h-6 ${isSaved ? 'text-purple-400 fill-purple-400' : ''}`} />
          </button>
        </div>

        {/* Likes Counter */}
        <p className="font-semibold text-xs text-neutral-200">
          {post.likes.length.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-xs space-x-1.5 leading-relaxed">
          <span className="font-bold text-slate-100 cursor-pointer hover:underline" onClick={() => onUserClick(post.userId)}>
            {post.username}
          </span>
          <span className="text-neutral-300">{post.caption}</span>
        </div>

        {/* Comment Preview */}
        {post.comments.length > 0 && (
          <button 
            onClick={onOpenComments} 
            className="text-[11px] text-neutral-400 hover:text-neutral-300 block pt-1"
          >
            View all {post.comments.length} comments
          </button>
        )}

        <p className="text-[10px] text-neutral-500 uppercase tracking-wider pt-0.5">
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </article>
  );
}

function CreatePostModal({ onClose, onSubmit }) {
  const [images, setImages] = useState([PRESET_GALLERY[0].url]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const handleSelectPreset = (url) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleAddCustom = () => {
    if (customUrl.trim() && !images.includes(customUrl.trim())) {
      setImages(prev => [...prev, customUrl.trim()]);
      setCustomUrl('');
    }
  };

  const handlePublish = () => {
    if (!images.length) return;
    onSubmit({ images, caption, location });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-neutral-800">
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
          <h3 className="font-bold text-sm">Create Multi-Image Post</h3>
          <button 
            onClick={handlePublish} 
            disabled={!images.length}
            className="text-purple-400 font-bold text-sm hover:text-purple-300 disabled:opacity-50"
          >
            Share
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Selected Images Gallery */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 flex justify-between">
              <span>Selected Images ({images.length})</span>
              <span className="text-[10px] text-purple-400">Add up to 5 photos</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-neutral-800">
                  <img src={img} alt="Selected" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Preset Gallery Picker */}
          <div className="space-y-2 pt-2 border-t border-neutral-800/60">
            <label className="text-xs font-semibold text-neutral-400">Pick from HD Presets</label>
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto no-scrollbar p-1">
              {PRESET_GALLERY.map((p, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectPreset(p.url)}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-neutral-800 hover:border-purple-500 transition group"
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-110 transition" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-neutral-300 truncate p-0.5">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Image URL */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Or paste custom image URL..." 
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button 
              onClick={handleAddCustom}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl text-white transition"
            >
              Add
            </button>
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-400">Caption</label>
            <textarea 
              rows="3" 
              placeholder="Write a caption..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Location
            </label>
            <input 
              type="text" 
              placeholder="Add location (e.g. Kyoto, Japan)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateStoryModal({ onClose, onSubmit }) {
  const [selectedImg, setSelectedImg] = useState(PRESET_GALLERY[0].url);
  const [stickerText, setStickerText] = useState('✨ Cyber Vibe');
  const [filterStyle, setFilterStyle] = useState('neon');

  const handlePublishStory = () => {
    onSubmit([
      { imageUrl: selectedImg, sticker: stickerText, filter: filterStyle }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <h3 className="font-bold text-sm">Add New Story</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Live Preview */}
        <div className="relative aspect-[9/16] max-h-[320px] mx-auto rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-black flex items-center justify-center">
          <img src={selectedImg} alt="Story Preview" className="w-full h-full object-cover" />
          {stickerText && (
            <div className="absolute top-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
              {stickerText}
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">Select Image</label>
          <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto no-scrollbar">
            {PRESET_GALLERY.map((p, idx) => (
              <img 
                key={idx} 
                src={p.url} 
                alt="Option" 
                onClick={() => setSelectedImg(p.url)}
                className={`aspect-square rounded-lg object-cover cursor-pointer border ${selectedImg === p.url ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-neutral-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Sticker Text */}
        <div>
          <label className="text-xs font-semibold text-neutral-400">Sticker Badge</label>
          <input 
            type="text" 
            value={stickerText}
            onChange={(e) => setStickerText(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
          />
        </div>

        <button 
          onClick={handlePublishStory}
          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 hover:opacity-90 transition"
        >
          Post to Story
        </button>
      </div>
    </div>
  );
}

function StoryViewerOverlay({ story, onClose }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slides = story.slides || [{ imageUrl: story.imageUrl, sticker: '✨ Vibe' }];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slideIdx < slides.length - 1) {
        setSlideIdx(prev => prev + 1);
      } else {
        onClose();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [slideIdx, slides]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 z-20 hover:bg-neutral-800 rounded-full">
        <X className="w-6 h-6" />
      </button>

      <div className="relative aspect-[9/16] h-[85vh] max-w-sm bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between">
        
        {/* Progress Bar */}
        <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div className={`h-full bg-white transition-all duration-300 ${idx === slideIdx ? 'w-full' : idx < slideIdx ? 'w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>

        {/* Header User Details */}
        <div className="absolute top-7 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <Avatar src={story.userAvatar} size="w-8 h-8" />
            <span className="font-bold text-xs text-white drop-shadow">{story.username}</span>
          </div>
          <span className="text-[10px] text-neutral-300 bg-black/40 px-2 py-0.5 rounded-full">
            <Eye className="w-3 h-3 inline mr-1" /> {story.viewersCount || 1}
          </span>
        </div>

        {/* Slide Image */}
        <img src={slides[slideIdx].imageUrl} alt="Story Slide" className="w-full h-full object-cover" />

        {/* Sticker Overlay */}
        {slides[slideIdx].sticker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20 shadow-lg z-20">
            {slides[slideIdx].sticker}
          </div>
        )}

        {/* Tap Navigators */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/2 h-full cursor-pointer" onClick={() => setSlideIdx(p => Math.max(0, p - 1))} />
          <div className="w-1/2 h-full cursor-pointer" onClick={() => setSlideIdx(p => (p < slides.length - 1 ? p + 1 : p))} />
        </div>
      </div>
    </div>
  );
}

function CommentsModal({ post, currentUserId, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#12121a] border border-neutral-800 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
        <div className="hidden md:block w-1/2 bg-black">
          <img src={post.images[0]} alt="Post detail" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 flex flex-col justify-between h-full bg-[#0d0d12]">
          <div className="flex justify-between items-center p-3.5 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Avatar src={post.userAvatar} size="w-8 h-8" />
              <span className="font-bold text-xs">{post.username}</span>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="text-xs text-neutral-300 pb-3 border-b border-neutral-800/60">
              <span className="font-bold mr-2">{post.username}</span>
              {post.caption}
            </div>

            {post.comments.map(c => (
              <div key={c.id} className="flex gap-3 text-xs">
                <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250" size="w-7 h-7" />
                <div className="flex-1 space-y-0.5">
                  <p>
                    <span className="font-bold text-slate-100 mr-2">{c.username}</span>
                    <span className="text-neutral-300">{c.text}</span>
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 flex gap-2">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="text-purple-400 font-bold text-xs px-2 hover:text-purple-300 disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SearchView({ users, posts, followingMap, onToggleFollow, onSelectUser, onOpenPost }) {
  const [queryText, setQueryText] = useState('');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(queryText.toLowerCase()) || 
    u.name.toLowerCase().includes(queryText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input 
          type="text" 
          placeholder="Search users or accounts..." 
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="w-full bg-[#0d0d12] border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {queryText && (
        <div className="space-y-2 bg-[#0d0d12] border border-neutral-800/80 p-3 rounded-2xl">
          <p className="text-xs font-semibold text-neutral-400 px-2">People</p>
          {filteredUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/40 transition">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectUser(u.id)}>
                <Avatar src={u.avatar} size="w-10 h-10" />
                <div>
                  <p className="font-semibold text-xs">{u.username}</p>
                  <p className="text-[11px] text-neutral-400">{u.name}</p>
                </div>
              </div>
              <button 
                onClick={() => onToggleFollow(u.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              >
                {followingMap[u.id] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-bold text-neutral-300">Explore Posts</p>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {posts.map(p => (
            <div 
              key={p.id} 
              onClick={() => onOpenPost(p)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
            >
              <img src={p.images[0]} alt="Grid" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-bold text-xs">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> {p.likes.length}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-white" /> {p.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreGrid({ posts, onSelectPost }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {posts.map(p => (
        <div 
          key={p.id} 
          onClick={() => onSelectPost(p)}
          className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl bg-neutral-900"
        >
          <img src={p.images[0]} alt="Explore" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        </div>
      ))}
    </div>
  );
}

function ReelsView({ reels, onToggleLike }) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      {reels.map(reel => (
        <div key={reel.id} className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
          <video 
            src={reel.videoUrl} 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />

          <div className="absolute right-3 bottom-12 flex flex-col items-center gap-5 text-white z-10">
            <button onClick={() => onToggleLike(reel.id)} className="flex flex-col items-center gap-1">
              <Heart className={`w-7 h-7 ${reel.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
              <span className="text-xs font-semibold">{reel.likes}</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7" />
              <span className="text-xs font-semibold">{reel.commentsCount}</span>
            </div>
            <Send className="w-7 h-7" />
          </div>

          <div className="absolute bottom-4 left-4 right-16 text-white space-y-2 z-10">
            <div className="flex items-center gap-2">
              <Avatar src={reel.userAvatar} size="w-8 h-8" />
              <span className="font-bold text-xs">{reel.username}</span>
            </div>
            <p className="text-xs line-clamp-2">{reel.caption}</p>
            <p className="text-[11px] text-neutral-300 flex items-center gap-1">
              🎵 {reel.audio}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DirectMessagesView({ users, currentUser }) {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'cyber_aura', text: 'Hey! Did you check out the new design drop?', time: '10:42 AM' },
    { id: 'm2', sender: 'you', text: 'Yes! Loved the purple gradients ✨', time: '10:45 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      setMessages(prev => [...prev, {
        id: `m_${Date.now()}`,
        sender: 'you',
        text: inputMsg.trim(),
        time: 'Just now'
      }]);
      setInputMsg('');
    }
  };

  return (
    <div className="bg-[#0d0d12] border border-neutral-800 rounded-2xl h-[75vh] flex overflow-hidden">
      <div className="w-1/3 border-r border-neutral-800 p-3 space-y-3">
        <h3 className="font-bold text-sm px-2">Messages</h3>
        {users.map(u => (
          <div 
            key={u.id} 
            onClick={() => setSelectedUser(u)}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${
              selectedUser?.id === u.id ? 'bg-neutral-800/80' : 'hover:bg-neutral-900/50'
            }`}
          >
            <Avatar src={u.avatar} size="w-10 h-10" />
            <div className="overflow-hidden hidden sm:block">
              <p className="font-semibold text-xs truncate">{u.username}</p>
              <p className="text-[10px] text-neutral-400 truncate">Active now</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="p-3 border-b border-neutral-800 flex items-center gap-3">
          <Avatar src={selectedUser?.avatar} size="w-8 h-8" />
          <span className="font-bold text-xs">{selectedUser?.username}</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3.5 py-2 rounded-2xl text-xs ${
                m.sender === 'you' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMsg} className="p-3 border-t border-neutral-800 flex gap-2">
          <input 
            type="text" 
            placeholder="Message..." 
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button type="submit" className="text-purple-400 font-bold text-xs px-2">Send</button>
        </form>
      </div>
    </div>
  );
}

function NotificationsView({ notifications, onSelectUser }) {
  return (
    <div className="bg-[#0d0d12] border border-neutral-800/80 rounded-2xl p-4 space-y-4">
      <h3 className="font-bold text-base">Notifications</h3>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/40 transition">
            <div className="flex items-center gap-3">
              <Avatar src={n.userAvatar} size="w-10 h-10" />
              <div className="text-xs">
                <span className="font-bold text-white mr-1">{n.username}</span>
                <span className="text-neutral-300">{n.text}</span>
                <span className="text-neutral-500 block text-[10px]">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user, isSelf, isFollowing, posts, savedPosts, onToggleFollow, onEditProfile, onSelectPost }) {
  const [activeTab, setActiveTab] = useState('grid');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#0d0d12] border border-neutral-800/80 rounded-2xl">
        <Avatar src={user.avatar} size="w-24 h-24" ring />
        
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-xl font-bold">{user.username}</h2>
            {isSelf ? (
              <button onClick={onEditProfile} className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 font-semibold text-xs rounded-xl transition">
                Edit profile
              </button>
            ) : (
              <button 
                onClick={onToggleFollow}
                className={`px-5 py-1.5 font-semibold text-xs rounded-xl transition ${
                  isFollowing ? 'bg-neutral-800 text-neutral-300' : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex justify-center sm:justify-start gap-6 text-xs">
            <span><strong className="text-white">{posts.length}</strong> posts</span>
            <span><strong className="text-white">{user.followersCount}</strong> followers</span>
            <span><strong className="text-white">{user.followingCount}</strong> following</span>
          </div>

          <div>
            <p className="font-bold text-sm">{user.name}</p>
            <p className="text-xs text-neutral-300 whitespace-pre-line mt-1">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center border-b border-neutral-800 gap-8 text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('grid')}
          className={`py-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'grid' ? 'border-purple-500 text-purple-400' : 'border-transparent text-neutral-400'
          }`}
        >
          <Grid className="w-4 h-4" /> POSTS
        </button>
        {isSelf && (
          <button 
            onClick={() => setActiveTab('saved')}
            className={`py-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'saved' ? 'border-purple-500 text-purple-400' : 'border-transparent text-neutral-400'
            }`}
          >
            <Bookmark className="w-4 h-4" /> SAVED
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(activeTab === 'grid' ? posts : savedPosts).map(p => (
          <div 
            key={p.id} 
            onClick={() => onSelectPost(p)}
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
          >
            <img src={p.images[0]} alt="Post grid" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-neutral-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-sm">Edit Profile</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-neutral-400">Avatar Image URL</label>
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-400">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-400">Bio</label>
            <textarea 
              rows="3"
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none mt-1"
            />
          </div>
        </div>

        <button 
          onClick={() => onSave({ name, bio, avatar })}
          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 hover:opacity-90 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function ShareModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12121a] border border-neutral-800 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <h3 className="font-bold text-sm">Share Post</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={window.location.href}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300"
          />
          <button 
            onClick={handleCopy}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}