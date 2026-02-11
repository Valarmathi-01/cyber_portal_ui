import React from 'react';
import { Link} from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, FileText, Phone, Lock, UserX, CreditCard, Users, ArrowRight, PlayCircle, Shield, MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function LandingPage() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  
  type Message = {
    id: number;
    content: React.ReactNode;
    sender: 'user' | 'bot';
    options?: string[];
  };

  const initialMessage: Message = {
    id: 1,
    content: "Hi! How can I help you today?",
    sender: 'bot',
    options: [
      "How to file a complaint?",
      "What documents/evidence needed?",
      "How to track my complaint status?",
      "Forgot password / login issue",
      "Helpline and support contact"
    ]
  };

  const [messages, setMessages] = React.useState<Message[]>([initialMessage]);

  const toggleChat = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      setMessages([initialMessage]); // Fresh start
      setIsChatOpen(true);
    }
  };

  React.useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now(), content: option, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    // Bot response logic
    setTimeout(() => {
      let botResponses: Message[] = [];
      
      // Common follow-up
      const followUp: Message = {
        id: Date.now() + 100,
        content: "Is there anything else I can help you with?",
        sender: 'bot',
        options: ["Yes", "No"]
      };

      if (option === "Yes") {
        setMessages(prev => [...prev, { ...initialMessage, id: Date.now() }]);
        return;
      }

      if (option === "No") {
        setMessages(prev => [...prev, { id: Date.now(), content: "Thanks for contacting support.", sender: 'bot' }]);
        return;
      }

      switch (option) {
        case "How to file a complaint?":
          botResponses.push({ 
            id: Date.now(), 
            content: "You can file a complaint by clicking the 'File a Complaint' button on the home page. You'll need to register an account first.", 
            sender: 'bot' 
          });
          break;
        case "What documents/evidence needed?":
          botResponses.push({ 
            id: Date.now(), 
            content: "It depends on the crime. Generally, keep: Screenshots, Bank Statements, URL of fake profiles, and Chat logs ready.", 
            sender: 'bot' 
          });
          break;
        case "How to track my complaint status?":
           botResponses.push({ 
             id: Date.now(), 
             content: "Use the 'Track Status' button on the homepage and enter your Acknowledgement Number to see real-time updates.", 
             sender: 'bot' 
           });
           break;
        case "Forgot password / login issue":
           botResponses.push({ 
             id: Date.now(), 
             content: "Click 'Forgot Password' on the login screen. You'll receive an OTP on your registered mobile number to reset it.", 
             sender: 'bot' 
           });
           break;
        case "Helpline and support contact":
           botResponses.push({ 
             id: Date.now(), 
             content: "You can call the National Cyber Crime Helpline at 1930 (Toll-Free). It is available 24/7.", 
             sender: 'bot' 
           });
           break;
        default:
           // Fallback for unexpected options
           botResponses.push({ id: Date.now(), content: "I can help with that. Please verify the details in the FAQ.", sender: 'bot' });
           break;
      }

      setMessages(prev => [...prev, ...botResponses, followUp]);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now(), content: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot reply for typed text
    setTimeout(() => {
      const reply: Message = { 
        id: Date.now() + 1, 
        content: "I'm an automated assistant. Please select one of the options below for the best help.", 
        sender: 'bot',
        options: initialMessage.options
      };
      setMessages(prev => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1764336222789-28fd1846c6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" 
            alt="Cyber Security Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                 Official Government Portal
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Together Against <span className="text-orange-500">Cybercrime</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Report cyber incidents safely and securely. An initiative to facilitate victims/complainants to report cyber crime complaints online.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/report">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  File a Complaint
                </Button>
              </Link>
    <Button
  onClick={() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) {
      navigate('/dashboard/citizen');
    } else {
      navigate('/login', { state: { returnTo: '/dashboard/citizen' } });
    }
  }}
  size="lg"
  className="w-full sm:w-auto gap-2 border-2 border-orange-500 text-orange-500 bg-transparent
             hover:bg-orange-500 hover:text-white transition-colors"
>
  <FileText className="h-5 w-5" />
  Track Status
</Button>

            </div>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <div className="bg-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-5 w-5" />
            <span>National Cyber Crime Helpline Number: <strong>1930</strong> (Toll Free)</span>
          </div>
          <p className="text-sm font-medium">Available 24x7 • Immediate assistance for financial fraud</p>
        </div>
      </div>

      {/* Crime Categories */}
      <div className="flex flex-col">
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Reportable Cyber Incidents</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Select a category below to learn more or file a report.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Women/Children Crime",
                  desc: "Cyber stalking, bullying, grooming, and child pornography.",
                  img: "https://images.unsplash.com/photo-1674049406486-4b1f6e1845fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                  icon: <Users className="h-8 w-8 text-blue-600" />
                },
                {
                  title: "Financial Fraud",
                  desc: "Credit card fraud, UPI scams, banking phishing.",
                  img: "https://images.unsplash.com/photo-1640545232493-9a9b5c88ede4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                  icon: <CreditCard className="h-8 w-8 text-blue-600" />
                },
                {
                  title: "Social Media Crime",
                  desc: "Cyberbullying, stalking, fake profiles, hacking.",
                  img: "https://images.unsplash.com/photo-1594841367173-8dcddd16c7c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                  icon: <Phone className="h-8 w-8 text-blue-600" />
                },
                {
                  title: "Other Crimes",
                  desc: "Hacking, data theft, malware, and other cyber incidents.",
                  img: "https://images.unsplash.com/photo-1614064642261-3ccbfafa481b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                  icon: <Lock className="h-8 w-8 text-blue-600" />
                }
              ].map((card, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer"
                  onClick={() => {
                    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
                    
                    // Always save selection to draft so it's pre-filled
                    localStorage.setItem('draftCrimeReport', JSON.stringify({ category: card.title }));

                    if (isAuth) {
                      navigate('/report', { state: { step: 2 } });
                    } else {
                      // Redirect to login, then back to report page step 2
                      navigate('/login', { state: { returnTo: '/report', step: 2 } });
                    }
                  }}
                >
                  <CategoryCard 
                    icon={card.icon}
                    title={card.title}
                    desc={card.desc}
                    img={card.img}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/report">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Categories <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Complaint Lifecycle Section */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">How Your Complaint Is Processed</h2>
              <p className="text-slate-600">Status updates will appear in your complaint details.</p>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-y-8 md:gap-y-0">
              {[
                { label: 'SUBMITTED', icon: Send },
                { label: 'RECEIVED', icon: FileText },
                { label: 'UNDER_VERIFICATION', icon: Shield },
                { label: 'FIR_GENERATED', icon: FileText },
                { label: 'INVESTIGATING', icon: UserX },
                { label: 'RESOLVED', icon: Shield },
                { label: 'CLOSED', icon: Lock },
              ].map((step, index, arr) => (
                <div key={index} className="contents">
                  <div className="flex flex-col items-center w-28 relative group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100 text-blue-600 mb-3 shadow-sm z-10 transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 group-hover:scale-110">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight text-center px-1 leading-tight max-w-[100px] transition-colors duration-300 group-hover:text-orange-700">
                      {step.label.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="hidden md:flex items-center justify-center h-12 w-8 -mx-2 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Safety Awareness */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
               <div className="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm mb-4">Cyber Awareness</div>
               <h2 className="text-3xl font-bold text-slate-900 mb-6">Stay Safe Online</h2>
               <div className="space-y-6">
                 <AwarenessItem 
                   title="Never share OTPs" 
                   desc="Banks or officials never ask for your OTP or PIN over the phone."
                 />
                 <AwarenessItem 
                   title="Verify Links" 
                   desc="Do not click on suspicious links received via SMS or Email."
                 />
                 <AwarenessItem 
                   title="Strong Passwords" 
                   desc="Use complex passwords and enable Two-Factor Authentication (2FA)."
                 />
               </div>
               <div className="mt-8">
                 <Button 
                   className="gap-2"
                   onClick={() => window.open('https://www.youtube.com/results?search_query=cyber+crime+safety+awareness', '_blank')}
                 >
                   <PlayCircle className="h-5 w-5" />
                   Watch Safety Videos
                 </Button>
               </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="bg-slate-100 p-4 rounded-xl shadow-sm h-48 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-slate-300" />
                </div>
                <div className="bg-blue-600 p-4 rounded-xl shadow-sm h-64 flex flex-col justify-end text-white">
                   <p className="font-bold text-xl">10M+</p>
                   <p className="text-blue-100">Citizens Educated</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-orange-500 p-4 rounded-xl shadow-sm h-64 flex flex-col justify-end text-white">
                   <p className="font-bold text-xl">24/7</p>
                   <p className="text-orange-100">Support Available</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-xl shadow-sm h-48 flex items-center justify-center">
                   <Lock className="h-12 w-12 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* } */}
    </div>
  );
}

function CategoryCard({ icon, title, desc, img }: { icon: React.ReactNode, title: string, desc: string, img: string }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group border-t-4 border-t-transparent hover:border-t-orange-500">
      <div className="h-32 overflow-hidden relative">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
      </div>
      <CardContent className="pt-6">
        <div className="mb-4 bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{desc}</p>
        <Button size="sm" variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
          Report Now <ArrowRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

function AwarenessItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-slate-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}
