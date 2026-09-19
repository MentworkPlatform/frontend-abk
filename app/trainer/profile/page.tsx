"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, User, Briefcase, Award, Globe, Linkedin, ArrowLeft, Star, Users, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SECTORS,
  SKILLS_CAPABILITIES,
  getSkillsForSectors,
  getSkillsGroupedBySector,
} from "@/lib/constants/onboarding";

export default function TrainerProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"preview" | "edit">("preview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(312);

  const [formData, setFormData] = useState({
    name: "Zainab Nadada",
    email: "zainab@example.com",
    title: "Digital Marketing Trainer",
    location: "Abuja, Nigeria",
    industry: "marketing",
    experience: "8-12",
    selectedSectors: ["technology-it", "creative-arts"],
    selectedSubSectorSkills: ["Software", "Web development", "Graphic design"],
    selectedSkillsCapabilities: [
      "Leadership, People & Culture",
      "Business Planning & Strategic Thinking",
      "Branding, Marketing & Digital Presence",
    ],
    bio: "Experienced trainer with 10+ years in digital marketing and creative growth. Passionate about helping SMEs scale with actionable strategies.",
    achievements: "Trained 1,240+ professionals, 14 successful programmes run",
    linkedinUrl: "https://linkedin.com/in/zainabnadada",
    websiteUrl: "https://zainabnadada.com",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subSectorSkillsOptions = useMemo(() => {
    const sectorSkills = getSkillsForSectors(formData.selectedSectors);
    return sectorSkills.map((skill) => ({ value: skill, label: skill }));
  }, [formData.selectedSectors]);

  const subSectorSkillsGrouped = useMemo(() => {
    if (formData.selectedSectors.length === 0) return [];

    const grouped = getSkillsGroupedBySector(formData.selectedSectors);
    return grouped.map((group) => ({
      groupLabel: group.sectorName,
      options: group.skills.map((skill) => ({ value: skill, label: skill })),
    }));
  }, [formData.selectedSectors]);

  const skillsCapabilitiesOptions = useMemo(() => {
    return SKILLS_CAPABILITIES.map((skill) => ({ value: skill, label: skill }));
  }, []);

  const sectorsOptions = useMemo(() => {
    return SECTORS.map((sector) => ({ value: sector.id, label: sector.name }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveView("preview");
    }, 800);
  };

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      <DashboardHeader
        title="Trainer Profile"
        description="View your public profile card as seen by prospective learners and organizations"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Toggle between Public Preview and Edit */}
        <div className="flex justify-between items-center bg-[#F2F1EE] p-1 rounded-xl max-w-sm">
          <button
            type="button"
            onClick={() => setActiveView("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeView === "preview" ? "bg-[#0A0A0A] text-white shadow-sm" : "text-[#6B6B6B]"
            }`}
          >
            Public Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveView("edit")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeView === "edit" ? "bg-[#0A0A0A] text-white shadow-sm" : "text-[#6B6B6B]"
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* PUBLIC PREVIEW (Gallery Screen: 05 Trainer Public Profile) */}
        {activeView === "preview" ? (
          <div className="max-w-md mx-auto rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-7 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
            {/* Avatar with yellow badge */}
            <div className="relative w-[76px] my-3">
              <div className="w-[76px] h-[76px] rounded-[22px] bg-[#2B2B2B] flex items-center justify-center text-white text-2xl font-bold">
                ZN
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-[26px] h-[26px] rounded-[9px] bg-[#F5C400] border-[3px] border-white" />
            </div>

            <h1 className="text-2xl font-extrabold text-[#0A0A0A] mt-2 mb-0.5">
              {formData.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mb-4">
              {formData.title} · {formData.location}
            </p>

            {/* Followers & Follow CTA */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-base font-bold text-[#0A0A0A]">{followersCount}</span>
                <span className="text-xs text-[#6B6B6B]"> followers</span>
              </div>
              <Button
                onClick={toggleFollow}
                size="sm"
                className={`rounded-full px-6 font-bold text-xs ${
                  isFollowing
                    ? "bg-[#F2F1EE] text-[#0A0A0A] hover:bg-[#E7E5E1]"
                    : "bg-[#F5C400] text-[#0A0A0A] hover:bg-[#e0b300]"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            <div className="h-[0.5px] bg-[#E7E5E1] mb-5" />

            {/* Impact & Programmes Cards (Gallery Style) */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-[18px] bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#0A0A0A]">Impact</span>
                <div className="mt-4">
                  <p className="text-2xl font-extrabold text-[#0A0A0A]">1,240</p>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">people trained</p>
                </div>
              </div>

              <div className="rounded-[18px] bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#0A0A0A]">Programmes</span>
                <div className="mt-4">
                  <p className="text-2xl font-extrabold text-[#0A0A0A]">14</p>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">4.8★ avg rating</p>
                </div>
              </div>
            </div>

            {/* Active Programme card */}
            <div className="rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-sm">
              <div className="h-20 bg-[#2B2B2B] p-2.5 flex items-end">
                <Badge variant="yellow" className="text-[10px] px-2.5 py-0.5">Active</Badge>
              </div>
              <div className="p-3.5">
                <h3 className="text-xs sm:text-sm font-bold text-[#0A0A0A]">Digital Marketing for SMEs</h3>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">32 enrolled · 4.8★</p>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT PROFILE FORM */
          <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.06)] space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0A0A0A]">Personal Details</h2>
              <p className="text-xs text-[#6B6B6B]">Update your public information</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Full Name</label>
                <Input value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className="h-11 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Email Address</label>
                <Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="h-11 rounded-xl text-sm" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Professional Title</label>
                <Input value={formData.title} onChange={(e) => updateFormData("title", e.target.value)} className="h-11 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Location</label>
                <Input value={formData.location} onChange={(e) => updateFormData("location", e.target.value)} className="h-11 rounded-xl text-sm" required />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Bio</label>
              <Textarea value={formData.bio} onChange={(e) => updateFormData("bio", e.target.value)} className="rounded-xl text-sm min-h-[90px]" />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 px-8 hover:bg-[#e0b300]">
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
