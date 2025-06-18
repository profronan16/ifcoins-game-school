import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/supabase";
import { UserStats } from "@/components/manage/UserStats";
import { TeacherGiveCoinsSection } from "@/components/manage/TeacherGiveCoinsSection";
import { UsersTable } from "@/components/manage/UsersTable";

export function ManageStudents() {
  const { profile } = useAuth();

  const { data: users, refetch } = useQuery({
    queryKey: ["manage-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled:
      !!profile && (profile.role === "admin" || profile.role === "teacher"),
  });

  if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">
          Apenas administradores e professores podem gerenciar usuários.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <p className="text-gray-600 mt-1">
          Visualize e gerencie usuários do sistema
        </p>
      </div>

      <UserStats users={users} />

      {profile.role === "teacher" && (
        <TeacherGiveCoinsSection
          users={users}
          teacherId={profile.id}
          onSuccess={refetch}
        />
      )}

      <UsersTable users={users} />
    </div>
  );
}
