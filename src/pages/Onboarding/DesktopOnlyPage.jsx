import { Monitor, Smartphone } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function DesktopOnlyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -ml-40 -mb-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Content */}
      <div className="relative z-10 max-w-lg text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="Sokuya" className="h-32 w-auto drop-shadow-lg" />
        </div>

        {/* Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Spinning Monitor */}
            <div className="animate-bounce">
              <Monitor className="w-20 h-20 text-orange-400 mx-auto mb-4" strokeWidth={1.5} />
            </div>
            
            {/* Smartphone with X */}
            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1 animate-pulse">
              <Smartphone className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Oops! Desktop Only
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
          For the best experience managing your store, please use a <span className="font-semibold text-orange-400">desktop or tablet</span> with a wider screen.
        </p>

        {/* Feature List */}
        <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-400/50 transition-colors">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-neutral-300">Optimized for desktop dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-400/50 transition-colors">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-neutral-300">Complex product management</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-400/50 transition-colors">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-neutral-300">Advanced analytics & reporting</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-6">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/50"
          >
            Refresh when ready
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-sm text-neutral-500">
          💡 <span className="text-neutral-400">Tip: Open this page on your desktop or laptop browser</span>
        </p>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-orange-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/20 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
    </div>
  );
}
