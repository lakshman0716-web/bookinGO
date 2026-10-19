import fs from 'fs';
import path from 'path';

const dirs = [
  'src/components',
  'src/components/3d',
  'src/pages',
  'src/data',
  'src/store',
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {
  'src/data/mockData.ts': `
export const events = [
  {
    id: '1',
    title: 'TechFest 2026',
    category: 'Technology',
    date: 'April 18, 2026',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    seats: 1200,
    available: 86,
    price: 0,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    organizer: 'Computer Science Dept'
  },
  {
    id: '2',
    title: 'AI & Future Workshop',
    category: 'Workshop',
    date: 'April 20, 2026',
    time: '02:00 PM',
    venue: 'Innovation Lab',
    seats: 150,
    available: 0, // Waitlist demo
    price: 15,
    image: 'https://images.unsplash.com/photo-1485827404727-8a37ddea62d4?w=800&q=80',
    organizer: 'AI Club'
  },
  {
    id: '3',
    title: 'Campus Hackathon',
    category: 'Hackathon',
    date: 'April 25, 2026',
    time: '09:00 AM',
    venue: 'Innovation Center',
    seats: 500,
    available: 73,
    price: 0,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    organizer: 'Hackers Guild'
  }
];

export const categories = ['All', 'Technology', 'Workshop', 'Hackathon', 'Cultural', 'Sports', 'Business'];
  `,

  'src/components/Navbar.tsx': `
import { Link } from 'react-router-dom';
import { Ticket, Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-white">
          <Ticket className="text-accent-primary" />
          <span>bookinGO</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/explore" className="hover:text-white transition">Explore</Link>
          <Link to="/dashboard" className="hover:text-white transition">My Bookings</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-text-secondary hover:text-white rounded-full bg-white/5"><Search size={20} /></button>
          <button className="p-2 text-text-secondary hover:text-white rounded-full bg-white/5"><Bell size={20} /></button>
          <button className="hidden md:flex px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full font-medium transition">
            Create Event
          </button>
          <button className="p-2 text-white rounded-full bg-white/10"><User size={20} /></button>
        </div>
      </div>
    </nav>
  );
}
  `,

  'src/pages/Home.tsx': `
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, PresentationControls, Environment } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Ticket3D() {
  return (
    <Float rotationIntensity={0.5} floatIntensity={2} speed={2}>
      <PresentationControls polar={[-0.1, 0.1]} azimuth={[-0.2, 0.2]} config={{ mass: 2, tension: 400 }}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 5, 0.1]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
        </mesh>
      </PresentationControls>
    </Float>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-accent-primary/20 to-transparent blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-7xl font-heading font-bold leading-tight">
            Your Events. <br />
            <span className="text-gradient">Your Seat.</span> <br />
            Your Experience.
          </h1>
          <p className="text-xl text-text-secondary max-w-lg">
            Discover college events, workshops, hackathons and experiences. Book your seat instantly with bookinGO.
          </p>
          <div className="flex gap-4">
            <Link to="/explore" className="px-8 py-4 bg-accent-primary text-white rounded-full font-semibold hover:bg-accent-primary/90 transition flex items-center gap-2">
              Explore Events <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
        
        <div className="h-[600px] w-full relative">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Ticket3D />
            <Environment preset="city" />
          </Canvas>
          
          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-20 right-10 glass-card px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            247 Seats Booked
          </motion.div>
        </div>
      </div>
    </div>
  );
}
  `,

  'src/pages/Explore.tsx': `
import { events, categories } from '../data/mockData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Explore() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Discover your next experience</h1>
      
      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map(c => (
          <button key={c} className="px-6 py-2 rounded-full glass-card hover:bg-white/10 transition whitespace-nowrap">
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium">
                {event.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-text-secondary text-sm mb-4">{event.date} • {event.venue}</p>
              
              <div className="flex items-center justify-between mt-6">
                <span className="font-semibold text-lg">{event.price === 0 ? 'Free' : '$'+event.price}</span>
                <Link to={\`/event/\${event.id}\`} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition text-sm">
                  {event.available === 0 ? 'Join Waitlist' : 'Book Now'}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
  `,

  'src/pages/EventDetails.tsx': `
import { useParams } from 'react-router-dom';
import { events } from '../data/mockData';
import { motion } from 'framer-motion';

export default function EventDetails() {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  if (!event) return <div>Event not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <motion.img 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={event.image} 
          alt={event.title} 
          className="w-full h-[400px] object-cover rounded-3xl"
        />
        <h1 className="text-5xl font-heading font-bold">{event.title}</h1>
        <div className="flex gap-4 text-text-secondary">
          <span>{event.date}</span>
          <span>•</span>
          <span>{event.venue}</span>
        </div>
      </div>
      
      <div className="lg:col-span-1 relative">
        <div className="sticky top-28 glass-panel p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-6">Reserve Your Seat</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-text-secondary">Available Seats</span>
              <span className="font-medium">{event.available} / {event.seats}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Price</span>
              <span className="font-medium">{event.price === 0 ? 'Free' : '$'+event.price}</span>
            </div>
          </div>
          
          <button className="w-full py-4 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-xl font-bold text-lg transition">
            {event.available === 0 ? 'Join Waitlist' : 'Book Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
  `,

  'src/pages/Dashboard.tsx': `
export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">My Bookings</h1>
      <div className="glass-panel rounded-3xl p-12 text-center text-text-secondary">
        <p>Your next experience is waiting.</p>
        <button className="mt-4 px-6 py-2 bg-accent-primary text-white rounded-full">Explore Events</button>
      </div>
    </div>
  );
}
  `
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(path.join(process.cwd(), filepath), content.trim());
});

console.log("Scaffold complete.");
