'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, unwrapAdmin } from '@/api/adminApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiShield, FiUser, FiEye } from 'react-icons/fi';

type UserRow = {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(15);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit, search: search.trim() || undefined, role: role || undefined });
      const d = unwrapAdmin<{ users: UserRow[]; pagination: { total: number; page: number; limit: number } }>(res);
      setUsers(d.users || []);
      setTotal(d.pagination?.total ?? 0);
    } catch {
      toast.error('Foydalanuvchilarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role]);

  useEffect(() => {
    const t = setTimeout(() => load(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const toggleRole = async (u: UserRow) => {
    const next = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Rolni "${next}" qilishni tasdiqlaysizmi?`)) return;
    try {
      await updateUser(u._id, { role: next });
      toast.success('Rol yangilandi');
      load();
    } catch {
      toast.error('Rolni o‘zgartirib bo‘lmadi');
    }
  };

  const toggleActive = async (u: UserRow) => {
    try {
      await updateUser(u._id, { isActive: !u.isActive });
      toast.success(u.isActive === false ? 'Faollashtirildi' : 'Bloklandi');
      load();
    } catch {
      toast.error('Holatni o‘zgartirib bo‘lmadi');
    }
  };

  const remove = async (u: UserRow) => {
    if (!confirm(`${u.username} ni o‘chirish? Bu qaytarilmaydi.`)) return;
    try {
      await deleteUser(u._id);
      toast.success('O‘chirildi');
      load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'O‘chirib bo‘lmadi');
    }
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Foydalanuvchilar</h2>
        <p className="mt-1 text-sm text-slate-400">
          Qidiruv, rol (user/admin) va faollik. O‘chirish — MongoDB dan foydalanuvchini butunlay yo‘q qiladi.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0f121c] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Username yoki email bo‘yicha qidirish..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500/50 focus:outline-none"
        >
          <option value="">Barcha rollar</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f121c] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 bg-slate-950/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Foydalanuvchi</th>
                <th className="px-5 py-4">Rol</th>
                <th className="px-5 py-4">Holat</th>
                <th className="px-5 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <span className="loading loading-spinner loading-md text-amber-400" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                    Hech narsa topilmadi
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-amber-200">
                          <FiUser className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium text-white">{u.username}</p>
                          <p className="max-w-[220px] truncate text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'border border-amber-500/30 bg-amber-500/15 text-amber-200'
                            : 'border border-slate-600 bg-slate-900 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={u.isActive === false ? 'text-red-400' : 'text-emerald-400'}>
                        {u.isActive === false ? 'Bloklangan' : 'Faol'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/users/${u._id}`}
                          title="Batafsil"
                          className="rounded-lg p-2 text-sky-400 hover:bg-sky-500/10"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="Rolni almashtirish"
                          onClick={() => toggleRole(u)}
                          className="rounded-lg p-2 text-amber-400 hover:bg-amber-500/10"
                        >
                          <FiShield className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Faollik"
                          onClick={() => toggleActive(u)}
                          className="rounded-lg p-2 text-slate-300 hover:bg-white/5"
                        >
                          {u.isActive === false ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          type="button"
                          title="O‘chirish"
                          onClick={() => remove(u)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-slate-500">
          <span>
            Jami: <strong className="text-slate-300">{total}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 disabled:opacity-40"
            >
              Oldingi
            </button>
            <span className="text-slate-400">
              {page} / {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 disabled:opacity-40"
            >
              Keyingi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
