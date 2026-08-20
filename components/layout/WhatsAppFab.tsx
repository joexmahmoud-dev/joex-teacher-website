import { whatsappLink } from "@/lib/utils";
import { IconWhatsApp } from "@/components/ui/icons";

export function WhatsAppFab({ phone, message }: { phone: string; message: string }) {
  return (
    <a
      href={whatsappLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="WhatsApp"
    >
      <IconWhatsApp />
    </a>
  );
}
