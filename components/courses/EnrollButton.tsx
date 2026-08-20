"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";
import { IconCheck, IconLock, IconArrow } from "@/components/ui/icons";
import { isSupabaseConfigured } from "@/lib/db/config";

export function EnrollButton({
  courseId,
  locale,
  dict,
  prefix,
  block = true,
}: {
  courseId: string;
  locale: Locale;
  dict: Dictionary;
  prefix: string;
  block?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [enrolled, setEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;
    import("@/lib/supabase/client").then(async ({ createClient }) => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user || !alive) return;
      const { data } = await sb
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      if (alive) setEnrolled(Boolean(data));
    });
    return () => {
      alive = false;
    };
  }, [courseId]);

  const enroll = async () => {
    if (!isSupabaseConfigured()) {
      router.push(`${prefix}/login`);
      return;
    }
    setBusy(true);
    try {
      const { enrollUser } = await import("@/lib/data/writes");
      const result = await enrollUser(courseId);
      if (result.ok) {
        setEnrolled(true);
        toast("success", dict.dashboard.saved);
      } else if (result.error === "auth_required") {
        router.push(`${prefix}/login`);
      } else {
        toast("error", dict.common.error);
      }
    } finally {
      setBusy(false);
    }
  };

  if (enrolled) {
    return (
      <Button
        href={`${prefix}/dashboard`}
        variant="outline"
        block={block}
        icon={<IconCheck />}
      >
        {dict.courses.detail.enrolled}
      </Button>
    );
  }

  return (
    <Button
      onClick={enroll}
      loading={busy}
      block={block}
      icon={isSupabaseConfigured() ? <IconArrow /> : <IconLock />}
    >
      {dict.courses.detail.enrollNow}
    </Button>
  );
}
