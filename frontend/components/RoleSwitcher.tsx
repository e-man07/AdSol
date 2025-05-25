"use client";

import { useRole, UserRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Store, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoleSwitcherProps {
  currentRole: UserRole;
}

export default function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const { setRole } = useRole();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSwitch = () => {
    setIsLoading(true);
    
    // Determine the opposite role
    const newRole: UserRole = currentRole === "publisher" ? "advertiser" : "publisher";
    
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      setRole(newRole);
      router.push(`/dashboard/${newRole}`);
    }, 500);
  };

  // Determine the target role (opposite of current)
  const targetRole = currentRole === "publisher" ? "advertiser" : "publisher";
  const targetText = targetRole === "publisher" ? "Publisher" : "Advertiser";

  return (
    <Button
      variant="outline"
      onClick={handleRoleSwitch}
      disabled={isLoading}
      className="border-white/20 text-white hover:bg-white/10 hover:text-white transition-all rounded-md flex items-center gap-2"
    >
      {isLoading ? (
        "Switching..."
      ) : (
        <>
          {targetRole === "publisher" ? (
            <Store className="h-4 w-4" />
          ) : (
            <Users className="h-4 w-4" />
          )}
          <span>Switch to {targetText}</span>
        </>
      )}
    </Button>
  );
}
