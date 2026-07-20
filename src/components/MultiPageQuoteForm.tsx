import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import {
  Building2,
  User,
  Mail,
  MapPin,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Upload,
  Trash2,
  FileText,
  Phone,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { submitInboundLead } from '../sync';

interface MultiPageFormProps {
  theme?: 'light' | 'dark';
  layout?: 'default' | 'hero';
  onSubmitSuccess?: (data: any) => void;
}

export default function MultiPageQuoteForm({ theme = 'light', layout = 'default', onSubmitSuccess }: MultiPageFormProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    // Page 1
    propertyType: 'Residential',
    fullName: '',
    email: '',
    phone: '',
    installationAddress: '',

    // Page 2
    utilityProvider: '',
    monthlyBill: '5,000 - 8,000',
    roofType: 'Rib-type / Corrugated GI Sheet',
    daytimeShading: 'No, clear sunlight all day',

    // Page 3
    designatedInverterLocation: 'No designated location yet (site survey needed)',
    distanceBuildingPanels: '',
    distancePanelBoardInverter: '',

    // Page 4
    primaryGoal: 'Lowering daytime electric bill (Grid-Tied)',
    timeline: 'Immediately (2-3 weeks)',
    preferredDate: '',
    preferredTimeSlot: '9:00 AM - 12:00 PM',
  });

  // Files State (Stored as file object or metadata placeholder)
  const [inverterLocationImage, setInverterLocationImage] = useState<File | null>(null);
  const [photoMainPanelBoard, setPhotoMainPanelBoard] = useState<File | null>(null);
  const [photoProposedLocation, setPhotoProposedLocation] = useState<File | null>(null);
  const [latestBillImage, setLatestBillImage] = useState<File | null>(null);

  // Base64 State trackers for image rendering in Admin Panel
  const [inverterLocationImageBase64, setInverterLocationImageBase64] = useState<string | null>(null);
  const [photoMainPanelBoardBase64, setPhotoMainPanelBoardBase64] = useState<string | null>(null);
  const [photoProposedLocationBase64, setPhotoProposedLocationBase64] = useState<string | null>(null);
  const [latestBillImageBase64, setLatestBillImageBase64] = useState<string | null>(null);

  // Drag and drop state indicators
  const [dragOverField, setDragOverField] = useState<string | null>(null);

  // Success screen state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState('');

  // Styling maps based on dark or light theme
  const styles = {
    cardBg: theme === 'dark' ? 'bg-forest-900/90 border border-solar-yellow-500' : 'bg-white border border-slate-200/85',
    textMain: theme === 'dark' ? 'text-white' : 'text-forest-950',
    textMuted: theme === 'dark' ? 'text-stone-300' : 'text-stone-600',
    label: theme === 'dark' ? 'block text-[11px] font-mono font-bold uppercase text-stone-300 tracking-wider mb-1.5' : 'block text-xs font-mono font-bold uppercase text-stone-600 tracking-wide mb-1.5',
    input: theme === 'dark' 
      ? 'w-full bg-forest-950/85 border border-forest-800 text-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-solar-yellow-500 focus:border-transparent text-sm transition-all placeholder:text-stone-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100'
      : 'w-full text-sm font-sans bg-slate-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-solar-yellow-500 focus:border-solar-yellow-500 transition-all font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-45 hover:[&::-webkit-calendar-picker-indicator]:opacity-80',
    select: theme === 'dark'
      ? 'w-full bg-forest-950/85 border border-forest-800 text-white rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-solar-yellow-500 focus:border-transparent text-sm appearance-none cursor-pointer'
      : 'w-full text-sm font-sans bg-slate-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-solar-yellow-500 focus:border-solar-yellow-500 transition-all font-semibold appearance-none cursor-pointer',
    buttonPrimary: 'w-full bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 font-display font-black tracking-wider text-sm py-3.5 rounded-lg uppercase shadow-md transition-all active:scale-[0.98] cursor-pointer',
    buttonSecondary: theme === 'dark'
      ? 'w-full bg-forest-950/80 hover:bg-forest-900 border border-forest-800 text-white font-display font-bold text-sm py-3.5 rounded-lg transition-all cursor-pointer'
      : 'w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-stone-700 font-display font-bold text-sm py-3.5 rounded-lg transition-all cursor-pointer',
    dropzone: theme === 'dark'
      ? 'border-2 border-dashed border-forest-700 hover:border-solar-yellow-500 bg-forest-950/40 hover:bg-forest-950/65 rounded-lg p-4 transition-all text-center cursor-pointer'
      : 'border-2 border-dashed border-slate-300 hover:border-solar-yellow-500 bg-slate-50 hover:bg-slate-100 rounded-lg p-4 transition-all text-center cursor-pointer',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOverField(fieldName);
  };

  const handleDragLeave = () => {
    setDragOverField(null);
  };

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOverField(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(fieldName, file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(fieldName, files[0]);
    }
  };

  const setUploadedFile = (fieldName: string, file: File) => {
    // Only accept images like png, jpg, jpeg, webp
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [fieldName]: 'Only images (PNG, JPG, JPEG, WebP) are allowed' }));
      return;
    }

    if (fieldName === 'inverterLocationImage') setInverterLocationImage(file);
    if (fieldName === 'photoMainPanelBoard') setPhotoMainPanelBoard(file);
    if (fieldName === 'photoProposedLocation') setPhotoProposedLocation(file);
    if (fieldName === 'latestBillImage') setLatestBillImage(file);

    // Compress images on the fly to prevent QuotaExceededError in localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800; // Limit dimension to max 800px width/height for lightweight database storage
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress quality to 0.6 (~30KB - 50KB total size)
          if (fieldName === 'inverterLocationImage') setInverterLocationImageBase64(dataUrl);
          if (fieldName === 'photoMainPanelBoard') setPhotoMainPanelBoardBase64(dataUrl);
          if (fieldName === 'photoProposedLocation') setPhotoProposedLocationBase64(dataUrl);
          if (fieldName === 'latestBillImage') setLatestBillImageBase64(dataUrl);
        } else {
          const rawResult = event.target?.result as string;
          if (fieldName === 'inverterLocationImage') setInverterLocationImageBase64(rawResult);
          if (fieldName === 'photoMainPanelBoard') setPhotoMainPanelBoardBase64(rawResult);
          if (fieldName === 'photoProposedLocation') setPhotoProposedLocationBase64(rawResult);
          if (fieldName === 'latestBillImage') setLatestBillImageBase64(rawResult);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // clear validation errors
    if (errors[fieldName]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  const removeFile = (fieldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (fieldName === 'inverterLocationImage') {
      setInverterLocationImage(null);
      setInverterLocationImageBase64(null);
    }
    if (fieldName === 'photoMainPanelBoard') {
      setPhotoMainPanelBoard(null);
      setPhotoMainPanelBoardBase64(null);
    }
    if (fieldName === 'photoProposedLocation') {
      setPhotoProposedLocation(null);
      setPhotoProposedLocationBase64(null);
    }
    if (fieldName === 'latestBillImage') {
      setLatestBillImage(null);
      setLatestBillImageBase64(null);
    }
  };

  const validatePage = (page: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (page === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email Address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone Number is required';
      }
      if (!formData.installationAddress.trim()) newErrors.installationAddress = 'Installation Address is required';
    }

    if (page === 2) {
      if (!formData.utilityProvider.trim()) newErrors.utilityProvider = 'Utility Provider is required';
    }

    if (page === 3) {
      const isInverterYes = (formData.designatedInverterLocation || "").startsWith('Yes');
      if (isInverterYes) {
        if (!formData.distanceBuildingPanels.trim()) {
          newErrors.distanceBuildingPanels = 'Distance is required';
        } else if (isNaN(Number(formData.distanceBuildingPanels))) {
          newErrors.distanceBuildingPanels = 'Must be a valid number';
        }
      } else {
        if (!formData.distancePanelBoardInverter.trim()) {
          newErrors.distancePanelBoardInverter = 'Distance is required';
        } else if (isNaN(Number(formData.distancePanelBoardInverter))) {
          newErrors.distancePanelBoardInverter = 'Must be a valid number';
        }
        if (!photoMainPanelBoard) {
          newErrors.photoMainPanelBoard = 'Photo 1 is required to verify layout';
        }
        if (!photoProposedLocation) {
          newErrors.photoProposedLocation = 'Photo 2 is required to verify layout';
        }
      }
    }

    if (page === 4) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred ocular visit date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage(currentPage)) {
      setCurrentPage(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePage(4)) return;

    // Compile detailed information matching sync.ts inputs
    const consumption = `${formData.monthlyBill || "5,000 - 8,000"} PHP Bill`;
    const serviceCategory = `${formData.propertyType || "Residential"} Solar - ${(formData.primaryGoal || "").split('(')[0]?.trim() || "Consultation"}`;

    // Detail specifications compiled HTML string for the engineering team
    const detailsCompiled = `
      <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1c1917;">
        <h2 style="color: #05300a; font-weight: 800; font-size: 1.15rem; margin-top: 0; margin-bottom: 0.5rem; text-transform: uppercase; border-bottom: 2px solid #e7e5e4; padding-bottom: 0.25rem;">
          ⚡ Inbound Lead Intake Dossier
        </h2>
        <p style="margin-bottom: 1rem; font-size: 0.85rem; font-weight: 600; color: #57534e;">
          Client record captured on public portal at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
        </p>
        
        <h3 style="color: #05300a; font-weight: 800; font-size: 0.95rem; margin-top: 1.25rem; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Property Profile
        </h3>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 1rem; font-size: 0.85rem;">
          <li style="margin-bottom: 0.25rem;"><strong>Property Type:</strong> ${formData.propertyType}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Full Name:</strong> ${formData.fullName}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Email Address:</strong> ${formData.email}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Contact Phone:</strong> ${formData.phone}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Installation Location:</strong> ${formData.installationAddress}</li>
        </ul>

        <h3 style="color: #05300a; font-weight: 800; font-size: 0.95rem; margin-top: 1.25rem; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Energy & Structural Profile
        </h3>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 1rem; font-size: 0.85rem;">
          <li style="margin-bottom: 0.25rem;"><strong>Utility Provider:</strong> ${formData.utilityProvider}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Monthly Cost Vector:</strong> PHP ${formData.monthlyBill}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Roof Structural Model:</strong> ${formData.roofType}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Active Daytime Shading:</strong> ${formData.daytimeShading}</li>
        </ul>

        <h3 style="color: #05300a; font-weight: 800; font-size: 0.95rem; margin-top: 1.25rem; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Inverter & Panel Setup
        </h3>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 1rem; font-size: 0.85rem;">
          <li style="margin-bottom: 0.25rem;"><strong>Inverter Location:</strong> ${formData.designatedInverterLocation || ""}</li>
          ${(formData.designatedInverterLocation || "").startsWith('Yes') ? `
            <li style="margin-bottom: 0.25rem;"><strong>Building to Panels Distance:</strong> ${formData.distanceBuildingPanels} Meters</li>
            <li style="margin-bottom: 0.25rem;"><strong>Inverter Location Image Supplied:</strong> ${inverterLocationImage ? inverterLocationImage.name : 'No'}</li>
          ` : `
            <li style="margin-bottom: 0.25rem;"><strong>Panel Board to Inverter Distance:</strong> ${formData.distancePanelBoardInverter} Meters</li>
            <li style="margin-bottom: 0.25rem;"><strong>Main Panel Board Photo Supplied:</strong> ${photoMainPanelBoard ? photoMainPanelBoard.name : 'No'}</li>
            <li style="margin-bottom: 0.25rem;"><strong>Proposed Location Photo Supplied:</strong> ${photoProposedLocation ? photoProposedLocation.name : 'No'}</li>
          `}
        </ul>

        <h3 style="color: #05300a; font-weight: 800; font-size: 0.95rem; margin-top: 1.25rem; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Deployment Metrics & Goals
        </h3>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0.5rem; font-size: 0.85rem;">
          <li style="margin-bottom: 0.25rem;"><strong>Primary Solar Intention:</strong> ${formData.primaryGoal}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Projected Timeline:</strong> ${formData.timeline}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Target Ocular Inspection Date:</strong> ${formData.preferredDate}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Preferred Arrival Slot:</strong> ${formData.preferredTimeSlot}</li>
          <li style="margin-bottom: 0.25rem;"><strong>Electric Bill Image Supplied:</strong> ${latestBillImage ? latestBillImage.name : 'No'}</li>
        </ul>
      </div>
    `.trim();

    // Random unique ID
    const leadToken = Math.floor(100 + Math.random() * 900);
    const randomLeadId = `LEAD-206-${leadToken}`;
    setSubmittedLeadId(randomLeadId);

    // Parse monthly bill and compute ROI details
    const parseBillToNum = (billStr: string): number => {
      switch (billStr) {
        case "1,000 - 4,000": return 3000;
        case "5,000 - 8,000": return 6500;
        case "9,000 - 12,000": return 10500;
        case "13,000 - 16,000": return 14500;
        case "17,000 - 25,000": return 21000;
        case "26,000 - 40,000": return 33000;
        case "41,000 - Up": return 55000;
        default: return 6500;
      }
    };

    const billInput = parseBillToNum(formData.monthlyBill);
    const pricePerKwh = 15;
    const isOffGridMode = formData.primaryGoal === "Going completely off-grid" || billInput >= 41000;

    let baseInvestment = 0;
    if (billInput <= 4000) {
      baseInvestment = billInput * 57.50;
    } else if (billInput <= 8000) {
      baseInvestment = 230000 + (billInput - 4000) * 30.00;
    } else if (billInput <= 12000) {
      baseInvestment = 350000 + (billInput - 8000) * 10.00;
    } else if (billInput <= 16000) {
      baseInvestment = 390000 + (billInput - 12000) * 25.00;
    } else if (billInput <= 25000) {
      baseInvestment = 490000 + (billInput - 16000) * 10.00;
    } else if (billInput <= 40000) {
      let extra = (billInput - 25000) * 14.66;
      if (billInput === 40000) extra = 220000;
      baseInvestment = 580000 + extra;
    } else {
      baseInvestment = 0;
    }

    let total = 0;
    if (!isOffGridMode) {
      total = Math.round(baseInvestment * (pricePerKwh / 15));
    }

    const size = billInput / (pricePerKwh * 120);
    const systemSizeVal = Number(size.toFixed(2));

    let panels: number | string = 0;
    let inverter: number | string = 0;
    let batteries: number | string = 0;
    let balance: number | string = 0;

    if (isOffGridMode) {
      panels = "Off-Grid Optimized Tier-1";
      inverter = "Off-Grid Intelligent Hybrid";
      batteries = "High Capacity LiFePO4 Bank";
      balance = "Full Engineering Support";
    } else {
      panels = Math.round(total * 0.40);
      inverter = Math.round(total * 0.20);
      batteries = Math.round(total * 0.25);
      balance = total - panels - inverter - batteries;
    }

    const monthlySavings = isOffGridMode ? billInput : Math.round(billInput * 0.85);

    let paybackYears = 0;
    let paybackMonths = 0;
    let statusText = '';

    if (billInput <= 0) {
      paybackYears = 0;
      paybackMonths = 0;
      statusText = 'N/A';
    } else if (billInput <= 4000) {
      paybackYears = 2;
      paybackMonths = 2;
      statusText = 'Ultra-Fast Payback';
    } else if (billInput <= 8000) {
      paybackYears = 2;
      paybackMonths = 10;
      statusText = 'High Efficiency';
    } else if (billInput <= 12000) {
      paybackYears = 3;
      paybackMonths = 5;
      statusText = 'Rapid ROI';
    } else if (billInput <= 16000) {
      paybackYears = 3;
      paybackMonths = 9;
      statusText = 'Moderate';
    } else if (billInput <= 25000) {
      paybackYears = 4;
      paybackMonths = 0;
      statusText = 'Your Anchor Point';
    } else if (billInput <= 40000) {
      paybackYears = 4;
      paybackMonths = 6;
      statusText = 'Heavy Investment';
    } else {
      paybackYears = 4;
      paybackMonths = 11;
      statusText = 'Peak (Under 5-Year Limit)';
    }

    const totalInvestmentVal = isOffGridMode ? "Off Grid - ₱0 Bill System" : total;

    // Compile uploaded base64 images
    const uploadedImages: (string | { url: string; label?: string })[] = [];
    if (inverterLocationImageBase64) uploadedImages.push({ url: inverterLocationImageBase64, label: "Inverter Location Photo" });
    if (photoMainPanelBoardBase64) uploadedImages.push({ url: photoMainPanelBoardBase64, label: "Main Panel Board Photo" });
    if (photoProposedLocationBase64) uploadedImages.push({ url: photoProposedLocationBase64, label: "Proposed Location Photo" });
    if (latestBillImageBase64) uploadedImages.push({ url: latestBillImageBase64, label: "Latest Electric Bill" });

    // Generate Custom PDF
    try {
      const doc = new jsPDF();
      const primaryColor = [5, 48, 10]; // #05300a (Forest Green)
      const secondaryColor = [200, 172, 12]; // #c8ac0c (Solar Yellow)
      const darkTextColor = [30, 30, 30];
      const lightGrey = [245, 245, 245];
      const borderGrey = [220, 220, 220];

      // Draw Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Header Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("POWERSHIFT SOLAR", 15, 17);
      
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("SYSTEM SIZING & INVESTMENT ESTIMATE", 15, 25);
      
      // Watermark/Metadata
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("Helvetica", "normal");
      doc.text(`DATE: ${new Date().toLocaleDateString()}`, 160, 17);
      doc.text("VERSION: 2.4", 160, 23);

      let y = 48;

      // Introduction
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text("Thank you for choosing Powershift Solar. Below is your custom high-fidelity energy simulation and solar investment report based on the parameters provided.", 15, y, { maxWidth: 180 });
      y += 12;

      // SECTION 1: CUSTOMER ENERGY PROFILE
      doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
      doc.rect(15, y, 180, 22, 'F');
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("1. CUSTOMER ENERGY PROFILE", 20, y + 7);
      
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Monthly Electric Bill:`, 20, y + 15);
      doc.setFont("Helvetica", "bold");
      doc.text(`PHP ${billInput.toLocaleString()}`, 65, y + 15);
      
      doc.setFont("Helvetica", "normal");
      doc.text(`Current Utility Price:`, 110, y + 15);
      doc.setFont("Helvetica", "bold");
      doc.text(`PHP ${pricePerKwh.toFixed(2)} / kWh`, 155, y + 15);
      
      y += 30;

      // SECTION 2: RECOMMENDED SYSTEM SPECIFICATIONS
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("2. RECOMMENDED SYSTEM SPECIFICATIONS", 15, y);
      y += 7;
      
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.line(15, y, 195, y);
      
      const rowHeight = 8;
      const specData = [
        ["Recommended System Size", `${systemSizeVal} kWp`],
        ["Est. Monthly Solar Generation", `${Math.round(systemSizeVal * 120)} kWh`],
        ["Est. Monthly Savings", `PHP ${monthlySavings.toLocaleString()}`],
        ["Est. Annual Savings", `PHP ${(monthlySavings * 12).toLocaleString()}`],
        ["Estimated Payback Period", `${paybackYears} Years, ${paybackMonths} Months`]
      ];

      specData.forEach((row, idx) => {
        y += rowHeight;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
        doc.text(row[0], 20, y - 2.5);
        
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(row[1], 120, y - 2.5);
        
        doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
        doc.line(15, y, 195, y);
      });
      
      y += 14;

      // SECTION 3: TURNKEY INVESTMENT BREAKDOWN
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("3. TURNKEY INVESTMENT BREAKDOWN", 15, y);
      y += 7;

      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.line(15, y, 195, y);

      const costData = [
        ["Solar PV Modules (Premium Tier-1)", typeof panels === 'number' ? `PHP ${panels.toLocaleString()}` : panels],
        ["Hybrid Intelligent Inverter (Pure Sine)", typeof inverter === 'number' ? `PHP ${inverter.toLocaleString()}` : inverter],
        ["Lithium Battery Storage (LiFePO4 Pack)", typeof batteries === 'number' ? `PHP ${batteries.toLocaleString()}` : batteries],
        ["Balance of System (Mounting & Engineering)", typeof balance === 'number' ? `PHP ${balance.toLocaleString()}` : balance],
      ];

      costData.forEach((row) => {
        y += rowHeight;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
        doc.text(row[0], 20, y - 2.5);
        
        doc.setFont("Helvetica", "bold");
        doc.text(row[1], 150, y - 2.5);
        
        doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
        doc.line(15, y, 195, y);
      });

      // Total turnkey cost
      y += 10;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, y - 8, 180, 9, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.text("TOTAL ESTIMATED INVESTMENT", 20, y - 2);
      doc.text(typeof totalInvestmentVal === 'number' ? `PHP ${totalInvestmentVal.toLocaleString()}` : totalInvestmentVal, 150, y - 2);

      y += 16;

      // SECTION 4: ESTIMATED LOAD CAPABILITIES
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("4. REPRESENTATIVE LOAD CAPABILITIES", 15, y);
      y += 6;

      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("Based on your recommended system configuration, here is an indicator of what household loads can be powered:", 15, y);
      y += 8;

      doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
      doc.rect(15, y, 180, 20, 'F');
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Daytime (Direct Solar Power)", 20, y + 6);
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("Helvetica", "normal");
      doc.text(`• Inverter Aircon (2200W): ${(isOffGridMode || systemSizeVal >= 3.0) ? 'Supported' : 'Backup Needed'}   • Refrigerator (150W): ${(isOffGridMode || systemSizeVal >= 1.5) ? 'Supported' : 'Backup Needed'}`, 20, y + 11);
      doc.text(`• Laptop Workstation (80W): ${(isOffGridMode || systemSizeVal >= 0.5) ? 'Supported' : 'Backup Needed'} • Electric Fan (55W): ${(isOffGridMode || systemSizeVal >= 0.2) ? 'Supported' : 'Backup Needed'}`, 20, y + 16);

      y += 24;
      doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
      doc.rect(15, y, 180, 20, 'F');
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Nighttime (UPS Battery Backup)", 20, y + 6);
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("Helvetica", "normal");
      doc.text(`• LED Lights (30W): ${(isOffGridMode || systemSizeVal >= 0.8) ? 'Supported' : 'Grid Backup'}   • Electric Fan (55W): ${(isOffGridMode || systemSizeVal >= 1.2) ? 'Supported' : 'Grid Backup'}`, 20, y + 11);
      doc.text(`• Television (100W): ${(isOffGridMode || systemSizeVal >= 2.5) ? 'Supported' : 'Grid Backup'} • Wifi Router (25W): ${(isOffGridMode || systemSizeVal >= 0.3) ? 'Supported' : 'Grid Backup'}`, 20, y + 16);

      y += 26;

      // Contact Footer Information
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.75);
      doc.line(15, y, 195, y);
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.text("CONTACT OUR ENGINEERING DESK TO GET A DETAILED PROPOSAL", 15, y + 5);
      
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Email: c2r2gsm@gmail.com  |  Phone: 0935 479 6321  |  Web: c2r2gsm@gmail.com", 15, y + 10);

      const dataUri = doc.output('datauristring');
      uploadedImages.push({
        url: dataUri,
        label: "Client_Solar_ROI_Estimate_Report.pdf"
      });
    } catch (err) {
      console.error("Failed to generate custom client ROI document:", err);
    }

    // Submit lead via synchronization layer
    submitInboundLead({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      service: serviceCategory,
      consumption: consumption,
      region: formData.installationAddress,
      description: detailsCompiled,
      images: uploadedImages,
      propertyType: formData.propertyType,
      preferredDate: formData.preferredDate,
      preferredTimeSlot: formData.preferredTimeSlot
    });

    // Save lead parameters details in a dedicated localStorage variable for reference if needed
    localStorage.setItem(`powershift_lead_details_${randomLeadId}`, detailsCompiled);

    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess({ ...formData, leadId: randomLeadId });
    }
  };

  const resetForm = () => {
    setFormData({
      propertyType: 'Residential',
      fullName: '',
      email: '',
      phone: '',
      installationAddress: '',
      utilityProvider: '',
      monthlyBill: '5,000 - 8,000',
      roofType: 'Rib-type / Corrugated GI Sheet',
      daytimeShading: 'No, clear sunlight all day',
      designatedInverterLocation: 'No designated location yet (site survey needed)',
      distanceBuildingPanels: '',
      distancePanelBoardInverter: '',
      primaryGoal: 'Lowering daytime electric bill (Grid-Tied)',
      timeline: 'Immediately (2-3 weeks)',
      preferredDate: '',
      preferredTimeSlot: '9:00 AM - 12:00 PM',
    });
    setInverterLocationImage(null);
    setPhotoMainPanelBoard(null);
    setPhotoProposedLocation(null);
    setLatestBillImage(null);
    setCurrentPage(1);
    setIsSubmitted(false);
  };

  // Custom File Uploader Component
  const FileUploader = ({
    label,
    fieldName,
    currentFile,
    error,
    description
  }: {
    label: string;
    fieldName: string;
    currentFile: File | null;
    error?: string;
    description?: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="space-y-1.5">
        <label className={styles.label}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-stone-400 mb-2 font-sans italic">
            {description}
          </p>
        )}
        <div
          onDragOver={(e) => handleDragOver(e, fieldName)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, fieldName)}
          onClick={() => fileInputRef.current?.click()}
          className={`${styles.dropzone} ${
            dragOverField === fieldName ? 'border-solar-yellow-500 bg-solar-yellow-500/10' : ''
          } ${error ? 'border-red-500/70 bg-red-500/5' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => handleFileChange(e, fieldName)}
          />

          {currentFile ? (
            <div className="flex items-center justify-between p-1.5 text-left bg-forest-950/20 rounded border border-forest-800/40">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1 bg-solar-yellow-500/20 text-solar-yellow-500 rounded">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                    {currentFile.name}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {(currentFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => removeFile(fieldName, e)}
                className="p-1 text-stone-400 hover:text-red-500 rounded hover:bg-red-500/10 transition-colors"
                title="Remove attachment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-2.5 flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
              <Upload className={`w-5 h-5 ${theme === 'dark' ? 'text-solar-yellow-500' : 'text-solar-yellow-600'}`} />
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                Drag and drop image here or <span className="text-solar-yellow-500 font-bold underline">browse files</span>
              </p>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">PNG, JPG, JPEG or WEBP</span>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
      </div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            {layout === 'hero' && (
              <div className="mb-4 flex items-baseline justify-between w-full pb-1">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                  SEND US A MESSAGE
                </h3>
                <span className="text-xs sm:text-sm uppercase font-mono tracking-widest text-solar-yellow-400 font-bold shrink-0">
                  Step {currentPage} of 4
                </span>
              </div>
            )}

            {/* Steps indicator */}
            <div className="mb-6">
              {layout !== 'hero' && (
                <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                  <span>Step {currentPage} of 4</span>
                  <span className="text-solar-yellow-500">
                    {currentPage === 1 && 'Identity & Location'}
                    {currentPage === 2 && 'Energy & Roof Specs'}
                    {currentPage === 3 && 'Inverter & Panel Setup'}
                    {currentPage === 4 && 'Optimization Goals'}
                  </span>
                </div>
              )}
              <div className={`w-full h-1 rounded-full overflow-hidden flex space-x-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-stone-200'}`}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all duration-500 rounded-full ${
                      step <= currentPage 
                        ? 'bg-gradient-to-r from-solar-yellow-400 to-solar-yellow-600 shadow-[0_0_8px_rgba(242,193,0,0.4)]' 
                        : (theme === 'dark' ? 'bg-white/5' : 'bg-stone-100')
                    }`}
                  />
                ))}
              </div>
              {layout === 'hero' && (
                <div className="flex items-center justify-center mt-3.5 gap-4">
                  <div className={`flex-grow h-[1px] bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-solar-yellow-500/40 to-solar-yellow-500/60' : 'via-solar-yellow-500/20 to-solar-yellow-500/40'}`}></div>
                  <span className={`${theme === 'dark' ? 'text-solar-yellow-500' : 'text-solar-yellow-600'} text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest shrink-0 text-center select-none`}>
                    {currentPage === 1 && 'Identity & Location'}
                    {currentPage === 2 && 'Energy & Roof Specs'}
                    {currentPage === 3 && 'Inverter & Panel Setup'}
                    {currentPage === 4 && 'Optimization Goals'}
                  </span>
                  <div className={`flex-grow h-[1px] bg-gradient-to-l from-transparent ${theme === 'dark' ? 'via-solar-yellow-500/40 to-solar-yellow-500/60' : 'via-solar-yellow-500/20 to-solar-yellow-500/40'}`}></div>
                </div>
              )}
            </div>

            {/* PAGE 1: IDENTITY & LOCATION */}
            {currentPage === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={styles.label}>Property Type</label>
                  <div className="relative">
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Juan dela Cruz"
                      className={`${styles.input} pl-10`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={styles.label}>Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. juan@domain.com"
                        className={`${styles.input} pl-10`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  <div>
                    <label className={styles.label}>Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 0917 123 4567"
                        className={`${styles.input} pl-10`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Installation Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="installationAddress"
                      value={formData.installationAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. 45 Solar Way, Quezon City, Metro Manila"
                      className={`${styles.input} pl-10`}
                    />
                  </div>
                  {errors.installationAddress && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.installationAddress}</p>}
                </div>
              </div>
            )}

            {/* PAGE 2: ENERGY & ROOF SPECS */}
            {currentPage === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={styles.label}>Utility Provider</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="utilityProvider"
                      value={formData.utilityProvider}
                      onChange={handleInputChange}
                      placeholder="e.g. Meralco, VECO, DLPC"
                      className={`${styles.input} pl-10`}
                    />
                  </div>
                  {errors.utilityProvider && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.utilityProvider}</p>}
                </div>

                <div>
                  <label className={styles.label}>Monthly Electricity Bill</label>
                  <div className="relative">
                    <select
                      name="monthlyBill"
                      value={formData.monthlyBill}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="1,000 - 4,000">1,000 - 4,000 PHP</option>
                      <option value="5,000 - 8,000">5,000 - 8,000 PHP</option>
                      <option value="9,000 - 12,000">9,000 - 12,000 PHP</option>
                      <option value="13,000 - 16,000">13,000 - 16,000 PHP</option>
                      <option value="17,000 - 25,000">17,000 - 25,000 PHP</option>
                      <option value="26,000 - 40,000">26,000 - 40,000 PHP</option>
                      <option value="41,000 - Up">41,000 PHP - Up</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Roof Type</label>
                  <div className="relative">
                    <select
                      name="roofType"
                      value={formData.roofType}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Rib-type / Corrugated GI Sheet">Rib-type / Corrugated GI Sheet</option>
                      <option value="Concrete Slab (Flat Roof)">Concrete Slab (Flat Roof)</option>
                      <option value="Tile Roof (Tisa)">Tile Roof (Tisa)</option>
                      <option value="Others / Not Sure">Others / Not Sure</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Daytime Shading</label>
                  <div className="relative">
                    <select
                      name="daytimeShading"
                      value={formData.daytimeShading}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="No, clear sunlight all day">No, clear sunlight all day</option>
                      <option value="Yes, from nearby trees/buildings">Yes, from nearby trees/buildings</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 3: INVERTER & PANEL SETUP */}
            {currentPage === 3 && (
              <div className="space-y-4">
                <div>
                  <label className={styles.label}>Designated Inverter Location</label>
                  <div className="relative">
                    <select
                      name="designatedInverterLocation"
                      value={formData.designatedInverterLocation}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Yes, I have an inverter location selected">Yes, I have an inverter location selected</option>
                      <option value="No designated location yet (site survey needed)">No designated location yet (site survey needed)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                {/* Conditional fields */}
                {(formData.designatedInverterLocation || "").startsWith('Yes') ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <FileUploader
                      label="Attach Inverter Location Image"
                      fieldName="inverterLocationImage"
                      currentFile={inverterLocationImage}
                      error={errors.inverterLocationImage}
                      description="Please capture a clean image showing your selected structural wall zone with nearby electrical meters."
                    />

                    <div>
                      <label className={styles.label}>Distance between building & panels (in Meters)</label>
                      <input
                        type="text"
                        name="distanceBuildingPanels"
                        value={formData.distanceBuildingPanels}
                        onChange={handleInputChange}
                        placeholder="e.g. 15"
                        className={styles.input}
                      />
                      {errors.distanceBuildingPanels && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.distanceBuildingPanels}</p>}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-solar-yellow-500/10 border border-solar-yellow-500/20 rounded-lg text-xs leading-normal">
                      <p className={`${theme === 'dark' ? 'text-solar-yellow-400' : 'text-forest-950'} font-bold`}>
                        Required Photos:
                      </p>
                      <p className={styles.textMuted}>
                        Since no safe inverter location is pre-designated, our engineering team requires exactly 2 photos to verify your layout.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUploader
                        label="Photo 1: Main Panel Board"
                        fieldName="photoMainPanelBoard"
                        currentFile={photoMainPanelBoard}
                        error={errors.photoMainPanelBoard}
                      />
                      <FileUploader
                        label="Photo 2: Proposed Location"
                        fieldName="photoProposedLocation"
                        currentFile={photoProposedLocation}
                        error={errors.photoProposedLocation}
                      />
                    </div>

                    <div>
                      <label className={styles.label}>Distance between panel board & inverter (in Meters)</label>
                      <input
                        type="text"
                        name="distancePanelBoardInverter"
                        value={formData.distancePanelBoardInverter}
                        onChange={handleInputChange}
                        placeholder="e.g. 8"
                        className={styles.input}
                      />
                      {errors.distancePanelBoardInverter && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.distancePanelBoardInverter}</p>}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* PAGE 4: OPTIMIZATION GOALS */}
            {currentPage === 4 && (
              <div className="space-y-4">
                <div>
                  <label className={styles.label}>Primary Goal</label>
                  <div className="relative">
                    <select
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Lowering daytime electric bill (Grid-Tied)">Lowering daytime electric bill (Grid-Tied)</option>
                      <option value="Backup power (Hybrid / Battery)">Backup power (Hybrid / Battery)</option>
                      <option value="Going completely off-grid">Going completely off-grid</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Timeline</label>
                  <div className="relative">
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Immediately (2-3 weeks)">Immediately (2-3 weeks)</option>
                      <option value="In 1 to 3 months">In 1 to 3 months</option>
                      <option value="Just researching">Just researching</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={styles.label}>Preferred Ocular Visit Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className={`${styles.input} pl-10`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.preferredDate && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.preferredDate}</p>}
                  </div>

                  <div>
                    <label className={styles.label}>Preferred Visit Time Slot</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        name="preferredTimeSlot"
                        value={formData.preferredTimeSlot}
                        onChange={handleInputChange}
                        className={`${styles.select} pl-10`}
                      >
                        <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                        <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                <FileUploader
                  label="Upload Latest Bill (Optional)"
                  fieldName="latestBillImage"
                  currentFile={latestBillImage}
                  description="Attaching your utility billing history allows engineers to compile simulation projections with 98% accuracy."
                />
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex space-x-4 pt-2">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={`${styles.buttonSecondary} flex items-center justify-center space-x-2`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {currentPage < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`${styles.buttonPrimary} flex items-center justify-center space-x-2`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={styles.buttonPrimary}
                >
                  Submit Application
                </button>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="w-14 h-14 bg-solar-yellow-500/15 text-solar-yellow-500 rounded-full flex items-center justify-center mx-auto border border-solar-yellow-500/30">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className={`font-display text-xl sm:text-2xl font-black ${styles.textMain}`}>
                Assessment Initiated!
              </h3>
              <p className={`text-xs ${styles.textMuted} leading-relaxed max-w-sm mx-auto`}>
                Thank you, <strong className="font-bold text-solar-yellow-500">{formData.fullName}</strong>. Your technical solar assessment dossier has been securely initialized.
              </p>
            </div>

            <div className={`p-4 rounded-xl border max-w-sm mx-auto text-left space-y-1.5 ${
              theme === 'dark' ? 'bg-forest-950/80 border-forest-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[9px] font-mono text-stone-400 block uppercase">Project ID Track</span>
              <span className={`font-mono text-xs font-bold block ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                {submittedLeadId}
              </span>
              
              <div className={`pt-1.5 border-t flex items-center justify-between text-xs ${
                theme === 'dark' ? 'border-forest-800 text-stone-300' : 'border-slate-200 text-stone-600'
              }`}>
                <span>Scope Class:</span>
                <span className="font-semibold text-solar-yellow-500">{formData.propertyType} Setup</span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Ocular Date:</span>
                <span className="font-medium">{formData.preferredDate} ({formData.preferredTimeSlot})</span>
              </div>
            </div>

            <p className={`text-[11px] ${styles.textMuted} leading-normal max-w-sm mx-auto`}>
              Our engineering team from <strong className={theme === 'dark' ? 'text-white' : 'text-stone-900'}>Powershift Solar Services</strong> will review your structural inputs and contact you at <span className="underline">{formData.phone}</span> within 2 business hours.
            </p>

            <div>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-mono font-bold text-solar-yellow-500 hover:text-solar-yellow-400 uppercase tracking-widest block mx-auto underline cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
