"use client";

import RoleSelection from "@/components/RoleSelection";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { role } = useRole();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        if (role === "publisher") {
          router.push("/dashboard/publisher");
        } else if (role === "advertiser") {
          router.push("/dashboard/advertiser");
        }
      }, 500); // Small delay for transition

      return () => clearTimeout(timer);
    }
  }, [role, router]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)]">
      <div className="w-full max-w-3xl">
          <RoleSelection selectedRole={role} isLoading={isLoading} />
      </div>
    </div>
  );
}
