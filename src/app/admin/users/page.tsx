'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { Users, Loader2, Pencil, X, Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setUsers(data)
    setLoading(false)
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateRole = async (userId: string, role: 'client' | 'commerce' | 'admin') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
      setEditingUser(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      client: 'bg-blue-500/20 text-blue-400',
      commerce: 'bg-purple-500/20 text-purple-400',
      admin: 'bg-red-500/20 text-red-400',
    }
    const labels = {
      client: 'Cliente',
      commerce: 'Comercio',
      admin: 'Admin',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-gray-500">{users.length} usuarios registrados</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Users list */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background text-left text-sm text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Fecha registro</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-light transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name || 'Sin nombre'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 rounded-lg hover:bg-background transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditingUser(null)} />
          <div className="relative bg-surface rounded-2xl border border-border w-full max-w-sm p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Editar rol</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-surface-light rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div>
              <p className="font-medium">{editingUser.full_name || editingUser.email}</p>
              <p className="text-sm text-gray-500">{editingUser.email}</p>
            </div>
            <div className="space-y-2">
              {(['client', 'commerce', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleUpdateRole(editingUser.id, role)}
                  className={`w-full p-3 rounded-xl border transition-colors ${
                    editingUser.role === role
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-gray-500'
                  }`}
                >
                  {role === 'client' && 'Cliente'}
                  {role === 'commerce' && 'Comercio'}
                  {role === 'admin' && 'Administrador'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
