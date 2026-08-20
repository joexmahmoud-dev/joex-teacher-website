"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { SiteConfig } from "@/lib/db/types";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { useToast } from "@/components/ui/overlay";
import { SaveBar, FileUpload } from "@/components/admin/AdminFormKit";

export function SettingsForm({
  dict,
  config,
}: {
  dict: Dictionary;
  config: SiteConfig;
}) {
  const a = dict.admin;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [nameAr, setNameAr] = useState(config.teacher_name_ar);
  const [nameEn, setNameEn] = useState(config.teacher_name_en);
  const [titleAr, setTitleAr] = useState(config.teacher_title_ar);
  const [titleEn, setTitleEn] = useState(config.teacher_title_en);
  const [subjectAr, setSubjectAr] = useState(config.subject_ar);
  const [subjectEn, setSubjectEn] = useState(config.subject_en);
  const [cityAr, setCityAr] = useState(config.city_ar);
  const [cityEn, setCityEn] = useState(config.city_en);
  const [whatsapp, setWhatsapp] = useState(config.whatsapp);
  const [phone, setPhone] = useState(config.phone);
  const [email, setEmail] = useState(config.email);
  const [addressAr, setAddressAr] = useState(config.address_ar);
  const [addressEn, setAddressEn] = useState(config.address_en);
  const [bioAr, setBioAr] = useState(config.bio_ar);
  const [bioEn, setBioEn] = useState(config.bio_en);
  const [photoUrl, setPhotoUrl] = useState(config.photo_url ?? "");
  const [students, setStudents] = useState(config.students_count);
  const [years, setYears] = useState(config.years_experience);
  const [successRate, setSuccessRate] = useState(config.success_rate);
  const [examsCount, setExamsCount] = useState(config.exams_count);
  const [demoMode, setDemoMode] = useState(config.demo_mode);

  const save = async () => {
    if (!nameAr.trim() || !nameEn.trim()) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveSiteConfig } = await import("@/lib/data/admin");
      const res = await saveSiteConfig({
        teacher_name_ar: nameAr,
        teacher_name_en: nameEn,
        teacher_title_ar: titleAr,
        teacher_title_en: titleEn,
        subject_ar: subjectAr,
        subject_en: subjectEn,
        city_ar: cityAr,
        city_en: cityEn,
        whatsapp,
        phone,
        email,
        address_ar: addressAr,
        address_en: addressEn,
        bio_ar: bioAr,
        bio_en: bioEn,
        photo_url: photoUrl || null,
        students_count: Number(students) || 0,
        years_experience: Number(years) || 0,
        success_rate: Number(successRate) || 0,
        exams_count: Number(examsCount) || 0,
        demo_mode: demoMode,
      });
      if (res.ok) {
        toast("success", a.saved);
        window.location.reload();
      } else {
        toast("error", res.error === "preview_mode" ? a.previewNotice : a.saveFailed);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: "var(--fs-lg)", marginBlockEnd: "var(--sp-4)" }}>{a.siteIdentity}</h3>
      <div className="grid grid--2" style={{ gap: "0 1.5rem" }}>
        <Field label={a.teacherNameAr} required htmlFor="s-n-ar">
          <Input id="s-n-ar" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        </Field>
        <Field label={a.teacherNameEn} required htmlFor="s-n-en">
          <Input id="s-n-en" dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </Field>
        <Field label={a.teacherTitleAr} htmlFor="s-t-ar">
          <Input id="s-t-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </Field>
        <Field label={a.teacherTitleEn} htmlFor="s-t-en">
          <Input id="s-t-en" dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field label={a.subjectAr} htmlFor="s-sub-ar">
          <Input id="s-sub-ar" value={subjectAr} onChange={(e) => setSubjectAr(e.target.value)} />
        </Field>
        <Field label={a.subjectEn} htmlFor="s-sub-en">
          <Input id="s-sub-en" dir="ltr" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} />
        </Field>
        <Field label={a.cityAr} htmlFor="s-city-ar">
          <Input id="s-city-ar" value={cityAr} onChange={(e) => setCityAr(e.target.value)} />
        </Field>
        <Field label={a.cityEn} htmlFor="s-city-en">
          <Input id="s-city-en" dir="ltr" value={cityEn} onChange={(e) => setCityEn(e.target.value)} />
        </Field>
        <Field label={a.bioAr} htmlFor="s-bio-ar">
          <Textarea id="s-bio-ar" value={bioAr} onChange={(e) => setBioAr(e.target.value)} />
        </Field>
        <Field label={a.bioEn} htmlFor="s-bio-en">
          <Textarea id="s-bio-en" dir="ltr" value={bioEn} onChange={(e) => setBioEn(e.target.value)} />
        </Field>
      </div>

      <div style={{ marginBlock: "var(--sp-4)" }}>
        <FileUpload dict={dict} label={a.photo} value={photoUrl} onChange={setPhotoUrl} bucket="avatars" preview accept="image/*" />
      </div>

      <h3 style={{ fontSize: "var(--fs-lg)", marginBlock: "var(--sp-6) var(--sp-4)" }}>{a.contactInfo}</h3>
      <div className="grid grid--2" style={{ gap: "0 1.5rem" }}>
        <Field label={a.whatsapp} htmlFor="s-wa">
          <Input id="s-wa" dir="ltr" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </Field>
        <Field label={a.phone} htmlFor="s-ph">
          <Input id="s-ph" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label={a.email} htmlFor="s-em">
          <Input id="s-em" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label={a.addressAr} htmlFor="s-addr-ar">
          <Input id="s-addr-ar" value={addressAr} onChange={(e) => setAddressAr(e.target.value)} />
        </Field>
        <Field label={a.addressEn} htmlFor="s-addr-en">
          <Input id="s-addr-en" dir="ltr" value={addressEn} onChange={(e) => setAddressEn(e.target.value)} />
        </Field>
      </div>

      <h3 style={{ fontSize: "var(--fs-lg)", marginBlock: "var(--sp-6) var(--sp-4)" }}>{a.statsSection}</h3>
      <div className="grid grid--2" style={{ gap: "0 1.5rem" }}>
        <Field label={a.studentsCount} htmlFor="s-st">
          <Input id="s-st" type="number" dir="ltr" value={students} onChange={(e) => setStudents(Number(e.target.value))} />
        </Field>
        <Field label={a.yearsExperience} htmlFor="s-yr">
          <Input id="s-yr" type="number" dir="ltr" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </Field>
        <Field label={a.successRate} htmlFor="s-sr">
          <Input id="s-sr" type="number" dir="ltr" value={successRate} onChange={(e) => setSuccessRate(Number(e.target.value))} />
        </Field>
        <Field label={a.examsCount} htmlFor="s-ex">
          <Input id="s-ex" type="number" dir="ltr" value={examsCount} onChange={(e) => setExamsCount(Number(e.target.value))} />
        </Field>
      </div>

      <h3 style={{ fontSize: "var(--fs-lg)", marginBlock: "var(--sp-6) var(--sp-4)" }}>{a.demoSection}</h3>
      <label className="checkbox">
        <input type="checkbox" checked={demoMode} onChange={(e) => setDemoMode(e.target.checked)} />
        {a.demoMode}
      </label>
      <p className="field__hint" style={{ marginBlockStart: "0.4rem" }}>{a.demoModeHint}</p>

      <SaveBar dict={dict} onSave={save} saving={saving} />
    </div>
  );
}
