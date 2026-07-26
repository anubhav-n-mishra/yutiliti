import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, Share2, Download, QrCode, Type, Link as LinkIcon, Mail, Phone, Wifi } from 'lucide-react';

interface QrCodeGeneratorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type QrType = 'text' | 'url' | 'email' | 'phone' | 'wifi';

export default function QrCodeGenerator({ onCopy, onShare }: QrCodeGeneratorProps) {
  const [activeType, setActiveType] = useState<QrType>('url');
  
  // Specific data states
  const [rawText, setRawText] = useState<string>('Welcome to Yuitility!');
  const [url, setUrl] = useState<string>('https://yuitility.app');
  const [emailTo, setEmailTo] = useState<string>('hello@yuitility.app');
  const [emailSubject, setEmailSubject] = useState<string>('Hello from Yuitility');
  const [emailBody, setEmailBody] = useState<string>('This QR Code works perfectly!');
  const [phoneNo, setPhoneNo] = useState<string>('+919876543210');
  const [wifiSsid, setWifiSsid] = useState<string>('NestWifi_5G');
  const [wifiPass, setWifiPass] = useState<string>('nestsecure123');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Aesthetic Customization
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [correctionLevel, setCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState<number>(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Formulate string to encode
  const finalPayload = () => {
    switch (activeType) {
      case 'text':
        return rawText;
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNo}`;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPass};;`;
      default:
        return 'Yuitility';
    }
  };

  const drawQrCode = async () => {
    if (!canvasRef.current) return;
    const text = finalPayload();
    if (!text.trim()) return;

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: 256,
        margin: margin,
        errorCorrectionLevel: correctionLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
    } catch (err) {
      console.error('Error drawing QR Code', err);
    }
  };

  useEffect(() => {
    drawQrCode();
  }, [
    activeType, rawText, url, emailTo, emailSubject, emailBody, phoneNo,
    wifiSsid, wifiPass, wifiSecurity, fgColor, bgColor, correctionLevel, margin
  ]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yuitility_QRCode_${activeType}_${Date.now()}.png`;
    a.click();
  };

  const handleDownloadSVG = async () => {
    const text = finalPayload();
    try {
      const svgString = await QRCode.toString(text, {
        type: 'svg',
        margin: margin,
        errorCorrectionLevel: correctionLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yuitility_QRCode_${activeType}_${Date.now()}.svg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating SVG QR Code', err);
    }
  };

  const handleReset = () => {
    setActiveType('url');
    setRawText('Welcome to Yuitility!');
    setUrl('https://yuitility.app');
    setEmailTo('hello@yuitility.app');
    setEmailSubject('Hello from Yuitility');
    setEmailBody('This QR Code works perfectly!');
    setPhoneNo('+919876543210');
    setWifiSsid('NestWifi_5G');
    setWifiPass('nestsecure123');
    setWifiSecurity('WPA');
    setFgColor('#000000');
    setBgColor('#ffffff');
    setCorrectionLevel('M');
    setMargin(4);
  };

  const tabStyles = (type: QrType) => {
    return `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${activeType === type ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100' : 'border-zinc-100 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:bg-zinc-900/50'}`;
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">QR Code Generator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Encode text blocks, credentials, and network setups into beautifully stylized codes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => onShare("QR Code Generator", "#/qr-code-generator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Specification Form Pane */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick tab filters */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveType('url')} className={tabStyles('url')}>
              <LinkIcon className="w-3.5 h-3.5" />
              URL
            </button>
            <button onClick={() => setActiveType('text')} className={tabStyles('text')}>
              <Type className="w-3.5 h-3.5" />
              Plain Text
            </button>
            <button onClick={() => setActiveType('email')} className={tabStyles('email')}>
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
            <button onClick={() => setActiveType('phone')} className={tabStyles('phone')}>
              <Phone className="w-3.5 h-3.5" />
              Phone No
            </button>
            <button onClick={() => setActiveType('wifi')} className={tabStyles('wifi')}>
              <Wifi className="w-3.5 h-3.5" />
              WiFi Setup
            </button>
          </div>

          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Payload Content</p>
            
            {activeType === 'url' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Destination Link / Website URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. www.google.com"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700 font-mono"
                />
              </div>
            )}

            {activeType === 'text' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Enter Plain Text Block</label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Type anything to encode..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
            )}

            {activeType === 'email' && (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="e.g. recipient@mail.com"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Body Content</label>
                  <textarea
                    rows={2}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                  />
                </div>
              </div>
            )}

            {activeType === 'phone' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Mobile/Phone Number (with Country Code)</label>
                <input
                  type="tel"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
            )}

            {activeType === 'wifi' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-zinc-500">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Security Type</label>
                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Password</label>
                  <input
                    type="password"
                    disabled={wifiSecurity === 'nopass'}
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 disabled:bg-zinc-100 disabled:text-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Aesthetic Controls block */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Aesthetic Adjustments</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Foreground Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded border overflow-hidden cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="text-xs font-mono w-20 uppercase outline-none bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border overflow-hidden cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="text-xs font-mono w-20 uppercase outline-none bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Error Correction Level</label>
                <select
                  value={correctionLevel}
                  onChange={(e) => setCorrectionLevel(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Frame Margin (Modules)</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={margin}
                  onChange={(e) => setMargin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Live Preview</h2>
            
            {/* Drawing Canvas Frame */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-900 inline-block">
              <canvas ref={canvasRef} className="max-w-full w-48 h-48 block mx-auto" />
            </div>

            <p className="text-[10px] text-zinc-400 max-w-[200px] mx-auto leading-relaxed">
              Scan this preview with any smartphone camera to test instant payloads.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <button
              onClick={handleDownloadPNG}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Download High-Res PNG
            </button>
            
            <button
              onClick={handleDownloadSVG}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Vector SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
