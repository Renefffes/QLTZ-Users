import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discordUser, setDiscordUser] = useState('');
  const [robloxUser, setRobloxUser] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const webhookUrl = "https://discord.com/api/webhooks/1479634187286876281/wTr41vr9YPSo8yv6shVALHIlxc7H1SmjplSnjImpnsZ--TS1NbyA7ZJq3dgs7RjXhVTw";
      
      const formData = new FormData();
      
      const embed: any = {
        description: `Discord user ( <@${discordUser.trim()}> ) submited\nRoblox user = ${robloxUser}`,
        color: 0x000000, // Black color
      };
      
      if (imageFile) {
        const fileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_') || 'image.png';
        embed.image = { url: `attachment://${fileName}` };
        formData.append('files[0]', imageFile, fileName);
      }

      formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
          setDiscordUser('');
          setRobloxUser('');
          setImageFile(null);
          setAgreed(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-4xl mx-auto pt-32 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-12">
          QLTZ Dashboard
        </h1>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-8 py-3 rounded-full font-medium text-lg hover:bg-zinc-200 transition-all active:scale-95"
        >
          Submit User
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-semibold mb-6">Submit Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Please enter discord user (ID to ping)
                </label>
                <input 
                  type="text" 
                  required
                  value={discordUser}
                  onChange={(e) => setDiscordUser(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="Discord ID (e.g. 123456789)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Please enter roblox user
                </label>
                <input 
                  type="text" 
                  required
                  value={robloxUser}
                  onChange={(e) => setRobloxUser(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="RobloxUsername"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Enter image of ur roblox profile
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 transition-all cursor-pointer"
                />
              </div>
              
              <div className="flex items-center pt-2">
                <input 
                  type="checkbox" 
                  id="agree"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-white/20 focus:ring-offset-zinc-950 cursor-pointer"
                />
                <label htmlFor="agree" className="ml-3 text-sm text-zinc-300 select-none cursor-pointer">
                  do u agree to the griefing rules?
                </label>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !agreed}
                  className="w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <p className="text-emerald-400 text-sm text-center mt-2">Successfully submitted!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm text-center mt-2">Failed to submit. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
