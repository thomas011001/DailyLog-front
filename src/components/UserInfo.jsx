import { User } from "lucide-react";

export const UserInfo = ({ username }) => {
  return (
    <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
      {/* Avatar circle */}
      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <User size={13} className="text-primary" />
      </div>

      {/* Username */}
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-muted-foreground leading-none mb-0.5">
          Logged in as
        </span>
        <span className="text-sm font-semibold text-sidebar-foreground truncate leading-none">
          @{username}
        </span>
      </div>
    </div>
  );
};
